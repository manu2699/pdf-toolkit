import { useState } from "react";
import { BookText } from "lucide-react";
import { PDFMerger } from "./components/PDFMerger";
import { PDFSplitter } from "./components/PDFSplitter";
import { ThemeToggle } from "./components/ThemeToggle";
import { OperationToggle } from "./components/OperationToggle";
import { Toast } from "./components/Toast";
import { useToast } from "./hooks/useToast";
import { AnimatePresence } from "motion/react";

export function App() {
  const [operation, setOperation] = useState<"merge" | "split">("merge");
  const [files, setFiles] = useState<File[]>([]);
  const { toasts, showToast, removeToast } = useToast();

  function handleOperationChange(operation: "merge" | "split") {
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
            <OperationToggle
              operation={operation}
              setOperation={handleOperationChange}
            />
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
