import { useRef, useEffect, useState } from "react";
import { FiChevronDown } from 'react-icons/fi';

type DropdownProps = {
  label?: string;
  options: string[];    
  menuBgClass?: string;      
  onSelect?: (value: string) => void;
  disabled?: boolean;
};

const Dropdown = ({
  label = "Select Option",
  options,
  menuBgClass = "bg-white",
  onSelect,
  disabled = false
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleOptionClick = (option: string) => {
    if (disabled) return;
    setSelected(option);
    setIsOpen(false);
    onSelect?.(option);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelected(label); // Keeps it in sync when label prop changes
  }, [label]);

  return (
    <div ref={dropdownRef} className="relative inline-block text-sm px-2 py-1 sm:px-4 sm:py-2.5">
      <button
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        className={`px-2 py-1 sm:px-4 sm:py-2 text-[12px] sm:text-base flex items-center justify-between gap-4 border rounded-lg min-w-[100px] sm:min-w-[150px] z-10 
                    ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : menuBgClass + ' border-[#CACACA] hover:border-gray-400'}`}
        disabled={disabled}
      >
        <span>{selected}</span>
        <FiChevronDown className={`${disabled ? 'text-gray-300' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <ul
          className={`absolute left-0 mt-2 w-36 sm:w-48 border rounded shadow z-10 bg-white`}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={() => handleOptionClick(option)}
            >
              {option === "PAID" && (
                <span className="w-2 h-2 rounded-full bg-[#4CAF50]"></span>
              )}
              {option === "SHIPPED" && (
                <span className="w-2 h-2 rounded-full bg-[#2196F3]"></span>
              )}
              {option === "DELIVERED" && (
                <span className="w-2 h-2 rounded-full bg-[#9C27B0]"></span>
              )}
              {option === "CANCELLED" && (
                <span className="w-2 h-2 rounded-full bg-[#F44336]"></span>
              )}
              <span>{option}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
