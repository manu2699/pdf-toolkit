import React, { useRef, useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { motion } from "motion/react";
import { For, Show } from "control-flow-react";
import JSZip from "jszip";

import { FileUpload } from "../../components/FileUpload";
import { FileItem, UploadedFileList } from "../../components/FileList";
import { SplitInput } from "./SplitInput";
import { Modal } from "../../components/common/Modal";
import { useSplitPDFStore } from "./store";
import {
  calculatePagesForPart,
  createPDFSplit,
  getPagesFromRange,
  parsePagesInput,
  parseRangeInput,
  SplitTypes,
} from "./helpers";

interface PDFSplitterProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  showToast: (message: string, type: "success" | "error") => void;
}

type PDFRef = { doc?: PDFDocument; pages?: number };

export const PDFSplitter: React.FC<PDFSplitterProps> = ({
  files,
  onFilesChange,
  showToast,
}) => {
  const errors = useSplitPDFStore((state) => state.errorInputs);
  const [finsihedFiles, setFinsihedFiles] = useState<string[]>([]);
  const [currentlyViewing, setCurrentlyViewing] = useState<string | null>(null);
  const pdfRef = useRef<PDFRef>({});

  const hasErrors = Object.values(errors).some((error) => error);

  useEffect(() => {
    return () => {
      useSplitPDFStore.getState().resetInputs();
    };
  }, []);

  const handleFileSelect = async (newFiles: File[]) => {
    onFilesChange([newFiles[0]]);

    const fileBuffer = await newFiles[0].arrayBuffer();
    const doc = await PDFDocument.load(fileBuffer);
    pdfRef.current = {
      doc,
      pages: doc.getPageCount(),
    };
    useSplitPDFStore.getState().resetInputs();
    useSplitPDFStore.getState().toggleSplitMode(SplitTypes.Range);
    showToast("File uploaded successfully!", "success");
  };

  const removeFile = () => {
    onFilesChange([]);
    useSplitPDFStore.getState().resetInputs();
  };

  const createZipFile = async (files: string[]) => {
    const zip = new JSZip();

    files.forEach((file, index) => {
      // Convert base64 data URI to binary
      const data = atob(file.split(",")[1]);
      const array = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        array[i] = data.charCodeAt(i);
      }
      zip.file(`Split_${index + 1}.pdf`, array);
    });

    const content = await zip.generateAsync({ type: "base64" });
    downloadFile({
      name: "split_pdfs.zip",
      href: `data:application/zip;base64,${content}`,
    });
  };

  const downloadFile = ({ name, href }: { name: string; href: string }) => {
    const link = document.createElement("a");
    link.href = href;
    link.download = name;
    link.click();
  };

  const splitPDF = async () => {
    if (!files[0] || !pdfRef.current.doc) {
      showToast("Some error has occurred, please reupload the file", "error");
      return;
    }

    const { inputs, splitMode, partInput } = useSplitPDFStore.getState();
    if (
      hasErrors ||
      (splitMode !== SplitTypes.Parts && inputs.length <= 0) ||
      (splitMode === SplitTypes.Parts && !partInput)
    ) {
      showToast("Please enter valid inputs to split", "error");
      return;
    }

    setFinsihedFiles([]);
    try {
      let outputFiles = [];
      let ranges: { start: number; end: number }[] = [];

      if (splitMode === SplitTypes.Pages) {
        const pages = inputs.map(parsePagesInput);
        outputFiles = [];
        for (let i = 0; i < pages.length; i++) {
          const pdfDataUri = await createPDFSplit({
            sourcePdf: pdfRef.current.doc,
            pages: pages[i].map((page) => page - 1), // convert to 0-based index
            title: `Split ${i + 1}`,
          });
          outputFiles.push(pdfDataUri);
        }
      } else if (splitMode === SplitTypes.Range) {
        outputFiles = [];
        ranges = inputs.map(parseRangeInput);
      } else if (splitMode === SplitTypes.Parts) {
        outputFiles = [];
        ranges = calculatePagesForPart(partInput, pdfRef.current.pages || 100);
      }

      for (let i = 0; i < ranges.length; i++) {
        const pdfDataUri = await createPDFSplit({
          sourcePdf: pdfRef.current.doc,
          pages: getPagesFromRange(ranges[i].start, ranges[i].end),
          title: `Split ${i + 1}`,
        });
        outputFiles.push(pdfDataUri);
      }
      setFinsihedFiles(outputFiles);
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
        <Show when={files.length === 0 && finsihedFiles.length === 0}>
          <FileUpload onFileSelect={handleFileSelect} multiple={false} />
        </Show>

        <Show when={files[0] && finsihedFiles.length === 0}>
          <UploadedFileList files={files} onRemove={() => removeFile()} />
          <SplitInput totalPages={pdfRef.current.pages || Infinity} />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={splitPDF}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Split PDF
          </motion.button>
        </Show>

        <Show when={finsihedFiles.length > 0}>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Splited PDFs
            </h2>

            <Show when={finsihedFiles.length > 1}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => createZipFile(finsihedFiles)}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Download All as ZIP
              </motion.button>
            </Show>

            <For each={finsihedFiles}>
              {(file, index) => (
                <FileItem
                  key={index}
                  name={`Split ${index + 1}`}
                  onDownload={() =>
                    downloadFile({ name: `Split_${index + 1}.pdf`, href: file })
                  }
                  onView={() => setCurrentlyViewing(file)}
                />
              )}
            </For>
          </div>
        </Show>
      </motion.div>

      <Show when={currentlyViewing}>
        <Modal
          isOpen={!!currentlyViewing}
          onClose={() => setCurrentlyViewing(null)}
          title="View PDF"
          contentClass="p-0"
        >
          <iframe src={currentlyViewing || ""} className="w-[90vw] h-[85vh]" />
        </Modal>
      </Show>
    </>
  );
};
