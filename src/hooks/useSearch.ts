/**
 * Hook for managing brand search state and API calls.
 *
 * Handles the full lifecycle: idle → loading → success / error.
 * Supports appending additional batches of results via "find more".
 */

import { useState, useCallback } from 'react';
import { fetchRecommendations, fetchMoreRecommendations, ApiRequestError } from '../utils/api.js';
import type { RecommendationResponse, BrandRecommendation } from '../types/index.js';

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

/** Each batch tracks where it came from for the UI divider label */
export interface ResultBatch {
  brands: BrandRecommendation[];
  label?: string; // e.g. "More brands like Aime Leon Dore"
}

interface SearchState {
  status: SearchStatus;
  data: RecommendationResponse | null;
  /** Extra batches appended via "find more" */
  extraBatches: ResultBatch[];
  /** True while a "find more" request is in-flight */
  isLoadingMore: boolean;
  error: string | null;
  errorCode: string | null;
}

export function useSearch() {
  const [state, setState] = useState<SearchState>({
    status: 'idle',
    data: null,
    extraBatches: [],
    isLoadingMore: false,
    error: null,
    errorCode: null,
  });

  const search = useCallback(async (brandName: string, brandDescription?: string) => {
    if (!brandName.trim()) return;

    setState({ status: 'loading', data: null, extraBatches: [], isLoadingMore: false, error: null, errorCode: null });

    try {
      const data = await fetchRecommendations(brandName, brandDescription);
      setState({ status: 'success', data, extraBatches: [], isLoadingMore: false, error: null, errorCode: null });
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setState({
          status: 'error',
          data: null,
          extraBatches: [],
          isLoadingMore: false,
          error: err.message,
          errorCode: err.code,
        });
      } else {
        setState({
          status: 'error',
          data: null,
          extraBatches: [],
          isLoadingMore: false,
          error: 'Unable to reach the server. Please check your connection and try again.',
          errorCode: 'network_error',
        });
      }
    }
  }, []);

  const findMore = useCallback(async (opts: {
    brandName: string;
    brandDescription?: string;
    excludeBrands: string[];
    pricePreference?: 'more_affordable' | 'same_price' | 'any';
    refinementNote?: string;
  }) => {
    setState((prev) => ({ ...prev, isLoadingMore: true }));

    try {
      const result = await fetchMoreRecommendations(opts);

      setState((prev) => ({
        ...prev,
        isLoadingMore: false,
        extraBatches: [
          ...prev.extraBatches,
          { brands: result.recommendations, label: `More brands like ${opts.brandName}` },
        ],
      }));
    } catch {
      setState((prev) => ({ ...prev, isLoadingMore: false }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, extraBatches: [], isLoadingMore: false, error: null, errorCode: null });
  }, []);

  /** All recommendations across every batch (for filtering / tag collection) */
  const allRecommendations: BrandRecommendation[] = [
    ...(state.data?.recommendations ?? []),
    ...state.extraBatches.flatMap((b) => b.brands),
  ];

  return {
    ...state,
    allRecommendations,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    search,
    findMore,
    reset,
  };
}
