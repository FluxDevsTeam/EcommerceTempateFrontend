import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Card from "@/card/Card";
import PaginationComponent from '@/components/Pagination';
import SortDropdown from './FilterDropDown';
import { WishData } from '../../pages/orders/api';
import type { WishItem } from '../../pages/orders/types';

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

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [productsData, setProductsData] = useState<ApiResponse<Product>>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });

  const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'latest' | 'highest' | 'lowest'>('latest');

  const currentPage = parseInt(searchParams.get('page') || '1', 10);


  const currentFilters = useMemo(() => {
    const subcategories = searchParams.get('subcategories')?.split(',').map(Number) || [];
    const minPrice = parseInt(searchParams.get('minPrice') || '0', 10);
    const maxPrice = parseInt(searchParams.get('maxPrice') || '1000000', 10);


    return {
      selectedSubCategories: subcategories,
      priceRange: [minPrice, maxPrice] as [number, number],
    };
  }, [searchParams]);

  
  const displayProducts = useMemo(() => {
    const products = [...productsData.results];
    switch (sortOption) {
      case 'highest':
        return products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'lowest':
        return products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      default:
        return products.sort((a, b) => b.id - a.id); // latest
    }
  }, [productsData.results, sortOption]);

  
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistRes = await WishData();
        setWishlistItems(wishlistRes);
      } catch (err) {
        console.error('Wishlist fetch error:', err);
      } finally {
        setWishlistLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const apiParams = new URLSearchParams();
        currentFilters.selectedSubCategories.forEach(subCatId => {
          apiParams.append('sub_category', subCatId.toString());
        });
        apiParams.append('min_price', currentFilters.priceRange[0].toString());
        apiParams.append('max_price', currentFilters.priceRange[1].toString());
        apiParams.append('page', currentPage.toString());

        const response = await fetch(
          `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/?${apiParams}`
        );

        if (!response.ok) throw new Error('Failed to fetch products');
        const data: ApiResponse<Product> = await response.json();
        setProductsData(data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, currentFilters]);

  const getWishlistInfo = useCallback(
    (productId: number) => {
      const matchedWish = wishlistItems.find(item => item.product.id === productId);
      return {
        isInitiallyLiked: !!matchedWish,
        wishItemId: matchedWish?.id,
      };
    },
    [wishlistItems]
  );

  const handlePageChange = useCallback((newPage: number) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set('page', newPage.toString());
      return params;
    });
  }, [setSearchParams]);

  const totalPages = useMemo(() => {
    return productsData.count ? Math.ceil(productsData.count / 10) : 1;
  }, [productsData.count]);

  return (
    <div className="container mx-auto px-6 md:px-14 py-8 md:py-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 pt-2">
        <h1 className="text-3xl md:text-4xl font-semibold capitalize">Filtered Products</h1>
        <div className="flex items-center gap-4 pt-3 md:pt-0">
          <p className="text-gray-600">{productsData.count} products found</p>
          <SortDropdown
            onSortChange={(sortValue) => {
              setSortOption(sortValue);
              setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('page', '1');
                return newParams;
              });
            }}
          />
        </div>
      </div>

      {/* Active filters display */}
      <div className="flex flex-wrap gap-2 mb-6">
        {currentFilters.selectedSubCategories.length > 0 && (
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {currentFilters.selectedSubCategories.length} subcategories
          </div>
        )}
        {(currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 10000000) && (
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            ₦ {currentFilters.priceRange[0]} - ₦ {currentFilters.priceRange[1]}
          </div>
        )}
       
      </div>

      {/* Loading / error / no results */}
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
          {/* Product grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 sm:mb-16">
            {displayProducts.map(product => {
              const wishlistInfo = getWishlistInfo(product.id);
              return (
                <Card
                  key={product.id}
                  product={product}
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
