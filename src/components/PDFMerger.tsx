import React from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUpload } from './FileUpload';
import { FileList } from './FileList';
import { motion } from 'framer-motion';

interface PDFMergerProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const PDFMerger: React.FC<PDFMergerProps> = ({
  files,
  onFilesChange,
  showToast
}) => {
  const handleFileSelect = (newFiles: File[]) => {
    onFilesChange([...files, ...newFiles]);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      showToast('Please upload at least 2 PDF files to merge', 'error');
      return;
    }

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }
      
      const mergedPdfFile = await mergedPdf.save();
      const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast('PDFs merged successfully!', 'success');
    } catch (error) {
      console.error('Error merging PDFs:', error);
      showToast('Error merging PDFs. Please try again.', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-850 p-6 rounded-lg shadow-lg space-y-6"
    >
      <FileUpload
        onFileSelect={handleFileSelect}
        multiple={true}
        className="mb-6"
      />

      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          
          <FileUpload
            onFileSelect={handleFileSelect}
            multiple={true}
            compact={true}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={mergePDFs}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Merge PDFs
          </motion.button>
        </>
      )}
    </motion.div>
  );
};