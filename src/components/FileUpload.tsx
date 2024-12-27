import React from "react";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { clsx } from "clsx";
import { UploadIcon } from "./icons/Upload";

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  multiple?: boolean;
  className?: string;
  compact?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  multiple = false,
  className,
  compact = false,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );

    if (files.length > 0) {
      onFileSelect(multiple ? files : [files[0]]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      onFileSelect(multiple ? files : [files[0]]);
    }
  };

  if (compact) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <label
          htmlFor="file-upload-compact"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add More PDFs
        </label>
        <input
          id="file-upload-compact"
          type="file"
          accept=".pdf"
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={clsx(
        "border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg",
        "cursor-pointer hover:border-blue-500 transition-colors",
        className
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf"
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="block p-8 cursor-pointer">
        <div className="flex flex-col items-center justify-center">
          <UploadIcon
            w={24}
            h={24}
            className="text-gray-700 dark:text-zinc-400"
          />
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Drag & drop PDF {multiple ? "files" : "file"} here
            <br />
            or click to browse
          </p>
        </div>
      </label>
    </motion.div>
  );
};
