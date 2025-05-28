import React, { useEffect, useState, useRef } from "react";
import { IoSearch, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface Option {
  id: number;
  name: string;
}

interface PaginatedDropdownProps {
  options: Option[];
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  label?: string;
}

const ITEMS_PER_PAGE = 10;

const PaginatedDropdown: React.FC<PaginatedDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  required = false,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedItems, setDisplayedItems] = useState<Option[]>([]);
  const [page, setPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigate = useNavigate();

  useEffect(() => {
    setDisplayedItems(filteredOptions.slice(0, page * ITEMS_PER_PAGE));
  }, [page, searchQuery, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchMode(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.id === Number(value));

  const searchInputRef = useRef<HTMLInputElement>(null);

  const subCategorySearchInputFocus = () => {
    // if (searchInputRef.current) {
    //   searchInputRef.current.focus();
    // }

    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);

    console.log("search btn clicked");
    console.log(searchInputRef);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      {searchMode ? (
        <div className="relative">
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search..."
            ref={searchInputRef}
          />
          <button
            onClick={() => {
              setSearchMode(false);
              setSearchQuery("");
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <IoClose size={20} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full text-left px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
          >
            {selectedOption ? selectedOption.name : placeholder}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSearchMode(true);
              subCategorySearchInputFocus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <IoSearch size={20} />
          </button>
        </div>
      )}

      {(isOpen || searchMode) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {displayedItems.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
                setSearchMode(false);
                setSearchQuery("");
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {option.name}
            </button>
          ))}
          {filteredOptions.length > displayedItems.length && (
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="w-full px-4 py-2 text-center text-blue-600 hover:bg-gray-50 border-t"
            >
              Load more...
            </button>
          )}
          {displayedItems.length === 0 && (
            <div className="px-4 py-2 text-gray-500">
              No options found
              <button
                onClick={() =>
                  navigate("/admin/admin-categories/subcategories")
                }
                className="text-blue-600 hover:underline"
              >
                can't find? add a new sub-category
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaginatedDropdown;
