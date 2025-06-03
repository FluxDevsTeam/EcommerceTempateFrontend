import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  category: Category;
  name: string;
}

interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface Product {
  id: number;
  name: string;
  price: string; // Assuming price is a string, adjust if it's a number
  sizes?: { price: string }[]; // Optional sizes array
  // Add other product fields if needed for price calculation logic
}

interface FilterState {
  selectedSubCategories: number[];
  priceRange: [number, number];
  selectedSizes: string[];
}

interface FiltersComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

const FiltersComponent: React.FC<FiltersComponentProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilters,
  initialFilters 
}) => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedItems, setDisplayedItems] = useState<SubCategory[]>([]);
  const [dbPriceRange, setDbPriceRange] = useState<[number, number]>([0, 10000000]); // Default, will be updated
  const [isDbPriceRangeInitialized, setIsDbPriceRangeInitialized] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 768 ? 10 : 10);

  // State for filter selections
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>(
    initialFilters?.selectedSubCategories || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialFilters?.priceRange || dbPriceRange
  );
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>(
    initialFilters?.priceRange || dbPriceRange
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initialFilters?.selectedSizes || []
  );

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `https://ecommercetemplate.pythonanywhere.com/api/v1/product/sub-category/?page=1&page_size=${itemsPerPage}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data: ApiResponse<SubCategory> = await response.json();
        
        setSubCategories([...data.results]);
        setDisplayedItems(data.results);
        setNextUrl(data.next);
        setPrevUrl(data.previous);
        setTotalItems(data.count);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load filter data';
        setError(errorMessage);
        setLoading(false);
        
      }
    };

    fetchData();
    fetchMinMaxPrices(); // Fetch min/max prices when component is open

    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 10 : 10);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Effect to fetch initial min/max prices for the slider
  const fetchMinMaxPrices = async () => {
    if (!isOpen) return;
    // Assuming you have an access token stored similarly to other components
    const accessToken = localStorage.getItem("accessToken"); 
    // if (!accessToken) {
    //   setError("Authentication error: No access token for fetching price range.");
    //   setIsDbPriceRangeInitialized(true); 
    //   return;
    // }
    try {
      let allProducts: Product[] = [];
      let nextPageUrl = `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/?page_size=100`;

      while (nextPageUrl) {
        const response = await fetch(nextPageUrl, {
          headers: {
            // Authorization: `JWT ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch products for price range: ${response.statusText}`);
        }
        const data: ApiResponse<Product> = await response.json();
        allProducts = allProducts.concat(data.results);
        nextPageUrl = data.next;
      }

      if (allProducts.length === 0) {
        setDbPriceRange([0, 1000]); // Default if no products
        setTempPriceRange([0, 1000]);
        setPriceRange([0, 1000]);
        setIsDbPriceRangeInitialized(true);
        return;
      }

      let minPrice = Infinity;
      let maxPrice = -Infinity;

      allProducts.forEach(product => {
        if (product.sizes && product.sizes.length > 0) {
          product.sizes.forEach((size: any) => {
            const price = parseFloat(size.price);
            if (!isNaN(price)) {
              if (price < minPrice) minPrice = price;
              if (price > maxPrice) maxPrice = price;
            }
          });
        } else {
          const productPrice = parseFloat(product.price);
          if (!isNaN(productPrice)) {
            if (productPrice < minPrice) minPrice = productPrice;
            if (productPrice > maxPrice) maxPrice = productPrice;
          }
        }
      });
      
      if (minPrice === Infinity || maxPrice === -Infinity) { 
          minPrice = 0;
          maxPrice = 1000;
      }
      if (minPrice === maxPrice) { 
          maxPrice = minPrice + 100; 
      }

      setDbPriceRange([minPrice, maxPrice]);
      setTempPriceRange([minPrice, maxPrice]); 
      setPriceRange([minPrice, maxPrice]); 

    } catch (err) {
      
      setError("Failed to load price range data. Using default.");
      setDbPriceRange([0, 10000000]); // Fallback to a wide default range
      setTempPriceRange([0, 10000000]);
      setPriceRange([0, 10000000]);
    } finally {
      setIsDbPriceRangeInitialized(true);
    }
  };

  // Handle fetching next page
  const fetchNextPage = async () => {
    if (!nextUrl) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${nextUrl}&page_size=${itemsPerPage}`); // Add page_size
      
      if (!response.ok) {
        throw new Error('Failed to fetch next page');
      }

      const data: ApiResponse<SubCategory> = await response.json();
      
      // setSubCategories(prev => [...prev, ...data.results]); // Only display current page items
      setDisplayedItems(data.results);
      setNextUrl(data.next);
      setPrevUrl(data.previous);
      setCurrentPage(prev => prev + 1);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load next page';
      setError(errorMessage);
      setLoading(false);
      
    }
  };

  // Handle fetching previous page
  const fetchPreviousPage = async () => {
    if (!prevUrl) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${prevUrl}&page_size=${itemsPerPage}`); // Add page_size
      
      if (!response.ok) {
        throw new Error('Failed to fetch previous page');
      }

      const data: ApiResponse<SubCategory> = await response.json();
      
      setDisplayedItems(data.results);
      setNextUrl(data.next);
      setPrevUrl(data.previous);
      setCurrentPage(prev => prev - 1);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load previous page';
      setError(errorMessage);
      setLoading(false);
      
    }
  };

  // Handle subcategory selection
  const handleSubCategoryClick = (id: number) => {
    setSelectedSubCategories(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Handle price range changes
  const handlePriceChange = (value: [number, number]) => {
    // Ensure min is not greater than max
    const newMin = Math.min(value[0], value[1]);
    const newMax = Math.max(value[0], value[1]);
    setTempPriceRange([newMin, newMax]);
  };

  const applyPriceFilter = () => {
    setPriceRange(tempPriceRange);
  };
  
  // Apply filters
  const handleApplyFilter = () => {
    const filters: FilterState = {
      selectedSubCategories,
      priceRange,
      selectedSizes
    };
    
    onApplyFilters(filters);
    onClose();
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setSelectedSubCategories([]);
    setPriceRange(dbPriceRange); // Reset to actual DB range
    setTempPriceRange(dbPriceRange); // Reset temp range as well
    setSelectedSizes([]);
  };

  return (
    <div className={`fixed min-h-screen top-0 left-0 h-full bg-white shadow-lg w-80 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {loading && subCategories.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <Accordion type="multiple" collapsible className="w-full border-t border-gray-200" defaultValue={['subcategory', 'price']}>
            <AccordionItem value="subcategory" className="border-b border-gray-200">
              <AccordionTrigger className="py-4 font-semibold cursor-pointer">
                Subcategory
                {/* <span className="ml-2 text-sm text-gray-500">({displayedItems.length} of {totalItems})</span> */}
              </AccordionTrigger>
              <AccordionContent>
                {/* Horizontal scrolling container */}
                <div className="flex flex-col ">
                  {displayedItems.map((subCategory) => (
                    <div 
                      key={subCategory.id} 
                      className={`flex-shrink-0  cursor-pointer ${
                        selectedSubCategories.includes(subCategory.id) 
                          ? 'border-black bg-gray-100' 
                          : 'border-gray-200'
                      }`}
                      onClick={() => handleSubCategoryClick(subCategory.id)}
                    >
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={selectedSubCategories.includes(subCategory.id)}
                          onChange={() => {}}
                          className="h-4 w-4"
                        />
                        <span className="whitespace-nowrap">
                          {subCategory.name} ({subCategory.category.name})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination controls */}
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                  <button 
                    onClick={fetchPreviousPage}
                    disabled={!prevUrl || loading}
                    className="flex items-center gap-1 p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:text-gray-700"
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>
                  
               
                  
                  <button 
                    onClick={fetchNextPage}
                    disabled={!nextUrl || loading}
                    className="flex items-center gap-1 p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:text-gray-700"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
                {loading && subCategories.length > 0 && (
                  <div className="flex justify-center py-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="price" className="border-b border-gray-200">
              <AccordionTrigger className="py-4 font-semibold cursor-pointer">Price</AccordionTrigger>
              <AccordionContent>
                {!isDbPriceRangeInitialized ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                  </div>
                ) : (
                  <div className="pt-2 px-4 pb-2">
                    <div className="relative h-8 mb-2 mx-auto"> {/* Updated width and centered */}
                      {/* Track */}
                      <div className="absolute h-1.5 bg-gray-200 rounded-full top-1/2 -translate-y-1/2"></div>
                      {/* Highlighted Range */}
                      <div
                        className="absolute h-1.5 px-4 bg-customBlue rounded-full top-1/2 -translate-y-1/2"
                        style={{
                          left: `${((tempPriceRange[0] - dbPriceRange[0]) / (dbPriceRange[1] - dbPriceRange[0])) * 100}%`,
                          width: `${((tempPriceRange[1] - tempPriceRange[0]) / (dbPriceRange[1] - dbPriceRange[0])) * 100}%`,
                        }}
                      ></div>
                      {/* Min Handle */}
                      <input
                        type="range"
                        min={dbPriceRange[0]}
                        max={dbPriceRange[1]}
                        value={tempPriceRange[0]}
                        onChange={(e) => {
                          const newMin = Number(e.target.value);
                          const constrainedMin = Math.max(dbPriceRange[0], Math.min(newMin, tempPriceRange[1] - 1));
                          setTempPriceRange([constrainedMin, tempPriceRange[1]]);
                        }}
                        className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-30"
                      />
                      {/* Max Handle */}
                      <input
                        type="range"
                        min={dbPriceRange[0]}
                        max={dbPriceRange[1]}
                        value={tempPriceRange[1]}
                        onChange={(e) => {
                          const newMax = Number(e.target.value);
                          const constrainedMax = Math.min(dbPriceRange[1], Math.max(newMax, tempPriceRange[0] + 1));
                          setTempPriceRange([tempPriceRange[0], constrainedMax]);
                        }}
                        className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-30"
                      />
                      {/* Visual Handles */}
                      <div
                        className="absolute w-4 h-4 bg-customBlue rounded-full shadow-md top-1/2 -translate-y-1/2 -translate-x-1/2 border-2 border-white z-20"
                        style={{ left: `${((tempPriceRange[0] - dbPriceRange[0]) / (dbPriceRange[1] - dbPriceRange[0])) * 100}%` }}
                      ></div>
                      <div
                        className="absolute w-4 h-4 bg-customBlue rounded-full shadow-md top-1/2 -translate-y-1/2 -translate-x-1/2 border-2 border-white z-20"
                        style={{ left: `${((tempPriceRange[1] - dbPriceRange[0]) / (dbPriceRange[1] - dbPriceRange[0])) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-4 text-sm">
                      <input 
                        type="number" 
                        value={tempPriceRange[0]} 
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= dbPriceRange[0] && value < tempPriceRange[1]) {
                            setTempPriceRange([value, tempPriceRange[1]]);
                          }
                        }}
                        className="w-24 p-1.5 border rounded-md text-center focus:ring-customBlue focus:border-customBlue"
                        min={dbPriceRange[0]}
                        max={tempPriceRange[1] - 1}
                      />
                      <span className="text-gray-500">-</span>
                      <input 
                        type="number" 
                        value={tempPriceRange[1]} 
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value <= dbPriceRange[1] && value > tempPriceRange[0]) {
                            setTempPriceRange([tempPriceRange[0], value]);
                          }
                        }}
                        className="w-24 p-1.5 border rounded-md text-center focus:ring-customBlue focus:border-customBlue"
                        min={tempPriceRange[0] + 1}
                        max={dbPriceRange[1]}
                      />
                    </div>
                    {/* <Button onClick={applyPriceFilter} className="w-full mt-4 bg-customBlue hover:bg-customBlue/90 text-white rounded-full">Apply Price</Button> */}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
      
      <div className="px-6 pb-6 mt-0">
        <div className="flex gap-3 mb-3">
          <Button 
            onClick={handleResetFilters} 
            variant="outline" 
            className="w-full border border-gray-300 text-gray-600 rounded-full cursor-pointer font-medium hover:bg-gray-100"
          >
            Reset All
          </Button>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="w-1/2 border border-black text-black rounded-full cursor-pointer font-medium hover:bg-customBlue hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleApplyFilter} 
            className="w-1/2 bg-customBlue hover:brightness-90 text-white rounded-full font-medium cursor-pointer hover:bg-black/90"
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersComponent;