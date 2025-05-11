import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Card from "@/card/Card";
import PaginationComponent from '@/components/Pagination';
import SortDropdown from './FilterDropDown';
import { WishData } from '@/card/wishListApi';
import { WishItem } from '@/card/types';

export interface Category {
  id: number;
  name: string;
}

export interface SubCategory {
  id: number;
  name: string;
  category: Category;
}

interface Product {
  id: number;
  name: string;
  image1: string;
  undiscounted_price: string;
  price: string;
  description: string;
  total_quantity: number;
  sub_category: SubCategory;
  colour: string;
  image2: string | null;
  image3: string | null;
  is_available: boolean;
  latest_item: boolean;
  latest_item_position: number;
  dimensional_size: string;
  weight: string;
  top_selling_items: boolean;
  top_selling_position: number;
  date_created: string;
  date_updated: string;
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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [productsData, setProductsData] = useState<ApiResponse<Product>>({
    count: 0,
    next: null,
    previous: null,
    results: []
  });
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [wishlistLoading, setWishlistLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'latest' | 'highest' | 'lowest'>('latest');

  // Get current page from URL or default to 1
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

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

  // Fetch wishlist data
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistRes = await WishData();
        setWishlistItems(wishlistRes);
      } catch (err) {
        console.error('Error loading wishlist:', err);
      } finally {
        setWishlistLoading(false);
      }
    };

    fetchWishlist();
  }, []);

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
        setProductsData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchParams]);

  // Sort products when sortOption or products change
  useEffect(() => {
    if (productsData.results.length > 0) {
      const sortedProducts = [...productsData.results];

      if (sortOption === 'latest') {
        sortedProducts.sort((a, b) => b.id - a.id);
      } else if (sortOption === 'highest') {
        sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (sortOption === 'lowest') {
        sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      }

      setDisplayProducts(sortedProducts);
    } else {
      setDisplayProducts([]);
    }
  }, [sortOption, productsData.results]);

  // Helper function to check if a product is in wishlist
  const getWishlistInfo = (productId: number) => {
    const matchedWish = wishlistItems.find(item => item.product.id === productId);
    return {
      isInitiallyLiked: !!matchedWish,
      wishItemId: matchedWish?.id
    };
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', newPage.toString());
      return newParams;
    });
  };

  // Calculate total pages
  const itemsPerPage = 10;
  const totalPages = productsData.count ? Math.ceil(productsData.count / itemsPerPage) : 1;

  return (
    <div className="container mx-auto px-6 md:px-14 py-8 md:py-12 ">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 pt-2">
        <h1 className="text-3xl md:text-4xl font-medium">Filtered Products</h1>

        <div className="flex items-center gap-4 pt-3 md:pt-0">
          <p className="text-gray-600">{productsData.count} products found</p>
          <SortDropdown
            onSortChange={(sortValue) => {
              setSortOption(sortValue);
              // Reset to first page when sort changes
              setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('page', '1');
                return newParams;
              });
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
      {loading || wishlistLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : displayProducts.length === 0 ? (
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
            {displayProducts.map((item) => {
              const wishlistInfo = getWishlistInfo(item.id);
              return (
                <Card 
                  key={item.id} 
                  product={item}
                  isInitiallyLiked={wishlistInfo.isInitiallyLiked}
                  wishItemId={wishlistInfo.wishItemId}
                />
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={Boolean(productsData.next)}
              hasPreviousPage={Boolean(productsData.previous)}
              handlePageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsPage;