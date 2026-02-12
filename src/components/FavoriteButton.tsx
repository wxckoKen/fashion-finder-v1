import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  active: boolean;
  onClick: () => void;
}

export function FavoriteButton({ active, onClick }: FavoriteButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`focus-ring shrink-0 rounded-full p-1.5 transition-all ${
        active
          ? 'text-red-500 hover:text-red-600 scale-110'
          : 'text-stone-300 hover:text-red-400 dark:text-neutral-600 dark:hover:text-red-400'
      }`}
      aria-label={active ? 'Remove from collection' : 'Save to collection'}
    >
      <Heart
        size={20}
        fill={active ? 'currentColor' : 'none'}
        className="transition-transform active:scale-90"
      />
    </button>
  );
}
