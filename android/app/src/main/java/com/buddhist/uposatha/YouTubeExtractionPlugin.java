package com.buddhist.uposatha;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.schabi.newpipe.extractor.InfoItem;
import org.schabi.newpipe.extractor.ListExtractor;
import org.schabi.newpipe.extractor.NewPipe;
import org.schabi.newpipe.extractor.ServiceList;
import org.schabi.newpipe.extractor.StreamingService;
import org.schabi.newpipe.extractor.channel.tabs.ChannelTabExtractor;
import org.schabi.newpipe.extractor.channel.tabs.ChannelTabs;
import org.schabi.newpipe.extractor.search.SearchInfo;
import org.schabi.newpipe.extractor.services.youtube.YoutubeParsingHelper;
import org.schabi.newpipe.extractor.stream.AudioStream;
import org.schabi.newpipe.extractor.stream.StreamInfo;
import org.schabi.newpipe.extractor.stream.StreamInfoItem;

import java.util.ArrayList;
import java.util.List;

@CapacitorPlugin(name = "YouTubeExtraction")
public class YouTubeExtractionPlugin extends Plugin {
    private boolean isInitialized = false;

    private synchronized void initNewPipe() {
        if (!isInitialized) {
            YoutubeParsingHelper.setConsentAccepted(true);
            NewPipe.init(new NewPipeDownloader("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"));
            isInitialized = true;
        }
    }

    @PluginMethod
    public void search(PluginCall call) {
        initNewPipe();
        String query = call.getString("query");
        if (query == null) {
            call.reject("Must provide a query");
            return;
        }

        try {
            StreamingService service = ServiceList.YouTube;
            SearchInfo searchInfo = SearchInfo.getInfo(service, service.getSearchQHFactory().fromQuery(query));
            
            JSArray results = new JSArray();
            for (InfoItem item : searchInfo.getRelatedItems()) {
                if (item instanceof StreamInfoItem) {
                    StreamInfoItem streamItem = (StreamInfoItem) item;
                    JSObject video = new JSObject();
                    video.put("id", extractVideoId(streamItem.getUrl()));
                    video.put("title", streamItem.getName());
                    video.put("duration", streamItem.getDuration());
                    video.put("thumbnail", !streamItem.getThumbnails().isEmpty() ? streamItem.getThumbnails().get(0).getUrl() : "");
                    video.put("channelId", extractChannelId(streamItem.getUploaderUrl()));
                    video.put("channelTitle", streamItem.getUploaderName());
                    video.put("views", streamItem.getViewCount());
                    video.put("uploadedAt", streamItem.getUploadDate() != null ? streamItem.getUploadDate().toString() : "");
                    results.put(video);
                }
            }
            
            JSObject response = new JSObject();
            response.put("items", results);
            call.resolve(response);
        } catch (Exception e) {
            call.reject("Search failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getVideoInfo(PluginCall call) {
        initNewPipe();
        String videoId = call.getString("videoId");
        if (videoId == null) {
            call.reject("Must provide a videoId");
            return;
        }

        try {
            StreamingService service = ServiceList.YouTube;
            StreamInfo streamInfo = StreamInfo.getInfo(service, "https://www.youtube.com/watch?v=" + videoId);
            
            JSObject result = new JSObject();
            result.put("id", videoId);
            result.put("title", streamInfo.getName());
            result.put("description", streamInfo.getDescription().getContent());
            result.put("duration", streamInfo.getDuration());
            result.put("thumbnail", !streamInfo.getThumbnails().isEmpty() ? streamInfo.getThumbnails().get(0).getUrl() : "");
            result.put("channelId", extractChannelId(streamInfo.getUploaderUrl()));
            result.put("channelTitle", streamInfo.getUploaderName());
            result.put("views", streamInfo.getViewCount());
            result.put("uploadedAt", streamInfo.getUploadDate() != null ? streamInfo.getUploadDate().toString() : "");

            JSArray audioStreams = new JSArray();
            for (AudioStream stream : streamInfo.getAudioStreams()) {
                JSObject s = new JSObject();
                s.put("url", stream.getUrl());
                s.put("format", stream.getFormat().toString());
                s.put("bitrate", stream.getAverageBitrate());
                s.put("mimeType", "audio/" + stream.getFormat().getSuffix());
                audioStreams.put(s);
            }
            result.put("audioStreams", audioStreams);
            
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Failed to get video info: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getChannelVideos(PluginCall call) {
        initNewPipe();
        String channelId = call.getString("channelId");
        if (channelId == null) {
            call.reject("Must provide a channelId");
            return;
        }

        try {
            StreamingService service = ServiceList.YouTube;
            ChannelTabExtractor tabExtractor = service.getChannelTabExtractorFromId(channelId, ChannelTabs.VIDEOS);
            tabExtractor.fetchPage();
            ListExtractor.InfoItemsPage<InfoItem> page = tabExtractor.getInitialPage();
            
            JSArray results = new JSArray();
            for (InfoItem item : page.getItems()) {
                if (item instanceof StreamInfoItem) {
                    StreamInfoItem streamItem = (StreamInfoItem) item;
                    JSObject video = new JSObject();
                    video.put("id", extractVideoId(streamItem.getUrl()));
                    video.put("title", streamItem.getName());
                    video.put("duration", streamItem.getDuration());
                    video.put("thumbnail", !streamItem.getThumbnails().isEmpty() ? streamItem.getThumbnails().get(0).getUrl() : "");
                    video.put("channelId", channelId);
                    video.put("channelTitle", streamItem.getUploaderName());
                    video.put("views", streamItem.getViewCount());
                    video.put("uploadedAt", streamItem.getUploadDate() != null ? streamItem.getUploadDate().toString() : "");
                    results.put(video);
                }
            }
            
            JSObject response = new JSObject();
            response.put("items", results);
            call.resolve(response);
        } catch (Exception e) {
            call.reject("Failed to get channel videos: " + e.getMessage());
        }
    }

    private String extractVideoId(String url) {
        if (url == null) return "";
        if (url.contains("v=")) {
            String afterV = url.split("v=")[1];
            return afterV.split("&")[0];
        }
        if (url.contains("/shorts/")) {
            return url.split("/shorts/")[1].split("\\?")[0];
        }
        return url.substring(url.lastIndexOf("/") + 1);
    }

    private String extractChannelId(String url) {
        if (url == null) return "";
        if (url.contains("/channel/")) return url.split("/channel/")[1].split("/")[0];
        if (url.contains("/c/")) return url.split("/c/")[1].split("/")[0];
        if (url.contains("/user/")) return url.split("/user/")[1].split("/")[0];
        if (url.startsWith("@")) return url;
        return url.substring(url.lastIndexOf("/") + 1);
    }
}

