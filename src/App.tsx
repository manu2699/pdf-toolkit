import { useState } from "react";
import { BookText } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { SplitIcon, LucideMerge } from "lucide-react";

import { PDFMerger } from "./features/PDFMerger";
import { PDFSplitter } from "./features/PDFSplitter";
import { ThemeToggle } from "./components/ThemeToggle";
import { Tabs, Tab } from "./components/common/Tabs";
import { Toast } from "./components/common/Toast";
import { useToast } from "./hooks/useToast";

type Operation = "merge" | "split";

export function App() {
  const [operation, setOperation] = useState<Operation>("merge");
  const [files, setFiles] = useState<File[]>([]);
  const { toasts, showToast, removeToast } = useToast();

  function handleOperationChange(operation: Operation) {
    if (operation === "split" && files.length > 1) {
      setFiles([files[0]]);
    }
    setOperation(operation);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-4 flex flex-wrap gap-8 justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2 text-gray-800 dark:text-gray-100">
            <BookText className="w-6 h-6" />
            PDF Toolkit
          </h1>
          <div className="flex gap-4 items-center">
            <Tabs
              value={operation}
              onChange={(value) => handleOperationChange(value as Operation)}
            >
              <Tab value="merge">
                <LucideMerge className="w-4 h-4" />
                Merge PDFs
              </Tab>
              <Tab value="split">
                <SplitIcon className="w-4 h-4" />
                Split PDF
              </Tab>
            </Tabs>
            <ThemeToggle />
          </div>
        </header>

        <div className="max-w-2xl mt-12 mx-auto">
          <AnimatePresence mode="wait">
            {operation === "merge" ? (
              <PDFMerger
                key="merger"
                files={files}
                onFilesChange={setFiles}
                showToast={showToast}
              />
            ) : (
              <PDFSplitter
                key="splitter"
                files={files}
                onFilesChange={setFiles}
                showToast={showToast}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
