/**
 * Filter logic for brand recommendation results.
 */

import type {
  BrandRecommendation,
  FilterState,
  PriceTier,
} from '../types/index.js';

/** Map price tiers to a numeric value for comparison */
const PRICE_TIER_VALUE: Record<PriceTier, number> = {
  '$': 1,
  '$$': 2,
  '$$$': 3,
  '$$$$': 4,
};

/**
 * Return true if tier `a` is strictly cheaper than tier `b`.
 */
export function isCheaperThan(a: PriceTier, b: PriceTier): boolean {
  return PRICE_TIER_VALUE[a] < PRICE_TIER_VALUE[b];
}

/**
 * Apply the current filter state to a list of recommendations.
 *
 * @param brands         – the full list of recommendations
 * @param filters        – current filter state
 * @param searchedTier   – the price tier of the brand the user searched for
 */
export function applyFilters(
  brands: BrandRecommendation[],
  filters: FilterState,
  searchedTier: PriceTier
): BrandRecommendation[] {
  return brands.filter((brand) => {
    // Price tier filter — if any tiers are selected, the brand must match one
    if (
      filters.priceTiers.length > 0 &&
      !filters.priceTiers.includes(brand.priceTier)
    ) {
      return false;
    }

    // Affordable-only toggle — only show brands cheaper than the searched brand
    if (filters.affordableOnly && !isCheaperThan(brand.priceTier, searchedTier)) {
      return false;
    }

    // Aesthetic tag filter — brand must have at least one of the selected tags
    if (filters.aestheticTags.length > 0) {
      const hasMatchingTag = brand.aestheticTags.some((tag) =>
        filters.aestheticTags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });
}

/**
 * Collect all unique aesthetic tags from a list of brands.
 */
export function collectTags(brands: BrandRecommendation[]): string[] {
  const tagSet = new Set<string>();
  for (const brand of brands) {
    for (const tag of brand.aestheticTags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

/**
 * Human-readable label for a price tier.
 */
export function priceTierLabel(tier: PriceTier): string {
  const labels: Record<PriceTier, string> = {
    '$': 'Budget',
    '$$': 'Mid-Range',
    '$$$': 'Premium',
    '$$$$': 'Luxury',
  };
  return labels[tier];
}
