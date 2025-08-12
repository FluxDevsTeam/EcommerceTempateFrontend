import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border-t-4 ${
          type === "success" ? "border-customBlue" : "border-red-500"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-4 ${
            type === "success" ? "text-customBlue" : "text-red-600"
          }`}
        >
          {title}
        </h2>
        <p className="mb-6">{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-2 px-4 text-white rounded ${
            type === "success"
              ? "bg-customBlue hover:brightness-90"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {type === "success" ? "Continue" : "Close"}
        </button>
      </div>
    </div>
  );
};

export default Modal;
