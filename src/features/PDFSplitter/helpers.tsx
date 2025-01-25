import { PDFDocument } from "pdf-lib";

export const SplitTypes = {
  Range: "Range" as const,
  Pages: "Pages" as const,
  Parts: "Parts" as const,
};

export type SplitType = keyof typeof SplitTypes;

const isValidNumber = (num: number) =>
  num && !isNaN(num) && typeof num === "number";

export const parseRangeInput = (range: string) => {
  if (range.includes("-")) {
    const [start, end] = range.split("-").map((num) => parseInt(num.trim()));
    if (start && end) return { start, end, isError: false };
  }
  return { isError: true, start: -Infinity, end: -Infinity };
};

export const isValidRange = (range: string, totalPages: number = Infinity) => {
  const { isError, start, end } = parseRangeInput(range);
  if (isError) return false;

  if (isValidNumber(start) && isValidNumber(end)) {
    return start > 0 && start < end && end <= totalPages;
  }
  return false;
};

export const parsePagesInput = (pages: string): number[] => {
  return pages.split(",").reduce((acc, str) => {
    const num = Number(str.trim());
    return !isNaN(num) ? [...acc, parseInt(str)] : acc;
  }, [] as number[]);
};

export const isValidPage = (page: string, totalPages: number = Infinity) => {
  return parsePagesInput(page).every(
    (val) => isValidNumber(val) && val > 0 && val <= totalPages
  );
};

export const isValidParts = (parts: number, totalPages: number = Infinity) => {
  return Boolean(isValidNumber(parts) && parts > 1 && parts <= totalPages);
};

export const calculatePagesForPart = (
  numberOfParts: number,
  totalPages: number
) => {
  const basePagesPerPart = Math.floor(totalPages / numberOfParts);
  const remainingPages = totalPages % numberOfParts;

  const parts = [];
  let currentPage = 1;

  for (let i = 0; i < numberOfParts; i++) {
    const pageCount =
      i === numberOfParts - 1
        ? basePagesPerPart + remainingPages
        : basePagesPerPart;

    parts.push({
      start: currentPage,
      end: currentPage + pageCount - 1,
    });

    currentPage += pageCount;
  }

  return parts;
};

export const createPDFSplit = async ({
  sourcePdf,
  pages,
  title,
}: {
  sourcePdf: PDFDocument;
  pages: number[];
  title: string;
}) => {
  const newPdf = await PDFDocument.create();
  const outputpages = await newPdf.copyPages(sourcePdf, pages);
  outputpages.forEach((page) => newPdf.addPage(page));
  newPdf.setTitle(title);
  return newPdf.saveAsBase64({ dataUri: true });
};

export const getPagesFromRange = (start: number, end: number): number[] => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i - 1); // convert to 0-based index
};
