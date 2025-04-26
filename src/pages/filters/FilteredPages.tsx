import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FiltersComponent from './Filter';
import { IoFilter } from "react-icons/io5";

// Define TypeScript interfaces for our data
interface Product {
  id: number;
  name: string;
  image1: string;
  discounted_price: string;
  price: string;
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

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State for products and UI
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  
  // Parse filter parameters from URL
  const getFiltersFromURL = (): FilterState => {
    const subcategories = searchParams.get('subcategories');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sizes = searchParams.get('sizes');
    
    return {
      selectedSubCategories: subcategories ? subcategories.split(',').map(Number) : [],
      priceRange: [
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 300000
      ],
      selectedSizes: sizes ? sizes.split(',') : []
    };
  };
  
  const currentFilters = getFiltersFromURL();
  
  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      try {
        // Build query parameters for API request
        const apiParams = new URLSearchParams();
        
        // Add subcategories to query
        if (currentFilters.selectedSubCategories.length > 0) {
          currentFilters.selectedSubCategories.forEach(subCatId => {
            apiParams.append('sub_category', subCatId.toString());
          });
        }
        
        // Add price range
        apiParams.append('min_price', currentFilters.priceRange[0].toString());
        apiParams.append('max_price', currentFilters.priceRange[1].toString());
        
        // Add pagination
        apiParams.append('page', currentPage.toString());
        apiParams.append('page_size', pageSize.toString());
        
        // Size filtering requires an additional step since the API doesn't support size filtering directly
        const response = await fetch(
          `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/?${apiParams.toString()}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data: ApiResponse<Product> = await response.json();
        
        // Set products and total count
        setProducts(data.results);
        setTotalCount(data.count);
        
        // If size filters are applied, we need to filter client-side
        // In a real application, you might want to implement a separate API call to get products by size
        if (currentFilters.selectedSizes.length > 0) {
          // Here we would need to fetch product sizes and filter accordingly
          // For now, we'll just show a note that size filtering is applied
          console.log('Size filtering applied:', currentFilters.selectedSizes);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };
    
    fetchProducts();
  }, [currentPage, pageSize, searchParams]);
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };
  
  // Apply new filters
  const handleApplyFilters = (filters: FilterState) => {
    // This will be handled by the FiltersComponent which will navigate to this page with new params
    setIsFilterOpen(false);
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Filtered Products</h1>
        <Button 
          onClick={() => setIsFilterOpen(true)} 
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full"
        >
          <IoFilter />
          Filters
        </Button>
      </div>
      
      {/* Active filters display */}
      <div className="flex flex-wrap gap-2 mb-6">
        {currentFilters.selectedSubCategories.length > 0 && (
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {currentFilters.selectedSubCategories.length} subcategories
          </div>
        )}
        
        {(currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 300000) && (
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            NGN{currentFilters.priceRange[0]} - NGN{currentFilters.priceRange[1]}
          </div>
        )}
        
        {currentFilters.selectedSizes.length > 0 && (
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {currentFilters.selectedSizes.length} sizes
          </div>
        )}
      </div>
      
      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">No products found matching your filters.</p>
          <Button 
            onClick={() => navigate('/products')} 
            className="mt-4 bg-black text-white px-6 py-2 rounded-full"
          >
            View All Products
          </Button>
        </div>
      ) : (
        <>
          {/* Products count */}
          <p className="text-gray-600 mb-4">{totalCount} products found</p>
          
          {/* Products grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-square relative overflow-hidden rounded-lg mb-2">
                  <img 
                    src={product.image1} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="font-medium text-sm md:text-base truncate">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm md:text-base">NGN{product.discounted_price}</span>
                  {product.discounted_price !== product.price && (
                    <span className="text-gray-500 line-through text-xs md:text-sm">NGN{product.price}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="px-4 py-2 border rounded"
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    variant={currentPage === page ? "default" : "outline"}
                    className={`w-10 h-10 rounded-full ${
                      currentPage === page ? 'bg-black text-white' : 'border text-black'
                    }`}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="px-4 py-2 border rounded"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Filter sidebar */}
      <FiltersComponent
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={currentFilters}
      />
    </div>
  );
};

export default ProductsPage;