package com.buddhist.uposatha.bridge;

import org.schabi.newpipe.extractor.downloader.Downloader;
import org.schabi.newpipe.extractor.downloader.Request;
import org.schabi.newpipe.extractor.downloader.Response;
import org.schabi.newpipe.extractor.exceptions.ReCaptchaException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import okhttp3.Cookie;
import okhttp3.CookieJar;
import okhttp3.HttpUrl;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.RequestBody;

public class BridgeDownloader extends Downloader {
    private final OkHttpClient client;
    private final String userAgent;
    private final Map<String, List<Cookie>> cookieStore = new HashMap<>();

    public BridgeDownloader(String userAgent) {
        this.userAgent = userAgent;
        this.client = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .followRedirects(true)
                .followSslRedirects(true)
                .cookieJar(new CookieJar() {
                    @Override
                    public void saveFromResponse(HttpUrl url, List<Cookie> cookies) {
                        List<Cookie> existing = cookieStore.getOrDefault(url.host(), new ArrayList<>());
                        for (Cookie newCookie : cookies) {
                            existing.removeIf(c -> c.name().equals(newCookie.name()));
                            existing.add(newCookie);
                        }
                        cookieStore.put(url.host(), existing);
                    }

                    @Override
                    public List<Cookie> loadForRequest(HttpUrl url) {
                        return cookieStore.getOrDefault(url.host(), new ArrayList<>());
                    }
                })
                .build();
    }

    @Override
    public Response execute(Request request) throws IOException, ReCaptchaException {
        String url = request.url();
        String method = request.httpMethod();
        Map<String, List<String>> headersMap = request.headers();
        byte[] data = request.dataToSend();

        okhttp3.Request.Builder builder = new okhttp3.Request.Builder()
                .url(url);

        // Copy headers from NewPipe
        if (headersMap != null) {
            for (Map.Entry<String, List<String>> entry : headersMap.entrySet()) {
                String key = entry.getKey();
                for (String value : entry.getValue()) {
                    builder.addHeader(key, value);
                }
            }
        }

        // Apply refined InnerTube headers if it's an InnerTube request
        if (url.contains("youtubei/v1")) {
            builder.header("X-Goog-Api-Format-Version", "1");
            builder.header("X-YouTube-Client-Name", "1");
            builder.header("X-YouTube-Client-Version", "2.20260124.00.00");
            builder.header("Origin", "https://www.youtube.com");
            builder.header("Referer", "https://www.youtube.com/");
            builder.header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0");
        } else {
            // Default User-Agent if not set by NewPipe or InnerTube logic
            if (headersMap == null || !headersMap.containsKey("User-Agent")) {
                builder.header("User-Agent", userAgent);
            }
        }

        if (method.equalsIgnoreCase("POST")) {
            MediaType mediaType = null;
            if (headersMap != null && headersMap.containsKey("Content-Type")) {
                mediaType = MediaType.parse(headersMap.get("Content-Type").get(0));
            }
            builder.post(RequestBody.create(mediaType, data != null ? data : new byte[0]));
        } else {
            builder.get();
        }

        okhttp3.Response response = client.newCall(builder.build()).execute();

        int responseCode = response.code();
        String responseMessage = response.message();
        Map<String, List<String>> responseHeaders = response.headers().toMultimap();
        String responseBody = "";
        if (response.body() != null) {
            responseBody = response.body().string();
        }

        if (responseCode >= 400 || responseBody.contains("The page needs to be reloaded")) {
            System.err.println("[BridgeDownloader] Error Response URL: " + url + " CODE: " + responseCode);
            String logBody = responseBody.length() > 500 ? responseBody.substring(0, 500) : responseBody;
            System.err.println("[BridgeDownloader] Response Body (start): " + logBody);
        }

        if (responseCode == 429) {
            throw new ReCaptchaException("reCAPTCHA required (429)", url);
        }

        String finalUrl = response.request().url().toString();

        return new Response(responseCode, responseMessage, responseHeaders, responseBody, finalUrl);
    }
}




