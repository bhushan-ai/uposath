package com.buddhist.uposatha.audio

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.audiofx.LoudnessEnhancer
import android.net.Uri
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.database.StandaloneDatabaseProvider
import androidx.media3.datasource.DataSource
import androidx.media3.datasource.DefaultDataSource
import androidx.media3.datasource.ResolvingDataSource
import androidx.media3.datasource.cache.CacheDataSource
import androidx.media3.datasource.cache.LeastRecentlyUsedCacheEvictor
import androidx.media3.datasource.cache.SimpleCache
import androidx.media3.datasource.okhttp.OkHttpDataSource
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import com.buddhist.uposatha.MainActivity
import com.buddhist.uposatha.audio.potoken.PoTokenGenerator
import com.buddhist.uposatha.innertube.NewPipeUtils
import com.buddhist.uposatha.innertube.YouTube
import com.buddhist.uposatha.innertube.models.YouTubeClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import okhttp3.OkHttpClient
import java.io.File

@UnstableApi
class AudioPlayerService : MediaSessionService() {
    private var player: ExoPlayer? = null
    private var mediaSession: MediaSession? = null
    private var loudnessEnhancer: LoudnessEnhancer? = null
    data class ResolvedStream(val url: String, val expire: Long, val userAgent: String, val clientName: String)
    private val songUrlCache = HashMap<String, ResolvedStream>()
    private val poTokenGenerator = PoTokenGenerator()

