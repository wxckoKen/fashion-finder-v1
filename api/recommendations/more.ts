import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getMoreRecommendations } from '../../server/claude.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      error: 'method_not_allowed',
      message: 'Use POST to get more brand recommendations.',
    });
  }

  const { brandName, brandDescription, excludeBrands, pricePreference, refinementNote } = req.body;

  if (!brandName || typeof brandName !== 'string' || !brandName.trim()) {
    return res.status(400).json({ error: 'invalid_request', message: 'Please provide a brand name.' });
  }
  if (!Array.isArray(excludeBrands)) {
    return res.status(400).json({ error: 'invalid_request', message: 'excludeBrands must be an array.' });
  }

  try {
    const data = await getMoreRecommendations({
      brandName: brandName.trim(),
      brandDescription,
      excludeBrands,
      pricePreference,
      refinementNote,
    });
    return res.status(200).json(data);
  } catch (err: unknown) {
    const error = err as Error & { code?: string };
    console.error('More recommendations error:', error.message);
    return res.status(500).json({
      error: 'server_error',
      message: 'Something went wrong generating recommendations. Please try again.',
    });
  }
}
