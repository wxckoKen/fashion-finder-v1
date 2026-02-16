/**
 * Main page: search for a brand and view similar brand recommendations.
 */

import { useState, useCallback } from 'react';
import { SearchBar } from '../components/SearchBar';
import { BrandCard } from '../components/BrandCard';
import { BrandCardSkeleton } from '../components/BrandCardSkeleton';
import { FilterBar } from '../components/FilterBar';
import { FindMoreBar } from '../components/FindMoreBar';
import { StyleProfile } from '../components/StyleProfile';
import { ErrorMessage } from '../components/ErrorMessage';
import { useSearch } from '../hooks/useSearch';
import { useFavorites } from '../hooks/useFavorites';
import { applyFilters, collectTags } from '../utils/filters';
import type { FilterState, BrandRecommendation } from '../types/index';

export function HomePage() {
  const {
    data,
    extraBatches,
    allRecommendations,
    isLoading,
    isLoadingMore,
    isError,
    isSuccess,
    error,
    errorCode,
    search,
    findMore,
  } = useSearch();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Track the last query + description so retry and findMore work
  const [lastQuery, setLastQuery] = useState('');
  const [lastDescription, setLastDescription] = useState<string | undefined>();

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
      setLastDescription(description);
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

  // Handle "Find More Brands"
  const handleFindMore = useCallback(
    (opts: { pricePreference: 'more_affordable' | 'same_price' | 'any'; refinementNote: string }) => {
      if (!data) return;

      // Collect all brand names currently displayed
      const excludeBrands = [
        data.searchedBrand.name,
        ...allRecommendations.map((b) => b.name),
      ];

      findMore({
        brandName: data.searchedBrand.name,
        brandDescription: lastDescription,
        excludeBrands,
        pricePreference: opts.pricePreference,
        refinementNote: opts.refinementNote || undefined,
      });
    },
    [data, allRecommendations, lastDescription, findMore]
  );

  // Derived values — filters apply to ALL recommendations (initial + extras)
  const filteredAll = data
    ? applyFilters(allRecommendations, filters, data.searchedBrand.priceTier)
    : [];
  const allTags = data ? collectTags(allRecommendations) : [];
  const canShowAffordable = data?.searchedBrand.priceTier !== '$';

  // Split filtered brands back into initial batch + extra batches for rendering
  const filteredInitial = data
    ? applyFilters(data.recommendations, filters, data.searchedBrand.priceTier)
    : [];
  const filteredExtraBatches = data
    ? extraBatches.map((batch) => ({
        ...batch,
        brands: applyFilters(batch.brands, filters, data.searchedBrand.priceTier),
      }))
    : [];

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
            {filteredAll.length} brand{filteredAll.length !== 1 ? 's' : ''}{' '}
            found
            {filters.priceTiers.length > 0 ||
            filters.aestheticTags.length > 0 ||
            filters.affordableOnly
              ? ' (filtered)'
              : ''}
          </p>

          {/* Initial batch of brand cards */}
          {filteredInitial.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInitial.map((brand) => (
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
          )}

          {/* Extra batches — each with a divider label */}
          {filteredExtraBatches.map((batch, i) =>
            batch.brands.length > 0 ? (
              <div key={i}>
                {/* Batch divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-stone-200 dark:bg-neutral-800" />
                  <span className="text-xs font-medium text-stone-400 dark:text-neutral-500 uppercase tracking-wider">
                    {batch.label}
                  </span>
                  <div className="flex-1 h-px bg-stone-200 dark:bg-neutral-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {batch.brands.map((brand) => (
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
              </div>
            ) : null
          )}

          {/* Loading more skeletons */}
          {isLoadingMore && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-stone-200 dark:bg-neutral-800" />
                <span className="text-xs font-medium text-stone-400 dark:text-neutral-500 uppercase tracking-wider">
                  Finding more brands...
                </span>
                <div className="flex-1 h-px bg-stone-200 dark:bg-neutral-800" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BrandCardSkeleton key={`more-skel-${i}`} />
                ))}
              </div>
            </>
          )}

          {/* No results after filtering */}
          {filteredAll.length === 0 && (
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

          {/* Find More bar — always visible at the bottom of results */}
          <FindMoreBar
            onFindMore={handleFindMore}
            isLoading={isLoadingMore}
          />
        </div>
      )}
    </div>
  );
}
