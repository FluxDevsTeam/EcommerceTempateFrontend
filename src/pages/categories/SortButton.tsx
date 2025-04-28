// SortDropdown.tsx
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface SortDropdownProps {
  selectedOption: string;
  onSelectOption: (option: string) => void;
}

export default function SortDropdown({ selectedOption, onSelectOption }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const selectOption = (option: string) => {
    if (option !== selectedOption) {
      onSelectOption(option);
    }
    setIsOpen(false);
  };
  
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center justify-between w-40 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <span>{selectedOption || 'Sort by'}</span>
        <ChevronDown
          className={`h-4 w-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute z-10 mt-2 w-40 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="py-1">
            {['Latest items', 'Highest price', 'Lowest price'].map((option) => (
              <button
                key={option}
                onClick={() => selectOption(option)}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left"
                role="menuitem"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
