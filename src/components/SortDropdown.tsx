import { useState } from 'react';
import { ChevronDown } from 'lucide-react';


export default function SortDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Latest');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option : string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-flex">
     
      <button className="p-3 w-[121px] bg-white text-black border-none rounded-2xl border-black flex items-center justify-between cursor-pointer" onClick={toggleDropdown}>
            <span>Sort by</span>
            <ChevronDown className="h-4 w-4 {`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}" />
          </button>
      {isOpen && (
        <div
          role="menu"
          className="absolute left-0 top-14 z-10 w-35 flex justify-center items-center divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md"
        >
          <div>
            <button
              onClick={() => selectOption('Latest')}
              className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
              role="menuitem"
            >
              Latest
            </button>
            
            <button
              onClick={() => selectOption('Highest price')}
              className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
              role="menuitem"
            >
              Highest price
            </button>
            
            <button
              onClick={() => selectOption('Lowest price')}
              className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
              role="menuitem"
            >
              Lowest price
            </button>
          </div>
        </div>
      )}
    </div>
  );
}