import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Readable } from 'stream';
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
 * Optimized Audio Stream (Direct Proxy with Range Support)
 */
app.get('/api/audio/stream/:id', async (req, res) => {
    const { id } = req.params;
    const range = req.headers.range;

    try {
        console.log(`[Proxy] Requesting stream for ${id} (Range: ${range || 'none'})`);

        // Step 1: Get the direct GoogleVideo URL
        const streamInfo = await YouTubeService.getStreamUrlDirect(id);

        if (!streamInfo) {
            console.log(`[Proxy] Stream extraction failed for ${id}`);
            return res.status(404).json({ error: 'Stream not found' });
        }

        // Step 2: Proxy the direct URL with Range support
        const headers: Record<string, string> = {
            'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.youtube.com/'
        };

        if (range) {
            headers['Range'] = range;
        }

        const fetchFn = (globalThis as any).fetch;
        if (!fetchFn) throw new Error('Native fetch not available');

        let response = await fetchFn(streamInfo.url, { headers });

        console.log(`[Proxy] ${id} status: ${response.status} | range: ${range || 'no'}`);

        // Handle 403 (Expired/Blocked)
        if (response.status === 403) {
            console.log(`[Proxy] 403 Forbidden for ${id}. Clearing cache and retrying fresh URL.`);
            YouTubeService.clearCache(id);
            const freshInfo = await YouTubeService.getStreamUrlDirect(id);
            if (freshInfo) {
                response = await fetchFn(freshInfo.url, { headers });
                console.log(`[Proxy] Retry status: ${response.status}`);
            }
        }

        if (!response.ok && response.status !== 206) {
            console.error(`[Proxy] YouTube failure: ${response.status} ${response.statusText}`);
            return res.status(response.status).json({ error: 'Upstream failure' });
        }

        // Step 3: Forward appropriate headers back to client
        res.status(response.status);

        // Forward essential headers
        const headersToForward = ['content-type', 'content-length', 'content-range', 'accept-ranges', 'cache-control'];
        headersToForward.forEach(h => {
            const val = response.headers.get(h);
            if (val) {
                // If it's content-type, let's clean it up for the browser
                if (h === 'content-type') {
                    let cleaned = val.replace('video/mp4', 'audio/mp4')
                        .replace('video/webm', 'audio/webm');
                    // Sometimes complex codec strings break certain browsers
                    // Only keep the primary type if the browser is struggling
                    res.setHeader(h, cleaned);
                } else {
                    res.setHeader(h, val);
                }
            }
        });

        // Browsers need this to enable seeking
        if (!res.getHeader('accept-ranges')) {
            res.setHeader('Accept-Ranges', 'bytes');
        }

        // Final fallback for mime type
        if (!res.getHeader('content-type')) {
            res.setHeader('Content-Type', streamInfo.mimeType);
        }

        if (!response.body) {
            console.error(`[Proxy] Empty body from YouTube for ${id}`);
            return res.status(500).end();
        }

        // Step 4: Pipe the web stream to Node response
        const nodeStream = Readable.fromWeb(response.body as any);

        nodeStream.pipe(res);

        nodeStream.on('error', (err: any) => {
            console.error(`[Proxy] Pipe error for ${id}:`, err);
            if (!res.headersSent) res.status(500).end();
            else res.end();
        });

        res.on('close', () => {
            try {
                nodeStream.destroy();
            } catch (e) { }
        });

    } catch (error: any) {
        console.error(`[Proxy] Fatal error for ${id}:`, error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to stream audio', details: error.message });
        }
    }
});

/**
 * Get Lyrics/Captions
 */
app.get('/api/audio/lyrics/:id', async (req, res) => {
    const { id } = req.params;
    const lyrics = await YouTubeService.getCaptions(id);
    if (!lyrics) return res.json({ lyrics: '' });
    res.json({ lyrics });
});

// Start server
app.listen(PORT as number, '0.0.0.0', () => {
    console.log(`Dhamma Audio Proxy running on port ${PORT} (NewPipe Bridge v1)`);
});
