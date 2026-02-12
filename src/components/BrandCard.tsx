import { ExternalLink } from 'lucide-react';
import type { BrandRecommendation } from '../types/index';
import { FavoriteButton } from './FavoriteButton';
import { priceTierLabel } from '../utils/filters';

interface BrandCardProps {
  brand: BrandRecommendation;
  /** Name of the brand the user originally searched for */
  searchedFrom: string;
  /** Whether this brand is in the user's favorites */
  isFavorite: boolean;
  /** Called when the favorite button is toggled */
  onToggleFavorite: (brand: BrandRecommendation) => void;
  /** Called when an aesthetic tag is clicked */
  onTagClick?: (tag: string) => void;
}

/** Color mapping for price tier badges */
const TIER_COLORS: Record<string, string> = {
  '$': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  '$$': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  '$$$': 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
  '$$$$': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
};

export function BrandCard({
  brand,
  searchedFrom,
  isFavorite,
  onToggleFavorite,
  onTagClick,
}: BrandCardProps) {
  return (
    <article className="card-animate group relative flex flex-col rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">
      {/* ── Header: Name + Price + Favorite ──────────────────── */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="heading text-xl text-stone-900 dark:text-stone-100 truncate">
            {brand.name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_COLORS[brand.priceTier] || ''}`}
            >
              {brand.priceTier}
            </span>
            <span className="text-xs text-stone-400 dark:text-neutral-500">
              {priceTierLabel(brand.priceTier)}
            </span>
          </div>
        </div>
        <FavoriteButton
          active={isFavorite}
          onClick={() => onToggleFavorite(brand)}
        />
      </div>

      {/* ── Aesthetic tags ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {brand.aestheticTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagClick?.(tag)}
            className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-xs font-medium text-stone-600 transition-colors hover:border-accent hover:text-accent
              dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-300 dark:hover:border-accent dark:hover:text-accent"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ── Description ──────────────────────────────────────── */}
      <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400 mb-3">
        {brand.description}
      </p>

      {/* ── Similarity reason ────────────────────────────────── */}
      <p className="text-sm text-stone-500 dark:text-neutral-400 mb-4 italic">
        &ldquo;{brand.similarityReason}&rdquo;
      </p>

      {/* ── Spacer to push bottom content down ───────────────── */}
      <div className="flex-1" />

      {/* ── Similarity score bar ──────────────────────────────── */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-stone-500 dark:text-neutral-400">
            Match to {searchedFrom}
          </span>
          <span className="text-xs font-semibold text-accent">
            {brand.similarityScore}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-stone-100 dark:bg-neutral-800">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${brand.similarityScore}%` }}
          />
        </div>
      </div>

      {/* ── Website link ─────────────────────────────────────── */}
      <a
        href={brand.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-accent dark:text-neutral-400 dark:hover:text-accent"
      >
        Visit website
        <ExternalLink size={14} />
      </a>
    </article>
  );
}
