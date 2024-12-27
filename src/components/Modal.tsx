import clsx from "clsx";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentClass?: string;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  contentClass,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-0 left-0 flex items-center justify-center z-50">
      <div
        className="absolute top-0 left-0 bg-black opacity-50 w-full h-full z-[-1]"
        onClick={onClose}
      ></div>
      <div className="z-52 bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden w-max h-max">
        <div className="flex items-center justify-between px-4 py-2 border-b dark:text-white dark:border-zinc-500">
          <h2 className="text-md font-semibold">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-zinc-300"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className={clsx("p-4", contentClass)}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
