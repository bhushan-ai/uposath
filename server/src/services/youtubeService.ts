import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// No longer using ffmpeg for audio streaming

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
    private static javaPath = '"C:\\Program Files\\Android\\Android Studio\\jbr\\bin\\java.exe"';
    private static bridgeJar = path.resolve('./NewPipeBridge.jar');
    private static libsDir = path.resolve('./libs');
    private static streamCache = new Map<string, { url: string, mimeType: string, expires: number }>();

    private static getClassPath() {
        const jars = [
            this.bridgeJar,
            path.join(this.libsDir, 'NewPipeExtractor.jar'),
            path.join(this.libsDir, 'timeago-parser.jar'),
            path.join(this.libsDir, 'nanojson.jar'),
            path.join(this.libsDir, 'jsoup.jar'),
            path.join(this.libsDir, 'okhttp.jar'),
            path.join(this.libsDir, 'okio.jar'),
            path.join(this.libsDir, 'jsr305.jar'),
            path.join(this.libsDir, 'rhino.jar'),
            path.join(this.libsDir, 'rhino-engine.jar'),
            path.join(this.libsDir, 'kotlin-stdlib.jar'),
            path.join(this.libsDir, 'kotlin-stdlib-common.jar')
        ];
        return jars.join(path.delimiter);
    }

    private static executeBridge(command: string, arg: string): any {
        try {
            const cp = this.getClassPath();
            // Use this.javaPath directly since it already has quotes if needed
            const cmd = `${this.javaPath} -cp "${cp}" com.buddhist.uposatha.bridge.NewPipeBridge ${command} "${arg.replace(/"/g, '\\"')}"`;
            console.log(`[YouTubeService] Executing bridge command: ${cmd}`);
            const output = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
            console.log(`[YouTubeService] Bridge output length: ${output.length} characters`);
            return JSON.parse(output);
        } catch (error: any) {
            console.error(`[YouTubeService] Bridge error (${command}):`, error.stderr || error.message);
            throw error;
        }
    }

    /**
     * Search for videos
     */
    static async search(query: string, limit: number = 20): Promise<VideoInfo[]> {
        try {
            const data = this.executeBridge('search', query);
            return (data.items || []).slice(0, limit);
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    }

    /**
     * Get Direct Audio Stream URL
     */
    static async getStreamUrlDirect(videoId: string): Promise<{ url: string, mimeType: string } | null> {
        try {
            // Check cache first
            const cacheEntry = this.streamCache.get(videoId);
            if (cacheEntry && cacheEntry.expires > Date.now()) {
                console.log(`[YouTubeService] Using cached direct URL for: ${videoId}`);
                return { url: cacheEntry.url, mimeType: cacheEntry.mimeType };
            }

            const info = await this.getVideoInfo(videoId);
            if (!info || !info.audioStreams || info.audioStreams.length === 0) return null;

            // Pick the best audio stream
            const stream = info.audioStreams[0];
            const result = {
                url: stream.url,
                mimeType: stream.mimeType
            };

            // Cache for 2 hours
            this.streamCache.set(videoId, {
                ...result,
                expires: Date.now() + (2 * 60 * 60 * 1000)
            });

            return result;
        } catch (error) {
            console.error('[YouTubeService] Error getting direct URL:', error);
            return null;
        }
    }

    /**
     * Clear cached stream URL
     */
    static clearCache(videoId: string) {
        this.streamCache.delete(videoId);
    }

    static async getVideoInfo(videoId: string): Promise<any | null> {
        try {
            const data = this.executeBridge('info', videoId);
            return data;
        } catch (error) {
            console.error('Error fetching video info:', error);
            return null;
        }
    }

    /**
     * Get channel videos
     */
    static async getChannelVideos(channelId: string, limit: number = 20): Promise<VideoInfo[]> {
        try {
            const data = this.executeBridge('channel', channelId);
            return (data.items || []).slice(0, limit);
        } catch (error) {
            console.error('[YouTubeService] Error getting channel videos:', error);
            return [];
        }
    }

    /**
     * Get channel details
     */
    static async getChannelInfo(channelId: string): Promise<ChannelInfo | null> {
        // For now using the bridge channel command to at least get a list, but for info we might need another bridge command
        // NewPipeBridge doesn't have a 'channel-info' command yet. 
        // We can just return basic info for now or add the command.
        return {
            id: channelId,
            name: 'Channel'
        };
    }

    /**
     * Get captions/lyrics
     */
    static async getCaptions(videoId: string): Promise<string | null> {
        // Bridge doesn't support captions yet
        return null;
    }
}
