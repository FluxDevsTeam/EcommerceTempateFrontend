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

// Define TypeScript interfaces for our data
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

interface FiltersComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

interface FilterState {
  selectedSubCategories: number[];
  priceRange: [number, number];
  selectedSizes: string[];
}
const FiltersComponent = ({ 
  isOpen, 
  onClose, 
  onApplyFilters,
  initialFilters 
}) => {
  // State for our fetched data
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 5;
  
  // State for filter selections - initialized with initialFilters or defaults
  const [selectedSubCategories, setSelectedSubCategories] = useState(
    initialFilters?.selectedSubCategories || []
  );
  const [priceRange, setPriceRange] = useState(
    initialFilters?.priceRange || [0, 5000]
  );
  const [selectedSizes, setSelectedSizes] = useState(
    initialFilters?.selectedSizes || []
  );
  
  // Fetch data with pagination
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch subcategories with pagination
        const subCategoryResponse = await fetch(
          `https://ecommercetemplate.pythonanywhere.com/api/v1/product/sub-category/?page=${currentPage}&page_size=${pageSize}`
        );
        
        if (!subCategoryResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const subCategoryData = await subCategoryResponse.json();
        
        setSubCategories(subCategoryData.results);
        setTotalItems(subCategoryData.count);
        setTotalPages(Math.ceil(subCategoryData.count / pageSize));
        setLoading(false);
      } catch (err) {
        setError('Failed to load filter data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [currentPage]);

  // Handle subcategory selection
  const handleSubCategoryClick = (id) => {
    setSelectedSubCategories(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Handle price range changes
  const handlePriceChange = (value) => {
    setPriceRange(value);
  };
  
  // Apply filters
  const handleApplyFilter = () => {
    if (typeof onApplyFilters !== 'function') {
      console.error('onApplyFilters is not a function');
      return;
    }

    const filters = {
      selectedSubCategories,
      priceRange,
      selectedSizes
    };
    
    try {
      onApplyFilters(filters);
      onClose();
    } catch (err) {
      console.error('Error applying filters:', err);
    }
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setSelectedSubCategories([]);
    setPriceRange([0, 10000]);
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
        
        {loading && currentPage === 1 ? (
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
                <span className="ml-2 text-sm text-gray-500">({totalItems})</span>
              </AccordionTrigger>
              <AccordionContent>
                {loading && currentPage > 1 ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                  </div>
                ) : (
                  <>
                    <ul className="space-y-3 py-1">
                      {subCategories.map((subCategory) => (
                        <li 
                          key={subCategory.id} 
                          className={`flex items-center gap-2 cursor-pointer ${
                            selectedSubCategories.includes(subCategory.id) ? 'text-black font-medium' : 'text-gray-600'
                          }`}
                          onClick={() => handleSubCategoryClick(subCategory.id)}
                        >
                          <input 
                            type="checkbox" 
                            checked={selectedSubCategories.includes(subCategory.id)}
                            onChange={() => {}}
                            className="h-4 w-4"
                          />
                          <span>{subCategory.name} ({subCategory.category.name})</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Pagination controls */}
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
                        <button 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:text-gray-700"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        
                        <div className="text-xs text-gray-500">
                          Page {currentPage} of {totalPages}
                        </div>
                        
                        <button 
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:text-gray-700"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="price" className="border-b border-gray-200">
              <AccordionTrigger className="py-4 font-semibold cursor-pointer">Price</AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 pb-6">
                  <Slider
                    value={priceRange}
                    max={10000}
                    step={100}
                    onValueChange={handlePriceChange}
                    className="mt-6 font-bold bg-black cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600 font-bold"> ₦{priceRange[0]}</span>
                    <span className="text-gray-600 font-bold"> ₦{priceRange[1]}</span>
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
            className="w-1/2 border border-black text-black rounded-full cursor-pointer font-medium hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleApplyFilter} 
            className="w-1/2 bg-black text-white rounded-full font-medium cursor-pointer hover:bg-black/90"
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersComponent
