import { useState, type FormEvent } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  }

  function handleClear() {
    setQuery('');
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        {/* Search icon */}
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-neutral-500 transition-colors group-focus-within:text-accent"
        />

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a fashion brand..."
          disabled={isLoading}
          className="focus-ring w-full rounded-2xl border border-stone-200 bg-white py-4 pl-12 pr-24 text-lg text-stone-900 placeholder:text-stone-400 transition-all
            focus:border-accent focus:ring-1 focus:ring-accent
            dark:border-neutral-700 dark:bg-neutral-900 dark:text-stone-100 dark:placeholder:text-neutral-500 dark:focus:border-accent
            disabled:opacity-60"
          autoFocus
        />

        {/* Clear button (shown when there's text) */}
        {query && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-20 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 hover:text-stone-600 dark:text-neutral-500 dark:hover:text-neutral-300"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition-all hover:bg-accent-hover
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span className="hidden sm:inline">Searching</span>
            </span>
          ) : (
            'Search'
          )}
        </button>
      </div>

      {/* Suggestions */}
      <p className="mt-3 text-center text-sm text-stone-400 dark:text-neutral-500">
        Try{' '}
        <button
          type="button"
          onClick={() => { setQuery('Aimé Leon Dore'); onSearch('Aimé Leon Dore'); }}
          className="underline underline-offset-2 hover:text-accent transition-colors"
        >
          Aimé Leon Dore
        </button>
        ,{' '}
        <button
          type="button"
          onClick={() => { setQuery('Bottega Veneta'); onSearch('Bottega Veneta'); }}
          className="underline underline-offset-2 hover:text-accent transition-colors"
        >
          Bottega Veneta
        </button>
        , or{' '}
        <button
          type="button"
          onClick={() => { setQuery('Stüssy'); onSearch('Stüssy'); }}
          className="underline underline-offset-2 hover:text-accent transition-colors"
        >
          Stüssy
        </button>
      </p>
    </form>
  );
}
