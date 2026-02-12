import { SlidersHorizontal } from 'lucide-react';
import type { FilterState, PriceTier } from '../types/index';
import { priceTierLabel } from '../utils/filters';

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  /** All available aesthetic tags from the current results */
  availableTags: string[];
  /** Whether the searched brand is already the cheapest tier */
  canShowAffordable: boolean;
}

const PRICE_TIERS: PriceTier[] = ['$', '$$', '$$$', '$$$$'];

export function FilterBar({
  filters,
  onFiltersChange,
  availableTags,
  canShowAffordable,
}: FilterBarProps) {
  /** Toggle a price tier on/off */
  function toggleTier(tier: PriceTier) {
    const current = filters.priceTiers;
    const next = current.includes(tier)
      ? current.filter((t) => t !== tier)
      : [...current, tier];
    onFiltersChange({ ...filters, priceTiers: next });
  }

  /** Toggle an aesthetic tag on/off */
  function toggleTag(tag: string) {
    const current = filters.aestheticTags;
    const next = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    onFiltersChange({ ...filters, aestheticTags: next });
  }

  /** Toggle the affordable-only switch */
  function toggleAffordable() {
    onFiltersChange({ ...filters, affordableOnly: !filters.affordableOnly });
  }

  /** Clear all active filters */
  function clearAll() {
    onFiltersChange({ priceTiers: [], aestheticTags: [], affordableOnly: false });
  }

  const hasActiveFilters =
    filters.priceTiers.length > 0 ||
    filters.aestheticTags.length > 0 ||
    filters.affordableOnly;

  return (
    <div className="space-y-4">
      {/* ── Section header ────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-300">
          <SlidersHorizontal size={16} />
          <span>Filter results</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Price tier buttons ────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-stone-400 dark:text-neutral-500 mr-1">
          Price:
        </span>
        {PRICE_TIERS.map((tier) => {
          const active = filters.priceTiers.includes(tier);
          return (
            <button
              key={tier}
              onClick={() => toggleTier(tier)}
              className={`focus-ring rounded-full px-3 py-1 text-xs font-medium transition-all ${
                active
                  ? 'bg-accent text-white'
                  : 'border border-stone-200 text-stone-500 hover:border-accent hover:text-accent dark:border-neutral-700 dark:text-stone-400 dark:hover:border-accent dark:hover:text-accent'
              }`}
            >
              {tier} {priceTierLabel(tier)}
            </button>
          );
        })}
      </div>

      {/* ── Affordable toggle ─────────────────────────────────── */}
      {canShowAffordable && (
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className={`relative h-5 w-9 rounded-full transition-colors ${
              filters.affordableOnly
                ? 'bg-accent'
                : 'bg-stone-300 dark:bg-neutral-600'
            }`}
          >
            <div
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                filters.affordableOnly ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
            <input
              type="checkbox"
              checked={filters.affordableOnly}
              onChange={toggleAffordable}
              className="sr-only"
            />
          </div>
          <span className="text-sm text-stone-600 dark:text-stone-300">
            Show only more affordable alternatives
          </span>
        </label>
      )}

      {/* ── Aesthetic tag pills ────────────────────────────────── */}
      {availableTags.length > 0 && (
        <div>
          <span className="text-xs text-stone-400 dark:text-neutral-500 mb-2 block">
            Aesthetic:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {availableTags.map((tag) => {
              const active = filters.aestheticTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`focus-ring rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    active
                      ? 'bg-accent text-white'
                      : 'border border-stone-200 text-stone-500 hover:border-accent hover:text-accent dark:border-neutral-700 dark:text-stone-400 dark:hover:border-accent dark:hover:text-accent'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
