/**
 * Hook for managing brand search state and API calls.
 *
 * Handles the full lifecycle: idle → loading → success / error.
 */

import { useState, useCallback } from 'react';
import { fetchRecommendations, ApiRequestError } from '../utils/api.js';
import type { RecommendationResponse } from '../types/index.js';

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

interface SearchState {
  status: SearchStatus;
  data: RecommendationResponse | null;
  error: string | null;
  errorCode: string | null;
}

export function useSearch() {
  const [state, setState] = useState<SearchState>({
    status: 'idle',
    data: null,
    error: null,
    errorCode: null,
  });

  const search = useCallback(async (brandName: string) => {
    if (!brandName.trim()) return;

    setState({ status: 'loading', data: null, error: null, errorCode: null });

    try {
      const data = await fetchRecommendations(brandName);
      setState({ status: 'success', data, error: null, errorCode: null });
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setState({
          status: 'error',
          data: null,
          error: err.message,
          errorCode: err.code,
        });
      } else {
        setState({
          status: 'error',
          data: null,
          error: 'Unable to reach the server. Please check your connection and try again.',
          errorCode: 'network_error',
        });
      }
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null, errorCode: null });
  }, []);

  return {
    ...state,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    search,
    reset,
  };
}
