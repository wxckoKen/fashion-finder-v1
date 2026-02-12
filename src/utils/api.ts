/**
 * API client for the brand recommendation backend.
 *
 * All fetch calls go through here so we have a single place
 * to handle errors, base URLs, and response parsing.
 */

import type { RecommendationResponse, ApiError } from '../types/index.js';

const API_BASE = '/api';

/**
 * Custom error that carries the structured API error info.
 */
export class ApiRequestError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
  }
}

/**
 * Fetch brand recommendations for a given brand name.
 */
export async function fetchRecommendations(
  brandName: string
): Promise<RecommendationResponse> {
  const res = await fetch(`${API_BASE}/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brandName }),
  });

  // Try to parse the JSON body regardless of status code
  const data: RecommendationResponse | ApiError = await res.json();

  if (!res.ok) {
    const err = data as ApiError;
    throw new ApiRequestError(
      err.error || 'unknown_error',
      err.message || 'An unexpected error occurred.'
    );
  }

  return data as RecommendationResponse;
}
