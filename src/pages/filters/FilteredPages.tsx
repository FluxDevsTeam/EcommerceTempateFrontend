import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FaRegHeart } from "react-icons/fa";
import SortDropdown from './FilterDropDown';

// Define TypeScript interfaces
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

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const [sortOption, setSortOption] = useState<'latest' | 'highest' | 'lowest'>('latest');

  // URL filter parsing
  const getFiltersFromURL = (): FilterState => {
    const subcategories = searchParams.get('subcategories');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sizes = searchParams.get('sizes');

    return {
      selectedSubCategories: subcategories ? subcategories.split(',').map(Number) : [],
      priceRange: [
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 300000,
      ],
      selectedSizes: sizes ? sizes.split(',') : [],
    };
  };

  const currentFilters = getFiltersFromURL();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const apiParams = new URLSearchParams();

        if (currentFilters.selectedSubCategories.length > 0) {
          currentFilters.selectedSubCategories.forEach((subCatId) => {
            apiParams.append('sub_category', subCatId.toString());
          });
        }

        apiParams.append('min_price', currentFilters.priceRange[0].toString());
        apiParams.append('max_price', currentFilters.priceRange[1].toString());
        apiParams.append('page', currentPage.toString());
       

        const response = await fetch(
          `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/?${apiParams.toString()}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data: ApiResponse<Product> = await response.json();
        setProducts(data.results);
        setTotalCount(data.count);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage,  searchParams]);

  // Sort products client-side when sortOption or products change
  useEffect(() => {
    if (products.length > 0) {
      let sortedProducts = [...products];

      if (sortOption === 'latest') {
        sortedProducts.sort((a, b) => b.id - a.id);
      } else if (sortOption === 'highest') {
        sortedProducts.sort((a, b) => parseFloat(b.discounted_price) - parseFloat(a.discounted_price));
      } else if (sortOption === 'lowest') {
        sortedProducts.sort((a, b) => parseFloat(a.discounted_price) - parseFloat(b.discounted_price));
      }

      setProducts(sortedProducts);
    }
  }, [sortOption]);

 
  return (
    <div className="container mx-auto px-6 md:px-14 py-8 md:py-12 ">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-medium">Filtered Products</h1>

        <div className="flex items-center gap-4">
          <p className="text-gray-600">{totalCount} products found</p>
          <SortDropdown
            onSortChange={(sortValue) => {
              setSortOption(sortValue);
              setCurrentPage(1); // Reset page to 1 when sort changes
            }}
          />
        </div>
      </div>

      {/* Active filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {currentFilters.selectedSubCategories.length > 0 && (
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {currentFilters.selectedSubCategories.length} subcategories
          </div>
        )}
        {(currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 300000) && (
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            ₦ {currentFilters.priceRange[0]} -  ₦{currentFilters.priceRange[1]}
          </div>
        )}
        {currentFilters.selectedSizes.length > 0 && (
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {currentFilters.selectedSizes.length} sizes
          </div>
        )}
      </div>

      {/* Loading / Error / Empty states */}
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
          {/* Products grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 sm:mb-16">
            {products.map((item) => {
               const price = parseFloat(item.price);
               const discountedPrice = parseFloat(item.discounted_price);
               const amountSaved = price - discountedPrice;
              return (
               <div
                        key={item.id}
                        className="group hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden cursor-pointer"
                        onClick={() =>
                          navigate(`/product/item/${item.id}`)
                        }
                      >
                        <div className=" rounded-lg relative">
                          <div>
                            <img
                              src={item.image1}
                              alt={item.name}
                              className="w-full h-[200px] md:h-[300px] shadow-lg   object-cover"
                            />
                            <button
                              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 p-2 transition-colors duration-200"
                              aria-label="Add to favorites"
                            >
                              <FaRegHeart size={15} />
                            </button>
                          </div>
                        </div>
            
                        <div className="p-3 sm:p-4">
                    <h3 className="text-base leading-[100%]  sm:text-lg font-normal truncate">
                      {item.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2">
                      <span className="text-xl  font-normal leading-[100%] text-primary">
                      ₦ {discountedPrice.toFixed(0)}
                      </span>
                      <span className="text-gray-500 line-through text-xl sm:text-xl ">
                      ₦ {price.toFixed(0)}
                      </span>
                      <span className="bg-red-200 text-[#FF3333] px-2 py-1 rounded-full text-xs sm:text-sm">
                      ₦  {amountSaved.toFixed(0)}
                      </span>
                    </div>
                  </div>
                      </div>
              );
            })}
          </div>

          {/* Pagination (optional) */}
          {/* Add pagination buttons if needed */}
        </>
      )}
    </div>
  );
};

export default ProductsPage;
