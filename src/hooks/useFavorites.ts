/**
 * Hook for managing saved/favorited brands in localStorage.
 *
 * Provides add, remove, toggle, and check operations.
 * Data is persisted as JSON under the "itsv-favorites" key.
 */

import { useState, useCallback, useEffect } from 'react';
import type { FavoriteBrand, BrandRecommendation } from '../types/index.js';

const STORAGE_KEY = 'itsv-favorites';

function loadFavorites(): FavoriteBrand[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: FavoriteBrand[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteBrand[]>(loadFavorites);

  // Persist whenever favorites change
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  /** Add a brand to favorites */
  const addFavorite = useCallback(
    (brand: BrandRecommendation, searchedFrom: string) => {
      setFavorites((prev) => {
        // Don't add duplicates (match by name)
        if (prev.some((f) => f.name === brand.name)) return prev;
        return [
          ...prev,
          { ...brand, savedAt: new Date().toISOString(), searchedFrom },
        ];
      });
    },
    []
  );

  /** Remove a brand from favorites by name */
  const removeFavorite = useCallback((brandName: string) => {
    setFavorites((prev) => prev.filter((f) => f.name !== brandName));
  }, []);

  /** Toggle a brand's favorite status */
  const toggleFavorite = useCallback(
    (brand: BrandRecommendation, searchedFrom: string) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.name === brand.name);
        if (exists) {
          return prev.filter((f) => f.name !== brand.name);
        }
        return [
          ...prev,
          { ...brand, savedAt: new Date().toISOString(), searchedFrom },
        ];
      });
    },
    []
  );

  /** Check if a brand is in favorites */
  const isFavorite = useCallback(
    (brandName: string) => favorites.some((f) => f.name === brandName),
    [favorites]
  );

  /** Group favorites by their aesthetic tags (first tag) */
  const groupedByAesthetic = useCallback(() => {
    const groups: Record<string, FavoriteBrand[]> = {};
    for (const fav of favorites) {
      const key = fav.aestheticTags[0] || 'Other';
      if (!groups[key]) groups[key] = [];
      groups[key].push(fav);
    }
    return groups;
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    groupedByAesthetic,
    count: favorites.length,
  };
}
