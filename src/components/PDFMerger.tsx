import React, { useState } from "react";
import { motion } from "motion/react";
import { PDFDocument } from "pdf-lib";

import { FileUpload } from "./FileUpload";
import { FileItem, UploadedFileList } from "./FileList";
import Modal from "./Modal";

interface PDFMergerProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  showToast: (message: string, type: "success" | "error") => void;
}

export const PDFMerger: React.FC<PDFMergerProps> = ({
  files,
  onFilesChange,
  showToast,
}) => {
  const [finsihedFiles, setFinsihedFiles] = useState<string[]>([]);
  const [currentlyViewing, setCurrentlyViewing] = useState<string | null>(null);

  const handleFileSelect = (newFiles: File[]) => {
    onFilesChange([...files, ...newFiles]);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      showToast("Please upload at least 2 PDF files to merge", "error");
      return;
    }

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      mergedPdf.setTitle(`Merged PDF`);
      const pdfDataUri = await mergedPdf.saveAsBase64({ dataUri: true });
      setFinsihedFiles([pdfDataUri]);
      onFilesChange([]);
      showToast("PDFs merged successfully!", "success");
    } catch (error) {
      console.error("Error merging PDFs:", error);
      showToast("Error merging PDFs. Please try again.", "error");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg space-y-6"
      >
        {finsihedFiles.length === 0 && (
          <FileUpload onFileSelect={handleFileSelect} multiple={true} />
        )}

        {files.length > 0 && finsihedFiles.length === 0 && (
          <>
            <UploadedFileList files={files} onRemove={removeFile} />

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

        {finsihedFiles.length > 0 && (
          <FileItem
            name={`Merged PDF`}
            onDownload={() => {
              const link = document.createElement("a");
              link.href = finsihedFiles[0];
              link.download = `Merged.pdf`;
              link.click();
            }}
            onView={() => setCurrentlyViewing(finsihedFiles[0])}
          />
        )}
      </motion.div>
      {currentlyViewing && (
        <Modal
          isOpen={!!currentlyViewing}
          onClose={() => setCurrentlyViewing(null)}
          title="View PDF"
          contentClass="p-0"
        >
          <iframe src={currentlyViewing} className="w-[90vw] h-[85vh]" />
        </Modal>
      )}
    </>
  );
};
