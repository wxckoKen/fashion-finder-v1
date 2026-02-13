/**
 * Core Claude API integration for brand recommendations.
 *
 * This module is imported by both the Express dev server and
 * the Vercel serverless function so the logic stays in one place.
 */

import Anthropic from '@anthropic-ai/sdk';
import { BRAND_DISCOVERY_PROMPT } from './prompts/brand-discovery.js';
import type { RecommendationResponse } from '../src/types/index.js';

// Lazy-initialize the client so the module can be imported
// even when the env var isn't set (e.g., during build).
let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

/**
 * Ask Claude for brand recommendations based on a search query.
 * Returns the parsed JSON response or throws on failure.
 */
export async function getRecommendations(
  brandName: string
): Promise<RecommendationResponse> {
  const anthropic = getClient();

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    system: BRAND_DISCOVERY_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Find fashion brands similar to: ${brandName}`,
      },
    ],
  });

  // Extract the text content from the response
  const textBlock = message.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  let raw = textBlock.text.trim();

  // Strip markdown code fences if Claude wraps the JSON in ```json ... ```
  if (raw.startsWith('```')) {
    raw = raw.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  // Attempt to parse the JSON — Claude should return raw JSON per the prompt
  try {
    const parsed = JSON.parse(raw);

    // Check if Claude returned an error object (unknown/non-fashion brand)
    if (parsed.error) {
      const err = new Error(parsed.message || 'Unknown brand') as Error & {
        code: string;
      };
      err.code = parsed.error;
      throw err;
    }

    return parsed as RecommendationResponse;
  } catch (e) {
    // If parse fails, the response wasn't valid JSON
    if (e instanceof SyntaxError) {
      console.error('Claude returned invalid JSON:', raw.slice(0, 200));
      throw new Error('Failed to parse recommendation data');
    }
    throw e;
  }
}
