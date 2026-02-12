/**
 * Loading skeleton that mirrors the shape of a BrandCard.
 * Shown while the API request is in-flight.
 */
export function BrandCardSkeleton() {
  return (
    <div className="card-animate flex flex-col rounded-2xl border border-stone-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      {/* Name + tier */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="skeleton h-6 w-40 rounded-lg" />
          <div className="mt-2 flex gap-2">
            <div className="skeleton h-5 w-12 rounded-full" />
            <div className="skeleton h-5 w-16 rounded-full" />
          </div>
        </div>
        <div className="skeleton h-8 w-8 rounded-full" />
      </div>

      {/* Tags */}
      <div className="flex gap-1.5 mb-3">
        <div className="skeleton h-6 w-24 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>

      {/* Description lines */}
      <div className="space-y-2 mb-3">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>

      {/* Similarity reason */}
      <div className="skeleton h-4 w-5/6 rounded mb-4" />

      {/* Score bar */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-3 w-8 rounded" />
        </div>
        <div className="skeleton h-1.5 w-full rounded-full" />
      </div>

      {/* Link */}
      <div className="skeleton h-4 w-28 rounded" />
    </div>
  );
}
