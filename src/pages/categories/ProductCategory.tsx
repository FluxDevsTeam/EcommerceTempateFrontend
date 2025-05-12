import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import Card from '@/card/Card';
import PaginationComponent from '@/components/Pagination';
import { useState, useEffect } from 'react';
import SortDropdown from './SortButton';
import { WishData } from '@/card/wishListApi';
import { WishItem } from '@/card/types';

// Define TypeScript interfaces
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

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}



const fetchCategoryProducts = async (categoryId: number, page = 1): Promise<ApiResponse> => {
  const response = await fetch(
    `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/?category=${categoryId}&page=${page}`
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const fetchCategoryDetails = async (categoryId: number): Promise<Category> => {
  const response = await fetch(
    `https://ecommercetemplate.pythonanywhere.com/api/v1/product/category/${categoryId}/`
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const ProductCategory = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const categoryId = parseInt(id || '0', 10);
  
  // State for sorting
  const [sortOption, setSortOption] = useState<string>('Latest items');
  const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  // Fetch category details
  const {
    data: categoryData,
    isLoading: isLoadingCategory,
    error: categoryError
  } = useQuery<Category>({
    queryKey: ['category', categoryId],
    queryFn: () => fetchCategoryDetails(categoryId),
    enabled: !!categoryId
  });

  // Fetch products for the category
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError
  } = useQuery<ApiResponse>({
    queryKey: ['categoryProducts', categoryId, currentPage],
    queryFn: () => fetchCategoryProducts(categoryId, currentPage),
    enabled: !!categoryId
  });

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

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  const handleSortOptionChange = (option: string) => {
    setSortOption(option);
  };

  if (isLoadingCategory || isLoadingProducts || wishlistLoading) return (
    <div className="flex justify-center items-center py-10 text-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
      Loading results...
    </div>
  );

  if (categoryError) return <div>Error loading category: {(categoryError as Error).message}</div>;
  if (productsError) return <div>Error loading products: {(productsError as Error).message}</div>;
  if (!categoryData) return <div>Category not found</div>;
  if (!productsData) return <div>No products found in this category</div>;

  // Helper function to check if a product is in wishlist
  const getWishlistInfo = (productId: number) => {
    const matchedWish = wishlistItems.find(item => item.product.id === productId);
    return {
      isInitiallyLiked: !!matchedWish,
      wishItemId: matchedWish?.id
    };
  };

  // Sort products based on sortOption
  const sortedProducts = [...productsData.results].sort((a, b) => {
    const priceA = parseFloat(a.price);
    const priceB = parseFloat(b.price);

    if (sortOption === 'Highest price') {
      return priceB - priceA;
    } else if (sortOption === 'Lowest price') {
      return priceA - priceB;
    } else {
      // Default sort (latest items)
      return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
    }
  });

  // Calculate total pages
  const itemsPerPage = 10;
  const totalPages = productsData.count ? Math.ceil(productsData.count / itemsPerPage) : 1;

  return (
    <div className="w-full min-h-full flex flex-col px-6 md:px-24 py-8 md:py-12">
      {/* Category Header with Sort Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 pt-2">
        <div>
          <h1 className="text-3xl font-bold capitalize">{categoryData.name.toLowerCase()}</h1>
          <p className="text-gray-600 mt-2">
            Showing {productsData.count} products in this category
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <SortDropdown 
            selectedOption={sortOption}
            onSelectOption={handleSortOptionChange}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8 md:space-x-8 space-x-0  sm:mb-16">
        {sortedProducts.map((product) => {
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
    </div>
  );
};

export default ProductCategory;