    companion object {
        private const val TAG = "AudioPlayerService"
        private const val CHANNEL_ID = "uposatha_audio_channel"
        private const val NOTIFICATION_ID = 1001
        private const val CHUNK_LENGTH = 512 * 1024L // 512KB
    }

    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "onCreate: Initializing ExoPlayer and MediaSession")
        
        // Initialize visitorData on startup to ensure PoTokens are valid
        CoroutineScope(Dispatchers.IO).launch {
            if (YouTube.visitorData == null) {
                Log.d(TAG, "Initializing visitorData...")
                YouTube.visitorData().onSuccess {
                    Log.d(TAG, "visitorData initialized: $it")
                    YouTube.visitorData = it
                }.onFailure {
                    Log.w(TAG, "Failed to initialize visitorData", it)
                }
            }
        }

        player = ExoPlayer.Builder(this)
            .setMediaSourceFactory(DefaultMediaSourceFactory(createDataSourceFactory()))
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setContentType(C.AUDIO_CONTENT_TYPE_MUSIC)
                    .setUsage(C.USAGE_MEDIA)
                    .build(),
                true
            )
            .setHandleAudioBecomingNoisy(true)
            .build()

        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        mediaSession = MediaSession.Builder(this, player!!)
            .setSessionActivity(pendingIntent)
            .build()

        player?.addListener(object : Player.Listener {
            override fun onPlaybackStateChanged(playbackState: Int) {
                Log.d(TAG, "onPlaybackStateChanged: $playbackState")
                if (playbackState == Player.STATE_READY && player?.playWhenReady == true) {
                    startForegroundWithNotification()
                    if (loudnessEnhancer == null) {
                        try {
                            val audioSessionId = player?.audioSessionId ?: C.AUDIO_SESSION_ID_UNSET
                            if (audioSessionId != C.AUDIO_SESSION_ID_UNSET) {
                                loudnessEnhancer = LoudnessEnhancer(audioSessionId).apply {
                                    setTargetGain(1000) // 10dB boost
                                    enabled = true
                                }
                                Log.d(TAG, "LoudnessEnhancer enabled for session: $audioSessionId")
                            }
                        } catch (e: Exception) {
                            Log.e(TAG, "Failed to initialize LoudnessEnhancer", e)
                        }
                    }
                } else if (playbackState == Player.STATE_IDLE || playbackState == Player.STATE_ENDED) {
                    stopForeground(STOP_FOREGROUND_DETACH)
                }
            }

            override fun onPlayerError(error: PlaybackException) {
                Log.e(TAG, "onPlayerError: code=${PlaybackException.getErrorCodeName(error.errorCode)} (${error.errorCode})", error)
            }
        })
    }

    private fun getPlaybackHeaders(clientName: String, userAgent: String): Map<String, String> {
        val headers = mutableMapOf<String, String>()
        headers["User-Agent"] = userAgent
        
        if (clientName == "WEB_REMIX") {
            headers["Referer"] = "https://music.youtube.com/"
            headers["Origin"] = "https://music.youtube.com"
            headers["X-YouTube-Client-Name"] = YouTubeClient.WEB_REMIX.clientId
            headers["X-YouTube-Client-Version"] = YouTubeClient.WEB_REMIX.clientVersion
        } else {
            val client = when (clientName) {
                "ANDROID" -> YouTubeClient.ANDROID
                "IOS" -> YouTubeClient.IOS
                "ANDROID_VR" -> YouTubeClient.ANDROID_VR_NO_AUTH
                "ANDROID_TESTSUITE" -> YouTubeClient.ANDROID_TESTSUITE
                else -> null
            }
            client?.let {
                headers["X-YouTube-Client-Name"] = it.clientId
                headers["X-YouTube-Client-Version"] = it.clientVersion
            }
        }
        return headers
    }

    private fun createDataSourceFactory(): DataSource.Factory {
        val context = this
        val httpDataSourceFactory = OkHttpDataSource.Factory(
            OkHttpClient.Builder()
                .proxy(YouTube.proxy)
                .build()
        )
        
        val cache = AudioPlayerCache.get(context)
        val cacheDataSourceFactory = CacheDataSource.Factory()
            .setCache(cache)
            .setUpstreamDataSourceFactory(DefaultDataSource.Factory(context, httpDataSourceFactory))
            .setFlags(CacheDataSource.FLAG_IGNORE_CACHE_ON_ERROR)

        return ResolvingDataSource.Factory(cacheDataSourceFactory) { dataSpec ->
            val uri = dataSpec.uri
            if (uri.toString().startsWith("urn:youtube:")) {
                val videoId = uri.schemeSpecificPart.substringAfter("youtube:")
                
                // Check memory cache for URL
                val cached = songUrlCache[videoId]
                if (cached != null && System.currentTimeMillis() < cached.expire) {
                    Log.d(TAG, "Using cached URL for $videoId resolved by ${cached.clientName}")
                    
                    return@Factory dataSpec.withUri(Uri.parse(cached.url))
                        .buildUpon()
                        .setHttpRequestHeaders(getPlaybackHeaders(cached.clientName, cached.userAgent))
                        .build()
                }
                
                // Check disk cache (skip resolution if fully cached? No, safe to resolve for now to avoid upstream errors)
                // Optimization: If we implement offline mode later, we check here.
                
                try {
                    // Clear interrupted status to avoid immediate failure in runBlocking
                    Thread.interrupted() 

                    val resolvedStream = runBlocking(Dispatchers.IO) {
                        val clients = listOf(
                            YouTubeClient.ANDROID_VR_NO_AUTH,
                            YouTubeClient.ANDROID_TESTSUITE,
                            YouTubeClient.WEB_REMIX,
                            YouTubeClient.IOS,
                            YouTubeClient.ANDROID
                        )
                        var lastError: Exception? = null
                        
                        for (resolverClient in clients) {
                            try {
                                Log.d(TAG, "[$videoId] Attempting resolution with ${resolverClient.clientName}")
                                
                                val poTokenResult = if (resolverClient.useWebPoTokens) {
                                    val sessionId = YouTube.cookie?.let { YouTube.dataSyncId } ?: YouTube.visitorData
                                    if (sessionId != null) {
                                        Log.d(TAG, "[$videoId] Requesting PoToken for $sessionId (${resolverClient.clientName})")
                                        poTokenGenerator.getWebClientPoToken(videoId, sessionId)
                                    } else {
                                        Log.w(TAG, "[$videoId] Cannot request PoToken: sessionId is null")
                                        null
                                    }
                                } else null
                                
                                val signatureTimestamp = if (resolverClient.useSignatureTimestamp) {
                                    NewPipeUtils.getSignatureTimestamp(videoId).getOrNull()
                                } else null
                                
                                val response = YouTube.player(
                                    videoId, 
                                    client = resolverClient, 
                                    signatureTimestamp = signatureTimestamp,
                                    webPlayerPot = poTokenResult?.playerRequestPoToken
                                ).getOrThrow()
                                
                                Log.d(TAG, "[$videoId] [${resolverClient.clientName}] playbackStatus: ${response.playabilityStatus.status}")
                                
                                if (response.playabilityStatus.status != "OK") {
                                    throw Exception("Status: ${response.playabilityStatus.status} (${response.playabilityStatus.reason})")
                                }
                                
                                val formats = response.streamingData?.adaptiveFormats
                                Log.d(TAG, "[$videoId] Found ${formats?.size ?: 0} adaptive formats")
                                
                                val audioFormat = formats?.filter { it.mimeType.startsWith("audio/") }
                                    ?.maxByOrNull { it.bitrate ?: 0 }
                                    ?: throw Exception("No audio stream found in player response")
                                
                                var url = NewPipeUtils.getStreamUrl(audioFormat, videoId).getOrThrow()
                                
                                if (resolverClient.useWebPoTokens && poTokenResult?.streamingDataPoToken != null) {
                                    url += "&pot=${poTokenResult.streamingDataPoToken}"
                                }
                                
                                Log.d(TAG, "[$videoId] Validating stream status for ${resolverClient.clientName}...")
                                val validationHeaders = mutableMapOf<String, String>()
                                validationHeaders["User-Agent"] = resolverClient.userAgent
                                validationHeaders["X-YouTube-Client-Name"] = resolverClient.clientId
                                validationHeaders["X-YouTube-Client-Version"] = resolverClient.clientVersion
                                
                                if (resolverClient.clientName == "WEB_REMIX") {
                                    validationHeaders["Referer"] = "https://music.youtube.com/"
                                    validationHeaders["Origin"] = "https://music.youtube.com"
                                }

                                if (validateStatus(url, validationHeaders)) {
                                    // Calculate expiration
                                    val expire = Uri.parse(url).getQueryParameter("expire")?.toLongOrNull()?.times(1000L) 
                                        ?: (System.currentTimeMillis() + 3600_000L)
                                    
                                    Log.i(TAG, "[$videoId] Successfully resolved URL with ${resolverClient.clientName}")
                                    return@runBlocking ResolvedStream(url, expire, resolverClient.userAgent, resolverClient.clientName)
                                } else {
                                    throw Exception("Stream validation failed (HEAD/GET range request failed)")
                                }
                            } catch (e: Exception) {
                                Log.w(TAG, "[$videoId] Client ${resolverClient.clientName} failed: ${e.message}")
                                lastError = e
                            }
                        }
                        throw lastError ?: Exception("All clients failed to resolve stream for videoId: $videoId. Last error: ${lastError?.message ?: "Unknown"}")
                    }
                    
                    songUrlCache[videoId] = resolvedStream
                    Log.d(TAG, "Resolved URL for $videoId with ${resolvedStream.clientName}")
                    
                    return@Factory dataSpec.withUri(Uri.parse(resolvedStream.url))
                        .buildUpon()
                        .setHttpRequestHeaders(getPlaybackHeaders(resolvedStream.clientName, resolvedStream.userAgent))
                        .build()
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to resolve URL for $videoId", e)
                    throw PlaybackException(
                        "Failed to resolve URL: ${e.message}",
                        e,
                        PlaybackException.ERROR_CODE_IO_NETWORK_CONNECTION_FAILED
                    )
                }
            }
            return@Factory dataSpec
        }
    }

    private fun validateStatus(url: String, headers: Map<String, String>): Boolean {
        return try {
            val httpClient = OkHttpClient.Builder()
                .proxy(YouTube.proxy)
                .followRedirects(true)
                .build()
            val requestBuilder = okhttp3.Request.Builder()
                .get() 
                .url(url)
                .header("Range", "bytes=0-10240") 
            
            headers.forEach { (name, value) -> 
                requestBuilder.header(name, value)
            }
            
            httpClient.newCall(requestBuilder.build()).execute().use { response ->
                Log.d(TAG, "Validation response: ${response.code} for ${resolvedStreamDebug(url)}")
                response.isSuccessful || response.code == 206
            }
        } catch (e: Exception) {
            Log.e(TAG, "Stream validation error", e)
            false
        }
    }

    private fun resolvedStreamDebug(url: String): String {
        val uri = Uri.parse(url)
        return "host=${uri.host ?: "null"}, expire=${uri.getQueryParameter("expire") ?: "null"}"
    }

    private fun startForegroundWithNotification() {
        val builder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setContentTitle("Dhamma Talk")
            .setContentText("Playing audio...")
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setOngoing(true)

        startForeground(NOTIFICATION_ID, builder.build())
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession? = mediaSession

    override fun onDestroy() {
        Log.d(TAG, "onDestroy: Releasing resources")
        player?.release()
        player = null
        mediaSession?.release()
        mediaSession = null
        loudnessEnhancer?.release()
        loudnessEnhancer = null
        super.onDestroy()
    }
}
