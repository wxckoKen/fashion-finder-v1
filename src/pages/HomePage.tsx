/**
 * Main page: search for a brand and view similar brand recommendations.
 */

import { useState, useCallback } from 'react';
import { SearchBar } from '../components/SearchBar';
import { BrandCard } from '../components/BrandCard';
import { BrandCardSkeleton } from '../components/BrandCardSkeleton';
import { FilterBar } from '../components/FilterBar';
import { StyleProfile } from '../components/StyleProfile';
import { ErrorMessage } from '../components/ErrorMessage';
import { useSearch } from '../hooks/useSearch';
import { useFavorites } from '../hooks/useFavorites';
import { applyFilters, collectTags } from '../utils/filters';
import type { FilterState, BrandRecommendation } from '../types/index';

export function HomePage() {
  const { data, isLoading, isError, isSuccess, error, errorCode, search } = useSearch();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Track the last query so the retry button works even on error
  const [lastQuery, setLastQuery] = useState('');

  // When the API returns low_confidence, prompt for a description
  const promptForDescription = errorCode === 'low_confidence';

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    priceTiers: [],
    aestheticTags: [],
    affordableOnly: false,
  });

  // Reset filters when a new search is performed
  const handleSearch = useCallback(
    (query: string, description?: string) => {
      setLastQuery(query);
      setFilters({ priceTiers: [], aestheticTags: [], affordableOnly: false });
      search(query, description);
    },
    [search]
  );

  // Handle clicking an aesthetic tag on a brand card → add it to filters
  const handleTagClick = useCallback(
    (tag: string) => {
      setFilters((prev) => {
        if (prev.aestheticTags.includes(tag)) {
          return {
            ...prev,
            aestheticTags: prev.aestheticTags.filter((t) => t !== tag),
          };
        }
        return { ...prev, aestheticTags: [...prev.aestheticTags, tag] };
      });
    },
    []
  );

  // Handle toggling a favorite
  const handleToggleFavorite = useCallback(
    (brand: BrandRecommendation) => {
      if (data?.searchedBrand) {
        toggleFavorite(brand, data.searchedBrand.name);
      }
    },
    [data, toggleFavorite]
  );

  // Derived values
  const filteredBrands = data
    ? applyFilters(data.recommendations, filters, data.searchedBrand.priceTier)
    : [];
  const allTags = data ? collectTags(data.recommendations) : [];
  // Can show "affordable only" if the searched brand isn't already the cheapest
  const canShowAffordable = data?.searchedBrand.priceTier !== '$';

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
      {/* ── Hero / Search ─────────────────────────────────────── */}
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="heading text-4xl sm:text-5xl lg:text-6xl text-stone-900 dark:text-stone-100 mb-4">
          Find your next
          <br />
          <em className="text-accent">favorite brand</em>
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-lg mb-8 max-w-xl mx-auto">
          Enter a fashion brand you love and discover similar brands by
          aesthetic, price point, and style DNA.
        </p>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} promptForDescription={promptForDescription} />
      </div>

      {/* ── Loading skeletons ─────────────────────────────────── */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <BrandCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────── */}
      {isError && error && (
        <ErrorMessage message={error} onRetry={lastQuery ? () => handleSearch(lastQuery) : undefined} />
      )}

      {/* ── Results ───────────────────────────────────────────── */}
      {isSuccess && data && (
        <div className="space-y-8">
          {/* Brand profile header */}
          <div className="text-center">
            <p className="text-sm text-stone-400 dark:text-neutral-500 mb-1">
              Brands similar to
            </p>
            <h2 className="heading text-3xl text-stone-900 dark:text-stone-100">
              {data.searchedBrand.name}
            </h2>
            <p className="mt-2 text-stone-500 dark:text-stone-400 max-w-lg mx-auto">
              {data.searchedBrand.description}
            </p>
          </div>

          {/* Style profile + filters row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Radar chart */}
            <div className="lg:col-span-1">
              <StyleProfile
                brandName={data.searchedBrand.name}
                scores={data.searchedBrand.aestheticScores}
              />
            </div>

            {/* Filters */}
            <div className="lg:col-span-2 flex items-start">
              <div className="w-full rounded-2xl border border-stone-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <FilterBar
                  filters={filters}
                  onFiltersChange={setFilters}
                  availableTags={allTags}
                  canShowAffordable={canShowAffordable}
                />
              </div>
            </div>
          </div>

          {/* Result count */}
          <p className="text-sm text-stone-400 dark:text-neutral-500">
            {filteredBrands.length} brand{filteredBrands.length !== 1 ? 's' : ''}{' '}
            found
            {filters.priceTiers.length > 0 ||
            filters.aestheticTags.length > 0 ||
            filters.affordableOnly
              ? ' (filtered)'
              : ''}
          </p>

          {/* Brand cards grid */}
          {filteredBrands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBrands.map((brand) => (
                <BrandCard
                  key={brand.name}
                  brand={brand}
                  searchedFrom={data.searchedBrand.name}
                  isFavorite={isFavorite(brand.name)}
                  onToggleFavorite={handleToggleFavorite}
                  onTagClick={handleTagClick}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-stone-400 dark:text-neutral-500">
                No brands match the current filters.{' '}
                <button
                  onClick={() =>
                    setFilters({
                      priceTiers: [],
                      aestheticTags: [],
                      affordableOnly: false,
                    })
                  }
                  className="text-accent hover:text-accent-hover underline underline-offset-2"
                >
                  Clear filters
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
