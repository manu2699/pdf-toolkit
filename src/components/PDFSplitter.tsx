import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUpload } from './FileUpload';
import { FileList } from './FileList';
import { PageRangeInput } from './PageRangeInput';
import { motion } from 'framer-motion';

interface PDFSplitterProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const PDFSplitter: React.FC<PDFSplitterProps> = ({
  files,
  onFilesChange,
  showToast
}) => {
  const [ranges, setRanges] = useState<string[]>(['']);
  
  const handleFileSelect = (newFiles: File[]) => {
    onFilesChange([newFiles[0]]);
  };

  const removeFile = () => {
    onFilesChange([]);
    setRanges(['']);
  };

  const splitPDF = async () => {
    if (!files[0]) return;

    try {
      const fileBuffer = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(fileBuffer);
      const totalPages = pdf.getPageCount();

      const parsedRanges = ranges
        .filter(range => range.trim())
        .map(range => {
          const [start, end] = range.split('-').map(num => parseInt(num.trim()));
          return end ? { start: start - 1, end: end - 1 } : { start: start - 1, end: start - 1 };
        })
        .filter(range => 
          range.start >= 0 && 
          range.end < totalPages && 
          range.start <= range.end
        );

      if (parsedRanges.length === 0) {
        showToast('Please enter valid page ranges', 'error');
        return;
      }

      for (let i = 0; i < parsedRanges.length; i++) {
        const newPdf = await PDFDocument.create();
        const { start, end } = parsedRanges[i];
        
        for (let pageNum = start; pageNum <= end; pageNum++) {
          const [page] = await newPdf.copyPages(pdf, [pageNum]);
          newPdf.addPage(page);
        }

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `split_${i + 1}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      showToast('PDF split successfully!', 'success');
    } catch (error) {
      console.error('Error splitting PDF:', error);
      showToast('Error splitting PDF. Please check your page ranges and try again.', 'error');
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
        multiple={false}
        className="mb-6"
      />

      {files[0] && (
        <>
          <FileList files={files} onRemove={() => removeFile()} />
          
          <PageRangeInput ranges={ranges} setRanges={setRanges} />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={splitPDF}
            disabled={!ranges.some(r => r.trim())}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Split PDF
          </motion.button>
        </>
      )}
    </motion.div>
  );
};