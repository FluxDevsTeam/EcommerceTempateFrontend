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

  // State for filter selections
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>(
    initialFilters?.selectedSubCategories || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialFilters?.priceRange || [0, 100000000] 
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
          `https://ecommercetemplate.pythonanywhere.com/api/v1/product/sub-category/?page=1`
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
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [isOpen]);

  // Handle fetching next page
  const fetchNextPage = async () => {
    if (!nextUrl) return;
    
    setLoading(true);
    try {
      const response = await fetch(nextUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch next page');
      }

      const data: ApiResponse<SubCategory> = await response.json();
      
      setSubCategories(prev => [...prev, ...data.results]);
      setDisplayedItems(data.results);
      setNextUrl(data.next);
      setPrevUrl(data.previous);
      setCurrentPage(prev => prev + 1);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load next page';
      setError(errorMessage);
      setLoading(false);
      console.error('Error fetching next page:', err);
    }
  };

  // Handle fetching previous page
  const fetchPreviousPage = async () => {
    if (!prevUrl) return;
    
    setLoading(true);
    try {
      const response = await fetch(prevUrl);
      
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
      console.error('Error fetching previous page:', err);
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
    setPriceRange(value);
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
    setPriceRange([0, 10000000]); 
    setSelectedSizes([]);
  };

  return (
    <div className={`fixed min-h-screen top-0 left-0 h-full bg-white shadow-lg w-80 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
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
          <Accordion type="single" collapsible className="w-full border-t border-gray-200" defaultValue="subcategory">
            <AccordionItem value="subcategory" className="border-b border-gray-200">
              <AccordionTrigger className="py-4 font-semibold cursor-pointer">
                Subcategory
                <span className="ml-2 text-sm text-gray-500">({totalItems} per page)</span>
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
                <div className="pt-2 pb-6">
                  <Slider
                    value={priceRange}
                    max={10000000} 
                    step={10} 
                    onValueChange={handlePriceChange}
                    className="mt-6 bg-customBlue cursor-pointer"
                  />          
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600 font-bold">₦{priceRange[0].toLocaleString()}</span>
                    <span className="text-gray-600 font-bold">₦{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
      
      <div className="px-6 pb-6 mt-4">
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