/**
 * "My Collection" page: shows all saved/favorited brands,
 * grouped by their primary aesthetic tag.
 */

import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, ExternalLink, Trash2 } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { priceTierLabel } from '../utils/filters';

/** Color mapping for price tier badges (matches BrandCard) */
const TIER_COLORS: Record<string, string> = {
  '$': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  '$$': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  '$$$': 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
  '$$$$': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
};

export function CollectionPage() {
  const { favorites, removeFavorite, groupedByAesthetic, count } =
    useFavorites();
  const groups = groupedByAesthetic();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-accent transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to search
        </Link>
        <h1 className="heading text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
          My Collection
        </h1>
        <p className="mt-2 text-stone-500 dark:text-stone-400">
          {count === 0
            ? "You haven't saved any brands yet. Search for a brand and tap the heart icon to save."
            : `${count} saved brand${count !== 1 ? 's' : ''}, grouped by aesthetic.`}
        </p>
      </div>

      {/* ── Empty state ───────────────────────────────────────── */}
      {favorites.length === 0 && (
        <div className="text-center py-20">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-stone-100 p-4 dark:bg-neutral-800">
              <Heart
                size={32}
                className="text-stone-300 dark:text-neutral-600"
              />
            </div>
          </div>
          <p className="text-stone-400 dark:text-neutral-500 mb-4">
            Your collection is empty
          </p>
          <Link
            to="/"
            className="focus-ring inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Discover brands
          </Link>
        </div>
      )}

      {/* ── Grouped favorites ─────────────────────────────────── */}
      {Object.entries(groups).map(([aesthetic, brands]) => (
        <section key={aesthetic} className="mb-10">
          <h2 className="heading text-xl text-stone-900 dark:text-stone-100 mb-4 pb-2 border-b border-stone-200 dark:border-neutral-800">
            {aesthetic}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((brand) => (
              <article
                key={brand.name}
                className="card-animate group relative flex flex-col rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="heading text-lg text-stone-900 dark:text-stone-100">
                    {brand.name}
                  </h3>
                  <button
                    onClick={() => removeFavorite(brand.name)}
                    className="shrink-0 rounded-full p-1.5 text-stone-300 transition-colors hover:text-red-500 dark:text-neutral-600 dark:hover:text-red-400"
                    aria-label={`Remove ${brand.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_COLORS[brand.priceTier] || ''}`}
                  >
                    {brand.priceTier}
                  </span>
                  <span className="text-xs text-stone-400 dark:text-neutral-500">
                    {priceTierLabel(brand.priceTier)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {brand.aestheticTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-xs font-medium text-stone-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400 mb-3">
                  {brand.description}
                </p>

                <div className="flex-1" />

                <div className="flex items-center justify-between text-xs text-stone-400 dark:text-neutral-500">
                  <span>Found via {brand.searchedFrom}</span>
                  <a
                    href={brand.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium hover:text-accent transition-colors"
                  >
                    Visit
                    <ExternalLink size={12} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
