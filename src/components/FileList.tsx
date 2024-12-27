import React from "react";
import { Trash2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { DownloadIcon } from "./icons/Download";
import { ExpandIcon } from "./icons/Expand";

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
}

export const UploadedFileList: React.FC<FileListProps> = ({
  files,
  onRemove,
}) => {
  return (
    <div className="space-y-2">
      <AnimatePresence>
        {files.map((file, index) => (
          <motion.div
            key={`${file.name}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {file.name}
              </span>
            </div>
            <button
              onClick={() => onRemove(index)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface FileItemProps {
  name: string;
  onDownload: () => void;
  onView: () => void;
}

export const FileItem: React.FC<FileItemProps> = ({
  name,
  onDownload,
  onView,
}) => {
  return (
    <div className="flex text-black dark:text-white items-center gap-10 w-max">
      <span>{name}</span>
      <div className="flex">
        <ExpandIcon w={16} h={16} onClick={() => onView()} />
        <DownloadIcon w={16} h={16} onClick={onDownload} />
      </div>
    </div>
  );
};
