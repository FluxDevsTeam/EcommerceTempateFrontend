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
    <div className="relative inline-block text-left ">
      <button 
        className="inline-flex items-center justify-between w-40 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
        onClick={toggleDropdown}
      >
         <span>{selectedOption || 'Sort by'}</span>
        <ChevronDown
          className={`h-4 w-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 w-40 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
            className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left ${
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
