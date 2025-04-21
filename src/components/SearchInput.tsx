import { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/api-types";

type SearchInputProps = {
  onItemSelect: () => void;
};

// Custom debounce hook
function useCustomDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    // Set up the timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // Clean up the timeout if value changes or component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

const API_URL = "https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/search/";

const fetchProducts = async (searchQuery?: string): Promise<Product[]> => {
  const url = searchQuery ? `${API_URL}?q=${encodeURIComponent(searchQuery)}` : API_URL;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch products");
  const data = await response.json();
  return data.results; 
};

export default function SearchInput({ onItemSelect }: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useCustomDebounce(searchQuery, 500);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch products using React Query
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => fetchProducts(debouncedQuery),
    enabled: !!debouncedQuery, // Only fetch when search query exists
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
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

  // Group products by category (optional)
  const categoryMatches = products.reduce<Record<string, Product[]>>((acc, product) => {
    const categoryName = product.category?.name || "Uncategorized";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(product);
    return acc;
  }, {});

  const handleResultClick = (product: Product) => {
    setSearchQuery("");
    onItemSelect();
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onItemSelect();
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearchSubmit}>
        <div className="md:w-[435px] w-full h-[48px] border rounded-lg bg-white border-black flex items-center px-4 gap-3">
          <FiSearch className="text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for items"
            className="w-full h-full outline-none bg-transparent placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
        </div>
      </form>

      {/* Search Results Dropdown */}
      {searchQuery && isFocused && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded shadow-lg z-50 mt-1 overflow-auto max-h-[300px]">
          {isLoading ? (
            <p className="p-2 text-gray-500">Loading...</p>
          ) : error ? (
            <p className="p-2 text-red-500">Error: {(error as Error).message}</p>
          ) : products.length > 0 ? (
            <>
              {/* Display products */}
              <div className="p-2">
                <p className="font-bold text-gray-700 mb-2">Matching Products</p>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => handleResultClick(product)}
                  >
                    <p className="font-medium">
                      {highlightMatch(product.name, searchQuery)}
                    </p>
                    <p className="text-sm text-gray-500 ml-2">₦{product.price}</p>
                  </div>
                ))}
              </div>

              {/* Grouped by category (optional) */}
              {Object.entries(categoryMatches).map(([category, items]) => (
                <div key={category} className="p-2">
                  <p className="font-bold text-gray-700 mb-2">{category}</p>
                  {items.map((product) => (
                    <div
                      key={product.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleResultClick(product)}
                    >
                      {highlightMatch(product.name, searchQuery)}
                    </div>
                  ))}
                </div>
              ))}
            </>
          ) : (
            <p className="p-2 text-gray-500">No results found</p>
          )}
        </div>
      )}
    </div>
  );
}

// Helper function to highlight search matches
function highlightMatch(text: string, query: string) {
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