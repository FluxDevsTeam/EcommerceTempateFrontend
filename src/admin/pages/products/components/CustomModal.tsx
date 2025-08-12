import React from 'react';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error';
}

export const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-xs sm:max-w-sm w-full mx-4 border-t-4 ${
        type === 'success' ? 'border-blue-500' : 'border-red-500'
      }`}>
        <h2 className={`text-lg sm:text-xl font-semibold mb-4 ${
          type === 'success' ? 'text-blue-600' : 'text-red-600'
        }`}>
          {title}
        </h2>
        <p className="mb-6 text-sm sm:text-base text-gray-600">{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-2 px-4 text-sm sm:text-base text-white rounded-lg transition-colors ${
            type === 'success' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {type === 'success' ? 'Continue' : 'Close'}
        </button>
      </div>
    </div>
  );
};