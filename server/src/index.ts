import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { YouTubeService } from './services/youtubeService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- API Routes ---

/**
 * Search videos
 */
app.get('/api/audio/search', async (req, res) => {
    const { q, limit } = req.query;
    if (!q) return res.status(400).json({ error: 'Query is required' });

    const results = await YouTubeService.search(q as string, parseInt(limit as string) || 20);
    res.json(results);
});

/**
 * Get channel videos
 */
app.get('/api/audio/channels/:id/videos', async (req, res) => {
    const { id } = req.params;
    const { limit } = req.query;

    const results = await YouTubeService.getChannelVideos(id, parseInt(limit as string) || 20);
    res.json(results);
});

/**
 * Get channel info
 */
app.get('/api/audio/channels/:id', async (req, res) => {
    const { id } = req.params;
    const info = await YouTubeService.getChannelInfo(id);
    if (!info) return res.status(404).json({ error: 'Channel not found' });
    res.json(info);
});

/**
 * Get video info
 */
app.get('/api/audio/video/:id', async (req, res) => {
    const { id } = req.params;
    const info = await YouTubeService.getVideoInfo(id);
    if (!info) return res.status(404).json({ error: 'Video not found' });
    res.json(info);
});

/**
 * Direct Audio Stream (Proxy)
 */
app.get('/api/audio/stream/:id', async (req, res) => {
    const { id } = req.params;
    const startTime = parseInt(req.query.t as string) || 0;
    try {
        const streamInfo = await YouTubeService.getStreamUrl(id, startTime);
        if (!streamInfo) return res.status(404).json({ error: 'Stream not found' });

        res.setHeader('Content-Type', streamInfo.mimeType || 'audio/webm');
        res.setHeader('Cache-Control', 'public, max-age=3600');

        console.log(`[Proxy] Streaming ${id} | MIME: ${streamInfo.mimeType}`);

        streamInfo.stream.pipe(res);

        streamInfo.stream.on('error', (err: any) => {
            console.error(`[Proxy] Stream error for ${id}:`, err);
            if (!res.headersSent) res.status(500).end();
            else res.end();
        });

        res.on('close', () => {
            if (streamInfo.stream.destroy) streamInfo.stream.destroy();
        });

    } catch (error: any) {
        console.error(`[Proxy] Fatal error for ${id}:`, error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to stream audio', details: error.message });
        }
    }
});

// Start server
app.listen(PORT as number, '0.0.0.0', () => {
    console.log(`Dhamma Audio Proxy running on port ${PORT} (v3 - yt-dlp + ytpl)`);
});
