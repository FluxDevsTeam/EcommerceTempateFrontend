import { useRef, useEffect, useState } from "react";
import { FiChevronDown } from 'react-icons/fi';

type DropdownProps = {
  label?: string;
  options: string[];
  widthClass?: string;          // e.g., "w-40"
  menuBgClass?: string;         // e.g., "bg-[#f0f0f0]"
  onSelect?: (value: string) => void;
};

const Dropdown = ({
  label = "Select Option",
  options,
  widthClass = "w-48",
  menuBgClass = "bg-white",
  onSelect
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

  return (
    <div ref={dropdownRef} className="relative inline-block text-sm">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`px-4 py-2 flex items-center justify-between gap-4 border border-[#CACACA] rounded-lg min-w-[150px] ${menuBgClass} z-10`}
      >
        <span>{selected}</span>
        <FiChevronDown />
      </button>

      {isOpen && (
        <ul
          className={`absolute left-0 mt-2 ${widthClass} border rounded shadow z-10 bg-white`}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={() => handleOptionClick(option)}
            >
              {option === "Active" && (
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              )}
              {option === "Delivered" && (
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
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
