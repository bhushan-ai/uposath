import { Capacitor, registerPlugin } from '@capacitor/core';
import { AudioTrack, AudioChannel } from '../../types/audio/AudioTypes';

// --- Native Plugin Definition ---
interface YouTubeExtractionPlugin {
    search(options: { query: string }): Promise<{ items: any[] }>;
    getVideoInfo(options: { videoId: string }): Promise<any>;
    getChannelVideos(options: { channelId: string }): Promise<{ items: any[] }>;
}

const YouTubeExtraction = registerPlugin<YouTubeExtractionPlugin>('YouTubeExtraction');
const isAndroid = Capacitor.getPlatform() === 'android';

// Base URL for the local audio proxy API.
// Uses Vite env when available so the app can talk to a local backend
// on any device (desktop, emulator, or phone).
const API_BASE_URL =
    import.meta.env.VITE_AUDIO_API_URL || 'http://localhost:3001/api/audio';

export const AudioService = {
    async search(query: string, limit: number = 20): Promise<AudioTrack[]> {
        if (isAndroid) {
            try {
                const { items } = await YouTubeExtraction.search({ query });
                return items.slice(0, limit).map(item => ({
                    id: item.id,
                    title: item.title,
                    thumbnail: item.thumbnail,
                    channelId: item.channelId,
                    channelTitle: item.channelTitle,
                    duration: item.duration,
                    description: '',
                    uploadedAt: '',
                    views: 0
                }));
            } catch (error) {
                console.error('Native search failed, falling back to server:', error);
            }
        }

        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to search audio');
        return response.json();
    },

    async getChannelVideos(channelId: string, limit: number = 20): Promise<AudioTrack[]> {
        if (isAndroid) {
            try {
                const { items } = await YouTubeExtraction.getChannelVideos({ channelId });
                return items.slice(0, limit).map(item => ({
                    id: item.id,
                    title: item.title,
                    thumbnail: item.thumbnail,
                    channelId: item.channelId,
                    channelTitle: item.channelTitle,
                    duration: item.duration,
                    description: '',
                    uploadedAt: '',
                    views: 0
                }));
            } catch (error) {
                console.error('Native channel videos failed, falling back to server:', error);
            }
        }

        const response = await fetch(`${API_BASE_URL}/channels/${channelId}/videos?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch channel videos');
        return response.json();
    },

    async getChannelInfo(channelId: string): Promise<AudioChannel> {
        // NewPipe doesn't have a simple "get channel info" without getting videos in my plugin yet
        // but we can just use the server for this or update the plugin later.
        const response = await fetch(`${API_BASE_URL}/channels/${channelId}`);
        if (!response.ok) throw new Error('Failed to fetch channel info');
        return response.json();
    },

    async getVideoInfo(videoId: string): Promise<AudioTrack> {
        if (isAndroid) {
            try {
                const info = await YouTubeExtraction.getVideoInfo({ videoId });
                return {
                    id: info.id,
                    title: info.title,
                    thumbnail: info.thumbnail,
                    channelId: info.channelId,
                    channelTitle: info.channelTitle,
                    duration: info.duration,
                    description: info.description || '',
                    uploadedAt: info.uploadedAt || '',
                    views: info.views || 0
                };
            } catch (error) {
                console.error('Native video info failed, falling back to server:', error);
            }
        }

        const response = await fetch(`${API_BASE_URL}/video/${videoId}`);
        if (!response.ok) throw new Error('Failed to fetch video info');
        return response.json();
    },

    async fetchStreamUrl(videoId: string, startTime: number = 0): Promise<string> {
        if (isAndroid) {
            try {
                const info = await YouTubeExtraction.getVideoInfo({ videoId });
                // NewPipe extraction returns multiple streams. We pick the first audio stream.
                if (info.audioStreams && info.audioStreams.length > 0) {
                    const directUrl = info.audioStreams[0].url;
                    console.log(`[AudioService] Using direct native URL: ${directUrl.substring(0, 50)}...`);
                    return directUrl;
                }
            } catch (error) {
                console.error('Native stream fetch failed, falling back to proxy:', error);
            }
        }
        return `${API_BASE_URL}/stream/${videoId}?t=${Math.floor(startTime)}`;
    },

    async getLyrics(videoId: string): Promise<string> {
        const response = await fetch(`${API_BASE_URL}/lyrics/${videoId}`);
        if (!response.ok) return '';
        const data = await response.json();
        return data.lyrics || '';
    }
};
