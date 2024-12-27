import React from "react";
import { Plus, X } from "lucide-react";

interface PageRangeInputProps {
  ranges: string[];
  setRanges: (ranges: string[]) => void;
}

export const PageRangeInput: React.FC<PageRangeInputProps> = ({
  ranges,
  setRanges,
}) => {
  const addRange = () => {
    setRanges([...ranges, ""]);
  };

  const removeRange = (index: number) => {
    setRanges(ranges.filter((_, i) => i !== index));
  };

  const updateRange = (index: number, value: string) => {
    const newRanges = [...ranges];
    newRanges[index] = value;
    setRanges(newRanges);
  };

  return (
    <div className="space-y-3">
      <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
        Page Ranges
      </label>
      {ranges.map((range, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={range}
            onChange={(e) => updateRange(index, e.target.value)}
            placeholder="e.g., 1-3 or 5 or 7, 8"
            className="flex-1 p-2 border text-black dark:text-white dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => removeRange(index)}
            className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
      <button
        onClick={addRange}
        className="flex text-md items-center gap-2 text-blue-500 hover:text-blue-600"
      >
        <Plus className="w-4 h-4" />
        Add Range / Page
      </button>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enter page ranges (e.g., 1-3) or single pages (e.g., 5) or page numbers
        separated by commas (e.g., 1, 3, 5).
      </p>
    </div>
  );
};
