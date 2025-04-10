import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi"
import { useNavigate } from "react-router-dom";


type SearchInputProps = {
  onItemSelect: () => void;
};

export interface Category {
    name: string;
    slug: string;
  }
  
  export interface SubCategory {
    name: string;
    slug: string;
  }

export interface Product {
    id: number;
    name: string;
    description: string;
    discount: boolean;
    colour: string[];
    size: string[] | number[];
    price: string;
    slug: string;
    inventory: number;
    top_deal: boolean;
    image1: string;
    image2: string;
    image3: string;
    category: Category;
  subcategory: SubCategory;

  }
  

export default function SearchInput({ onItemSelect }: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<{
    nameMatches: Product[];
    categoryMatches: Record<string, Product[]>;
  }>({
    nameMatches: [],
    categoryMatches: {},
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        setData(products);
      } catch (error) {
        console.error("Error loading products:", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();

        const nameMatches = data.filter(
          (product) =>
            product.name?.toLowerCase().includes(query) ?? false
        );

        const categoryMatches = data.filter(
          (product) =>
            product.category?.name?.toLowerCase().includes(query) ||
            product.category?.slug?.toLowerCase().includes(query)
        );
        

        const groupedCategoryMatches = categoryMatches.reduce<Record<string, Product[]>>(
          (acc, product) => {
            const categoryName = product.category?.name || "Unknown Category";
            if (!acc[categoryName]) acc[categoryName] = [];
            acc[categoryName].push(product);
            return acc;
          },
          {}
        );

        setFilteredData({ nameMatches, categoryMatches: groupedCategoryMatches });
      } else {
        setFilteredData({ nameMatches: [], categoryMatches: {} });
      }
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchQuery, data]);

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setSearchQuery("");
      setFilteredData({ nameMatches: [], categoryMatches: {} });
      if (inputRef.current) inputRef.current.blur();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (product: Product) => {
    setSearchQuery("");
    setFilteredData({ nameMatches: [], categoryMatches: {} });
    onItemSelect();
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilteredData({ nameMatches: [], categoryMatches: {} });
      setIsFocused(false); 
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onItemSelect();
    }
  };

  return (
    <div className="" ref={searchRef}>
      <form onSubmit={handleSearchSubmit}>
         <div className="md:w-[435px] w-full h-[48px] border rounded-lg bg-white border-black flex jutify-between items-center px-4 gap-3">
                      <FiSearch className="text-gray-500" />
                      <input 
                        ref={inputRef}
                        type="text" 
                        placeholder="Search for items" 
                        className="w-full h-full outline-none bg-transparent placeholder-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        disabled={loading}
                      />
                    </div>
      </form>

      {searchQuery && isFocused && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded shadow-lg z-50 mt-1 overflow-auto max-h-[300px]">
          {loading ? (
            <p className="p-2 text-gray-500">Loading...</p>
          ) : error ? (
            <p className="p-2 text-red-500">{error}</p>
          ) : filteredData.nameMatches.length > 0 ||
            Object.keys(filteredData.categoryMatches).length > 0 ? (
            <>
              {filteredData.nameMatches.length > 0 && (
                <div className="p-2">
                  <p className="font-bold text-gray-700 mb-2">Matching Products</p>
                  {filteredData.nameMatches.map((product) => (
                    <div
                      key={product.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleResultClick(product)}
                    >
                      <div>
                        <p className="font-medium">
                          {highlightMatch(product.name || "", searchQuery)}
                        </p>
                        <p className="text-sm text-gray-500"> ₦{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {Object.entries(filteredData.categoryMatches).map(
                ([category, products]) => (
                  <div key={category} className="p-2">
                    <p className="font-bold text-gray-700 mb-2">{category}</p>
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleResultClick(product)}
                      >
                        <div>
                          <p className="font-medium">
                            {highlightMatch(product.name || "", searchQuery)}
                          </p>
                          <p className="text-sm text-gray-500"> ₦{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </>
          ) : (
            <p className="p-2 text-gray-500">No results found</p>
          )}
        </div>
      )}
    </div>
  );
}

function highlightMatch(text: string, query: string) {
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")})`, "gi"));
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