import { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

type SearchInputProps = {
  onItemSelect: () => void;
};

// Custom debounce hook
function useCustomDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Autocomplete API endpoint
const AUTOCOMPLETE_API_URL = "https://api.fluxdevs.com/api/v1/product/item/autocomplete/";

const fetchAutocompleteResults = async (searchQuery?: string): Promise<string[]> => {
  if (!searchQuery || searchQuery.trim() === "") {
    return [];
  }
  
  const url = new URL(AUTOCOMPLETE_API_URL);
  url.searchParams.set('query', searchQuery);
  
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch autocomplete results");
  
  // The API returns an array of strings
  const data = await response.json();
  return data;
};

export default function SearchInput({ onItemSelect }: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useCustomDebounce(searchQuery, 300); // Faster debounce for autocomplete
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch autocomplete suggestions using React Query
  const { data: suggestions, isLoading, error } = useQuery({
    queryKey: ["autocomplete", debouncedQuery],
    queryFn: () => fetchAutocompleteResults(debouncedQuery),
    enabled: !!debouncedQuery && debouncedQuery.trim() !== "", // Only run query if we have a non-empty query
    staleTime: 1 * 60 * 1000, // 1 minute - shorter stale time for autocomplete
  });

  // Handle clicks outside the search component to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(""); // Clear the search bar
    onItemSelect();
    setIsFocused(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const handleSearchIconClick = () => {
    performSearch();
  };

  const performSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear the search bar after search
      onItemSelect();
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Check if we have any suggestions to show
  const hasSuggestions = suggestions && suggestions.length > 0;

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearchSubmit}>
        <div className="md:w-[435px] w-full h-[48px] border rounded-lg bg-white border-black flex items-center px-4 gap-3">
          <FiSearch 
            className="text-gray-500 cursor-pointer" 
            onClick={handleSearchIconClick}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for items, categories, or brands"
            className="w-full h-full outline-none bg-transparent placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {searchQuery && isFocused && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded shadow-lg z-50 mt-1 overflow-auto max-h-[400px]">
          {isLoading ? (
            <div className="p-3 text-gray-500 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
              Loading suggestions...
            </div>
          ) : error ? (
            <p className="p-3 text-red-500">Error: {(error as Error).message}</p>
          ) : hasSuggestions ? (
            <div className="p-2">
              {/* Suggestions Section */}
              <div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={`suggestion-${index}`}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <FiSearch className="text-gray-400 mr-2" size={14} />
                    <p className="font-medium">
                      {highlightMatch(suggestion, searchQuery)}
                    </p>
                  </div>
                ))}
              </div>

              {/* View all search results link */}
              <div 
                className="p-2 mt-2 border-t text-center text-blue-600 hover:bg-gray-50 cursor-pointer"
                onClick={performSearch}
              >
                View all results for "{searchQuery}"
              </div>
            </div>
          ) : (
            <p className="p-3 text-gray-500">No suggestions found</p>
          )}
        </div>
      )}
    </div>
  );
}

// Helper function to highlight search matches
function highlightMatch(text: string, query: string) {
  if (!text || !query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="bg-yellow-200 font-bold">
        {part}
      </span>
    ) : (
      part
    )
  );
}



// import search from './img/shape.png';

// const SearchForm = () => {
//   return (
//     <form className="flex items-center gap-4 px-2 py-1 sm:px-4 sm:py-2.5 border border-[#CACACA] rounded-lg">
//         <img src={search} alt="search" className="h-[18px] w-[18px]" />
//         <input type="text" placeholder="Search" className="focus:outline-none" />
//     </form>
//   )
// }

// export default SearchForm
