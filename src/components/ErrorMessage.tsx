import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="mx-auto max-w-md text-center py-12">
      <div className="mb-4 flex justify-center">
        <div className="rounded-full bg-red-50 p-3 dark:bg-red-900/20">
          <AlertCircle size={24} className="text-red-500 dark:text-red-400" />
        </div>
      </div>
      <p className="text-stone-600 dark:text-stone-300 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="focus-ring inline-flex items-center gap-2 rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-accent hover:text-accent dark:border-neutral-700 dark:text-stone-300 dark:hover:border-accent dark:hover:text-accent"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}
