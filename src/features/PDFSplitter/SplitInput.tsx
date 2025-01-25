import React from "react";
import { Columns4, Layers, Layers2Icon, Plus, X } from "lucide-react";
import { clsx } from "clsx";
import { Case, For, Switch } from "control-flow-react";

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./common/Select";

import { Tabs, Tab } from "../../components/common/Tabs";
import {
  isValidRange,
  SplitTypes,
  SplitType,
  isValidPage,
  isValidParts,
} from "./helpers";
import { useSplitPDFStore } from "./store";

interface SplitInputProps {
  totalPages: number;
}

export const SplitInput: React.FC<SplitInputProps> = ({ totalPages }) => {
  const {
    inputs,
    setInputs,
    splitMode,
    setsplitMode,
    partInput,
    setPartInput,
    errorInputs,
    setErrorInputs,
  } = useSplitPDFStore((state) => ({
    inputs: state.inputs,
    setInputs: state.setInputs,
    splitMode: state.splitMode,
    setsplitMode: state.toggleSplitMode,
    partInput: state.partInput,
    setPartInput: state.setPartInput,
    errorInputs: state.errorInputs,
    setErrorInputs: state.setErrorInputs,
  }));

  const addInput = () => {
    setInputs([...inputs, ""]);
  };

  const removeInputs = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const updateInputs = (index: number, value: string) => {
    let isValid = true;
    if (splitMode === SplitTypes.Range) {
      isValid = isValidRange(value, totalPages);
    } else if (splitMode === SplitTypes.Pages) {
      isValid = isValidPage(value, totalPages);
    }

    const newPages = [...inputs];
    newPages[index] = value;
    setInputs(newPages);
    setErrorInputs({ ...errorInputs, [index]: !isValid });
  };

  const handleModesChange = (val: string) => {
    setInputs([]);
    setErrorInputs({});
    setsplitMode(val as SplitType);
  };

  const handlePartInputChange = (val: string | number) => {
    if (!val) return;
    if (typeof val === "string") val = parseInt(val.trim());
    setPartInput(val);
    setErrorInputs({ ...errorInputs, [0]: !isValidParts(val, totalPages) });
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
        Split By
      </label>

      <Tabs value={splitMode} layout="vertical" onChange={handleModesChange}>
        <Tab value={SplitTypes.Range}>
          <Layers2Icon className="w-7 h-7" />
          Range
        </Tab>
        <Tab value={SplitTypes.Pages}>
          <Layers className="w-7 h-7" />
          Pages
        </Tab>
        <Tab value={SplitTypes.Parts}>
          <Columns4 className="w-7 h-7" />
          Parts
        </Tab>
      </Tabs>

      <Switch when={splitMode}>
        {/* Range inputs */}
        <Case value={SplitTypes.Range}>
          <For each={inputs}>
            {(range, index) => (
              <div key={index} className="flex gap-2">
                <TextInput
                  value={range}
                  onChange={(val) => updateInputs(index, val)}
                  placeholder="e.g., 1-3 or 5-10"
                  hasError={errorInputs[index]}
                />
                <button
                  onClick={() => removeInputs(index)}
                  className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </For>
          <button
            onClick={addInput}
            className="flex text-md items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            <Plus className="w-4 h-4" />
            Add {splitMode}
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter page ranges (e.g., 1-3, 5-10)
          </p>
        </Case>
        {/* Page inputs */}
        <Case value={SplitTypes.Pages}>
          <For each={inputs}>
            {(page, index) => (
              <div key={index} className="flex gap-2">
                <TextInput
                  value={page}
                  onChange={(val) => updateInputs(index, val)}
                  placeholder="e.g., 7, 8 or 1, 4, 10 or 1"
                  hasError={errorInputs[index]}
                />
                <button
                  onClick={() => removeInputs(index)}
                  className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </For>
          <button
            onClick={addInput}
            className="flex text-md items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            <Plus className="w-4 h-4" />
            Add {splitMode}
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter single page (e.g., 5) or page numbers separated by commas
            (e.g., 1, 3, 5).
          </p>
        </Case>
        {/* Part inputs */}
        <Case value={SplitTypes.Parts}>
          <div className="flex w-max items-center gap-2 mt-1">
            <p className="text text-gray-500 dark:text-gray-400">Split into</p>
            <TextInput
              value={partInput}
              onChange={handlePartInputChange}
              placeholder="eg., 4"
              readOnly={partInput === totalPages}
              className="!w-[150px]"
              hasError={errorInputs[0]}
            />
            <p className="text text-gray-500 dark:text-gray-400">part(s)</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={partInput === totalPages}
              onChange={(e) => {
                if (e.target.checked) handlePartInputChange(totalPages);
                else handlePartInputChange(2);
              }}
              className="w-4 accent-blue-500"
            />
            <p className="text text-gray-500 dark:text-gray-400">
              Split Every pages in the PDF
            </p>
          </div>
        </Case>
      </Switch>
    </div>
  );
};

interface TextInputProps {
  value: string | number;
  onChange: (a: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  hasError?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = "",
  className = "",
  readOnly = false,
  hasError = false,
}) => (
  <input
    type="text"
    value={value}
    readOnly={readOnly}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={clsx(
      "flex-1 p-2 border text-black rounded-lg bg-white",
      "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
      "dark:text-white dark:border-gray-600 dark:bg-transparent",
      { "opacity-50 cursor-not-allowed": readOnly },
      {
        "border-red-500 dark:border-red-200 dark:border-3": hasError,
      },
      className
    )}
  />
);
