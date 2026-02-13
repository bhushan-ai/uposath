import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ytsr = require('ytsr');
const ytpl = require('ytpl');
const YTDlpWrap = require('yt-dlp-wrap').default;
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

// Configure ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

export interface VideoInfo {
    id: string;
    title: string;
    description?: string;
    duration?: number;
    thumbnail?: string;
    channelId?: string;
    channelTitle?: string;
    uploadedAt?: string;
    views?: number;
}

export interface ChannelInfo {
    id: string;
    name: string;
    logo?: string;
    videoCount?: number;
}

export class YouTubeService {
    private static binaryPath = path.resolve('./yt-dlp.exe');
    private static ytDlpWrap: any = null;

    private static async getClient() {
        if (this.ytDlpWrap) return this.ytDlpWrap;

        if (!fs.existsSync(this.binaryPath)) {
            console.log('[YouTubeService] Downloading yt-dlp binary...');
            try {
                // Ensure directory exists if path has dirs (current is root so ok)
                await YTDlpWrap.downloadFromGithub(this.binaryPath);
                console.log('[YouTubeService] yt-dlp downloaded.');
            } catch (err) {
                console.error('[YouTubeService] Failed to download yt-dlp:', err);
                throw err;
            }
        }

        this.ytDlpWrap = new YTDlpWrap(this.binaryPath);
        return this.ytDlpWrap;
    }

    /**
     * Search for videos
     */
    static async search(query: string, limit: number = 20): Promise<VideoInfo[]> {
        try {
            const filters1 = await ytsr.getFilters(query);
            const filter1 = filters1.get('Type')?.get('Video');

            let searchResults;
            if (!filter1 || !filter1.url) {
                searchResults = await ytsr(query, { limit });
            } else {
                searchResults = await ytsr(filter1.url, { limit });
            }

            return this.mapYtsrResults(searchResults.items);

        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    }

    private static mapYtsrResults(items: any[]): VideoInfo[] {
        return items
            .filter(item => item.type === 'video')
            .map(item => ({
                id: item.id,
                title: item.title,
                description: item.description,
                duration: this.parseDuration(item.duration),
                thumbnail: item.bestThumbnail?.url || item.thumbnails?.[0]?.url,
                channelId: item.author?.channelID,
                channelTitle: item.author?.name,
                uploadedAt: item.uploadedAt,
                views: item.views
            }));
    }

    private static parseDuration(duration: string): number {
        if (!duration) return 0;
        const parts = duration.split(':').map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return parts[0];
    }

    /**
     * Get Audio Stream
     */
    static async getStreamUrl(videoId: string, startTime: number = 0) {
        try {
            console.log(`[YouTubeService] Generating stream for: ${videoId}`);
            const url = `https://www.youtube.com/watch?v=${videoId}`;

            const client = await this.getClient();

            // Exec stream: yt-dlp -> stdout
            const ytDlpArgs = [url, '-f', 'bestaudio'];
            const ytDlpStream = client.execStream(ytDlpArgs);

            // ffmpeg input: valid readable stream
            // We use -ss to seek if startTime is provided.
            // Note: piping already started stream so -ss on input might not be perfect
            // but -ss before -i is faster. Here input is pipe.

            let audioCommand = ffmpeg(ytDlpStream);

            if (startTime > 0) {
                // Seek input to start time
                audioCommand = audioCommand.setStartTime(startTime);
            }

            const audioStream = audioCommand
                .audioBitrate(128)
                .format('mp3')
                .on('error', (err: any) => {
                    // Suppress common premature close errors if they happen during client abort
                    if (err.message !== 'Output stream closed') {
                        console.error('[YouTubeService] FFmpeg conversion error:', err);
                    }
                });

            return {
                stream: audioStream,
                mimeType: 'audio/mpeg'
            };
        } catch (error) {
            console.error('[YouTubeService] Error getting stream:', error);
            return null;
        }
    }

    /**
     * Get video info (metadata)
     */
    static async getVideoInfo(videoId: string): Promise<VideoInfo | null> {
        try {
            const client = await this.getClient();
            const metadata = await client.getVideoInfo(`https://www.youtube.com/watch?v=${videoId}`);

            return {
                id: metadata.id,
                title: metadata.title,
                description: metadata.description || '',
                duration: metadata.duration || 0,
                thumbnail: metadata.thumbnail || '',
                channelId: metadata.channel_id,
                channelTitle: metadata.channel,
                uploadedAt: metadata.upload_date, // might need formatting
                views: metadata.view_count || 0
            };
        } catch (error) {
            console.error('Error fetching video info:', error);
            return null;
        }
    }

    /**
     * Get channel videos (retained ytpl implementation)
     */
    static async getChannelVideos(channelId: string, limit: number = 20): Promise<VideoInfo[]> {
        try {
            // Convert Channel ID (UC...) to Uploads Playlist ID (UU...)
            const playlistId = channelId.replace(/^UC/, 'UU');

            console.log(`[YouTubeService] Fetching videos for channel ${channelId} (playlist ${playlistId})`);
            const playlist = await ytpl(playlistId, { limit });

            return playlist.items.map((v: any) => ({
                id: v.id,
                title: v.title,
                description: v.shortUrl || '',
                duration: v.durationSec || 0,
                thumbnail: v.bestThumbnail?.url || v.thumbnails?.[0]?.url || '',
                channelId: channelId,
                channelTitle: v.author?.name || '',
                uploadedAt: v.uploadedAt || '',
                views: v.views || 0
            }));
        } catch (error) {
            console.error('[YouTubeService] Error getting channel videos:', error);
            return [];
        }
    }

    /**
     * Get channel details (retained ytpl implementation)
     */
    static async getChannelInfo(channelId: string): Promise<ChannelInfo | null> {
        try {
            // Convert Channel ID (UC...) to Uploads Playlist ID (UU...)
            const playlistId = channelId.replace(/^UC/, 'UU');

            // Fetch just enough to get metadata
            const playlist = await ytpl(playlistId, { limit: 1 });

            if (!playlist || !playlist.author) return null;

            return {
                id: channelId,
                name: playlist.author.name,
                logo: playlist.author.bestAvatar?.url || playlist.author.avatars?.[0]?.url || '',
                videoCount: playlist.estimatedItemCount || 0
            };

        } catch (error) {
            console.error('[YouTubeService] Error getting channel info:', error);
            return null;
        }
    }
}
