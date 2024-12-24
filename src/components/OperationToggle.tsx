import React from 'react';
import { FilePlus, Scissors } from 'lucide-react';
import { clsx } from 'clsx';

type Operation = 'merge' | 'split';

interface OperationToggleProps {
  operation: Operation;
  setOperation: (op: Operation) => void;
}

export const OperationToggle: React.FC<OperationToggleProps> = ({ operation, setOperation }) => {
  return (
    <div className="flex gap-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        onClick={() => setOperation('merge')}
        className={clsx(
          'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
          operation === 'merge'
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        )}
      >
        <FilePlus className="w-5 h-5" />
        Merge PDFs
      </button>
      <button
        onClick={() => setOperation('split')}
        className={clsx(
          'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
          operation === 'split'
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        )}
      >
        <Scissors className="w-5 h-5" />
        Split PDF
      </button>
    </div>
  );
};