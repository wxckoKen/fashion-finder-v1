import { useState } from 'react';
import { Search } from 'lucide-react';

interface FindMoreBarProps {
  onFindMore: (opts: {
    pricePreference: 'more_affordable' | 'same_price' | 'any';
    refinementNote: string;
  }) => void;
  isLoading: boolean;
}

export function FindMoreBar({ onFindMore, isLoading }: FindMoreBarProps) {
  const [pricePreference, setPricePreference] = useState<'more_affordable' | 'same_price' | 'any'>('any');
  const [refinementNote, setRefinementNote] = useState('');

  function handleClick() {
    onFindMore({ pricePreference, refinementNote });
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-4">
        Refine &amp; Find More
      </h3>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Price preference */}
        <div className="flex-shrink-0">
          <label className="block text-xs text-stone-400 dark:text-neutral-500 mb-1">
            Show me brands that are...
          </label>
          <select
            value={pricePreference}
            onChange={(e) => setPricePreference(e.target.value as typeof pricePreference)}
            disabled={isLoading}
            className="focus-ring w-full sm:w-auto rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700
              dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-300
              disabled:opacity-60"
          >
            <option value="any">Any Price</option>
            <option value="more_affordable">More Affordable</option>
            <option value="same_price">Same Price Range</option>
          </select>
        </div>

        {/* Refinement text input */}
        <div className="flex-1 min-w-0">
          <label className="block text-xs text-stone-400 dark:text-neutral-500 mb-1">
            I'm specifically looking for...
          </label>
          <input
            type="text"
            value={refinementNote}
            onChange={(e) => setRefinementNote(e.target.value)}
            placeholder='e.g. "more minimal" or "sustainable materials" or "available in the US"'
            disabled={isLoading}
            className="focus-ring w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 placeholder:text-stone-400
              dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-300 dark:placeholder:text-neutral-500
              disabled:opacity-60"
          />
        </div>

        {/* Find more button */}
        <div className="flex-shrink-0 self-end">
          <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            className="focus-ring inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2 text-sm font-medium text-white transition-all hover:bg-accent-hover
              disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Finding...
              </>
            ) : (
              <>
                <Search size={14} />
                Find More Brands
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
