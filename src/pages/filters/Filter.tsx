import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { IoClose } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

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

interface Product {
  id: number;
  name: string;
  image1: string;
  discounted_price: string;
  price: string;
}

interface Size {
  id: number;
  product: Product;
  size: string;
  quantity: number;
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
}

interface FilterState {
  selectedSubCategories: number[];
  priceRange: [number, number];
  selectedSizes: string[];
}

const FiltersComponent: React.FC<FiltersComponentProps> = ({ isOpen, onClose, onApplyFilters }) => {
  // State for our fetched data
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [sizeOptions, setSizeOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filter selections
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const navigate = useNavigate()
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch subcategories
        const subCategoryResponse = await fetch(
          'https://ecommercetemplate.pythonanywhere.com/api/v1/product/sub-category/',
        );
        
        // Fetch sizes
        const sizesResponse = await fetch(
          'https://ecommercetemplate.pythonanywhere.com/api/v1/product/size/',
        );

        if (!subCategoryResponse.ok || !sizesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const subCategoryData: ApiResponse<SubCategory> = await subCategoryResponse.json();
        const sizesData: ApiResponse<Size> = await sizesResponse.json();

        setSubCategories(subCategoryData.results);
        
        // Extract unique size values
        const uniqueSizes = Array.from(
          new Set(sizesData.results.map(sizeItem => sizeItem.size))
        );
        setSizeOptions(uniqueSizes);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load filter data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

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
  const handlePriceChange = (value: number[]) => {
    setPriceRange(value as [number, number]);
  };
  
  // Handle size selection
  const handleSizeClick = (size: string) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(item => item !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  // Apply filters
  const handleApplyFilter = () => {
    const filters = {
      selectedSubCategories,
      priceRange,
      selectedSizes
    };
    
    // Call the onApplyFilters function if provided
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    
    // Build query parameters for URL
    const searchParams = new URLSearchParams();
    
    // Add subcategories to query
    if (selectedSubCategories.length > 0) {
      searchParams.append('subcategories', selectedSubCategories.join(','));
    }
    
    // Add price range to query
    searchParams.append('minPrice', priceRange[0].toString());
    searchParams.append('maxPrice', priceRange[1].toString());
    
    // Add sizes to query
    if (selectedSizes.length > 0) {
      searchParams.append('sizes', selectedSizes.join(','));
    }
    
    // Navigate to products page with filter parameters
    navigate('/filtered-products');
    
    onClose();
  };
  

  // Reset filters
  const handleResetFilters = () => {
    setSelectedSubCategories([]);
    setPriceRange([0, 5000]);
    setSelectedSizes([]);
  };
  
  return (
    <div className={`fixed top-0 left-0 h-full bg-white shadow-lg w-80 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 cursor-pointer">
            <IoClose size={24} />
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <Accordion type="single" collapsible className="w-full border-t border-gray-200" defaultValue="subcategory">
            <AccordionItem value="subcategory" className="border-b border-gray-200">
              <AccordionTrigger className="py-4 font-semibold cursor-pointer">Subcategory</AccordionTrigger>
              <AccordionContent>
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
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="price" className="border-b border-gray-200">
              <AccordionTrigger className="py-4 font-semibold cursor-pointer">Price</AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 pb-6">
                  <Slider
                    value={priceRange}
                    max={5000}
                    step={100}
                    onValueChange={handlePriceChange}
                    className="mt-6 bg-black cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600">NGN{priceRange[0]}</span>
                    <span className="text-gray-600">NGN{priceRange[1]}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="size" className="border-b border-gray-200">
              <AccordionTrigger className="py-4 font-semibold cursor-pointer">Size</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-2 pb-4">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedSizes.includes(size)
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      onClick={() => handleSizeClick(size)}
                    >
                      {size}
                    </button>
                  ))}
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

export default FiltersComponent;