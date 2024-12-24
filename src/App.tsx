import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { PDFMerger } from './components/PDFMerger';
import { PDFSplitter } from './components/PDFSplitter';
import { ThemeToggle } from './components/ThemeToggle';
import { OperationToggle } from './components/OperationToggle';
import { Toast } from './components/Toast';
import { useToast } from './hooks/useToast';
import { AnimatePresence } from 'framer-motion';

export function App() {
  const [operation, setOperation] = useState<'merge' | 'split'>('merge');
  const [files, setFiles] = useState<File[]>([]);
  const { toasts, showToast, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ThemeToggle />
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2 text-gray-800 dark:text-gray-100">
            <FileText className="w-8 h-8" />
            PDF Toolkit
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Powerful tools to manage your PDF files
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex justify-center">
            <OperationToggle operation={operation} setOperation={setOperation} />
          </div>

          <AnimatePresence mode="wait">
            {operation === 'merge' ? (
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
        {toasts.map(toast => (
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