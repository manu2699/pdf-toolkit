import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/vanilla/shallow";

import { SplitType } from "./helpers";

type ErrorObjectType = {
  [key: string]: boolean;
};

type SplitPDFStoreState = {
  splitMode: SplitType | "";
  inputs: string[];
  partInput: number;
  errorInputs: ErrorObjectType;
};

type SplitPDFStoreActions = {
  toggleSplitMode: (a: SplitType) => void;
  setInputs: (a: string[]) => void;
  setPartInput: (a: number) => void;
  setErrorInputs: (a: ErrorObjectType) => void;
  resetInputs: () => void;
};

type SplitPDFStore = SplitPDFStoreState & SplitPDFStoreActions;

export const useSplitPDFStore = createWithEqualityFn<SplitPDFStore>()(
  (set) => ({
    splitMode: "",
    toggleSplitMode: (val) => set(() => ({ splitMode: val })),
    inputs: [],
    setInputs: (val) => set(() => ({ inputs: val })),
    partInput: 0,
    setPartInput: (val) => set(() => ({ partInput: val })),
    errorInputs: {},
    setErrorInputs: (val) => set(() => ({ errorInputs: val })),
    resetInputs: () =>
      set(() => ({
        splitMode: "",
        inputs: [],
        partInput: 0,
        errorInputs: {},
      })),
  }),
  shallow
);
