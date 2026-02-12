import { Link, useLocation } from 'react-router-dom';
import { Heart, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useFavorites } from '../hooks/useFavorites';

export function Layout({ children }: { children: React.ReactNode }) {
  const { isDark, toggleTheme } = useTheme();
  const { count } = useFavorites();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="border-b border-stone-200 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-baseline gap-2">
            <span className="heading text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
              In The Same Vein
            </span>
          </Link>

          {/* Nav actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Collection link */}
            <Link
              to="/collection"
              className={`focus-ring relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors
                ${
                  location.pathname === '/collection'
                    ? 'bg-stone-200 text-stone-900 dark:bg-neutral-800 dark:text-stone-100'
                    : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                }`}
            >
              <Heart size={16} />
              <span className="hidden sm:inline">Collection</span>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="focus-ring rounded-full p-2 text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-stone-200 dark:border-neutral-800 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-sm text-stone-400 dark:text-neutral-500">
            Powered by Claude &middot; Brand data is AI-generated and may not be
            perfectly accurate.
          </p>
        </div>
      </footer>
    </div>
  );
}
