import React from 'react';
import { SplitIcon, LucideMerge } from 'lucide-react';
import { clsx } from 'clsx';

type Operation = 'merge' | 'split';

interface OperationToggleProps {
  operation: Operation;
  setOperation: (op: Operation) => void;
}

export const OperationToggle: React.FC<OperationToggleProps> = ({ operation, setOperation }) => {
  return (
    <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg">
      <button
        onClick={() => setOperation('merge')}
        className={clsx(
          'text-sm flex items-center gap-2 px-4 py-2 rounded rounded-l-lg transition-colors',
          operation === 'merge'
            ? 'bg-blue-500 text-white'
            : 'text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
        )}
      >
        <LucideMerge className="w-4 h-4" />
        Merge PDFs
      </button>
      <button
        onClick={() => setOperation('split')}
        className={clsx(
          'text-sm flex items-center gap-2 px-4 py-2 rounded rounded-r-lg transition-colors',
          operation === 'split'
            ? 'bg-blue-500 text-white'
            : 'text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
        )}
      >
        <SplitIcon className="w-4 h-4" />
        Split PDF
      </button>
    </div>
  );
};