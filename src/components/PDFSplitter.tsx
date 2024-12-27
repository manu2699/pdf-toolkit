import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { motion } from "motion/react";

import { FileUpload } from "./FileUpload";
import { FileItem, UploadedFileList } from "./FileList";
import { PageRangeInput } from "./PageRangeInput";
import Modal from "./Modal";

interface PDFSplitterProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  showToast: (message: string, type: "success" | "error") => void;
}

export const PDFSplitter: React.FC<PDFSplitterProps> = ({
  files,
  onFilesChange,
  showToast,
}) => {
  const [ranges, setRanges] = useState<string[]>([""]);
  const [finsihedFiles, setFinsihedFiles] = useState<string[]>([]);
  const [currentlyViewing, setCurrentlyViewing] = useState<string | null>(null);

  const handleFileSelect = (newFiles: File[]) => {
    onFilesChange([newFiles[0]]);
  };

  const removeFile = () => {
    onFilesChange([]);
    setRanges([""]);
  };

  const splitPDF = async () => {
    if (!files[0]) return;
    setFinsihedFiles([]);

    try {
      const fileBuffer = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(fileBuffer);
      const totalPages = pdf.getPageCount();

      const parsedRanges = ranges
        .filter((range) => range.trim())
        .map((range) => {
          if (range.includes("-")) {
            const [start, end] = range
              .split("-")
              .map((num) => parseInt(num.trim()));
            return end
              ? { type: "range", start: start - 1, end: end - 1 }
              : { type: "range", start: start - 1, end: start - 1 };
          }
          return {
            type: "pages",
            pages: range.split(",").map((num) => parseInt(num.trim()) - 1),
          };
        })
        .filter((item) =>
          item.type === "range"
            ? item.start >= 0 && item.end < totalPages
            : item.pages.every((page) => page >= 0 && page < totalPages)
        );

      if (parsedRanges.length === 0) {
        showToast("Please enter valid pages", "error");
        return;
      }

      let finsihedFiles = [];
      for (let i = 0; i < parsedRanges.length; i++) {
        const newPdf = await PDFDocument.create();

        if (parsedRanges[i].type === "range") {
          const { start, end } = parsedRanges[i];
          for (let pageNum = start; pageNum <= end; pageNum++) {
            const [page] = await newPdf.copyPages(pdf, [pageNum]);
            newPdf.addPage(page);
          }
        } else {
          const { pages } = parsedRanges[i];
          for (let pageNum = 0; pageNum < pages.length; pageNum++) {
            const [page] = await newPdf.copyPages(pdf, [pages[pageNum]]);
            newPdf.addPage(page);
          }
        }

        newPdf.setTitle(`Split ${i + 1}`);
        const pdfDataUri = await newPdf.saveAsBase64({ dataUri: true });
        finsihedFiles.push(pdfDataUri);
      }
      setFinsihedFiles(finsihedFiles);
      onFilesChange([]);
      showToast("PDF split successfully!", "success");
    } catch (error) {
      console.error("Error splitting PDF:", error);
      showToast(
        "Error splitting PDF. Please check your page ranges and try again.",
        "error"
      );
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
        {files.length === 0 && finsihedFiles.length === 0 && (
          <FileUpload onFileSelect={handleFileSelect} multiple={false} />
        )}

        {files[0] && finsihedFiles.length === 0 && (
          <>
            <UploadedFileList files={files} onRemove={() => removeFile()} />

            <PageRangeInput ranges={ranges} setRanges={setRanges} />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={splitPDF}
              disabled={!ranges.some((r) => r.trim())}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Split PDF
            </motion.button>
          </>
        )}

        {finsihedFiles.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Splited PDFs
            </h2>
            {finsihedFiles.map((file, index) => (
              <FileItem
                name={`Split ${index + 1}`}
                onDownload={() => {
                  const link = document.createElement("a");
                  link.href = file;
                  link.download = `Split_${index + 1}.pdf`;
                  link.click();
                }}
                onView={() => setCurrentlyViewing(file)}
              />
            ))}
          </div>
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
