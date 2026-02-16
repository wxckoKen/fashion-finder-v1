/**
 * Vercel serverless function for brand recommendations.
 *
 * Deployed at /api/recommendations — mirrors the Express route
 * but uses the Vercel serverless function signature.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRecommendations } from '../../server/claude.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      error: 'method_not_allowed',
      message: 'Use POST to get brand recommendations.',
    });
  }

  const { brandName, brandDescription } = req.body;

  if (!brandName || typeof brandName !== 'string' || !brandName.trim()) {
    return res.status(400).json({
      error: 'invalid_request',
      message: 'Please provide a brand name.',
    });
  }

  try {
    const data = await getRecommendations(brandName.trim(), brandDescription);
    return res.status(200).json(data);
  } catch (err: unknown) {
    const error = err as Error & { code?: string };
    console.error('Recommendation error:', error.message);

    if (error.code === 'unknown_brand' || error.code === 'not_fashion' || error.code === 'low_confidence') {
      return res.status(404).json({
        error: error.code,
        message: error.message,
      });
    }

    return res.status(500).json({
      error: 'server_error',
      message: 'Something went wrong generating recommendations. Please try again.',
    });
  }
}
