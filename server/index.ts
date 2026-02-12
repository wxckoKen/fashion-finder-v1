/**
 * Express development server.
 *
 * Handles API requests during local development.
 * In production (Vercel), the /api/ serverless functions are used instead.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { getRecommendations } from './claude.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());

// Rate limit: 20 requests per minute per IP
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'rate_limited',
    message: 'Too many requests — please wait a moment and try again.',
  },
});

app.use('/api', apiLimiter);

// ─── Routes ─────────────────────────────────────────────────────────

app.post('/api/recommendations', async (req, res) => {
  const { brandName } = req.body;

  if (!brandName || typeof brandName !== 'string' || !brandName.trim()) {
    res.status(400).json({
      error: 'invalid_request',
      message: 'Please provide a brand name.',
    });
    return;
  }

  try {
    const data = await getRecommendations(brandName.trim());
    res.json(data);
  } catch (err: unknown) {
    const error = err as Error & { code?: string };
    console.error('Recommendation error:', error.message);

    // Known error codes from the Claude response
    if (error.code === 'unknown_brand' || error.code === 'not_fashion') {
      res.status(404).json({
        error: error.code,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'server_error',
      message: 'Something went wrong generating recommendations. Please try again.',
    });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ─── Start ──────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
