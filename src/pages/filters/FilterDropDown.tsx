import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SortDropdownProps {
  onSortChange: (option: 'latest' | 'highest' | 'lowest') => void;
}

export default function SortDropdown({ onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Latest');

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (option: string, value: 'latest' | 'highest' | 'lowest') => {
    setSelectedOption(option);
    setIsOpen(false);
    onSortChange(value);
  };

  return (
    <div className="relative inline-flex">
      <button 
        className="p-3 w-[121px] bg-white text-black border-none rounded-2xl border-black flex items-center justify-between cursor-pointer" 
        onClick={toggleDropdown}
      >
        <span>{selectedOption}</span> {/* Changed to show selected option */}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 top-14 z-10 w-36 flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
          <button
            onClick={() => selectOption('Latest', 'latest')}
            className={`block w-full px-4 py-2 text-left text-sm font-medium ${
              selectedOption === 'Latest' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => selectOption('Highest price', 'highest')}
            className={`block w-full px-4 py-2 text-left text-sm font-medium ${
              selectedOption === 'Highest price' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            Highest price
          </button>
          <button
            onClick={() => selectOption('Lowest price', 'lowest')}
            className={`block w-full px-4 py-2 text-left text-sm font-medium ${
              selectedOption === 'Lowest price' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            Lowest price
          </button>
        </div>
      )}
    </div>
  );
}
