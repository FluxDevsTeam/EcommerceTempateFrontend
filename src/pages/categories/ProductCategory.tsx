import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Card from '@/card/Card';
import PaginationComponent from '@/components/Pagination';
import SortDropdown from './SortButton';
import { WishData } from '../orders/api';
import type { WishItem } from '../orders/types';

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
  price: string;
  undiscounted_price: string;
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

// Fetch functions
const fetchCategoryProducts = async (categoryId: number, page = 1): Promise<ApiResponse> => {
  const response = await fetch(
    `https://api.kidsdesigncompany.com/api/v1/product/item/?is_available=true&category=${categoryId}&page_size=16&page=${page}`
  );
  if (!response.ok) throw new Error('Failed to fetch products.');
  return response.json();
};

const fetchCategoryDetails = async (categoryId: number): Promise<Category> => {
  const response = await fetch(
    `https://api.kidsdesigncompany.com/api/v1/product/category/${categoryId}/`
  );
  if (!response.ok) throw new Error('Failed to fetch category.');
  return response.json();
};

// Component
const ProductCategory = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const categoryId = parseInt(id || '0', 10);

  const [sortOption, setSortOption] = useState<string>('Latest items');
  const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  // Query: Category Details
  const {
    data: categoryData,
    isLoading: isLoadingCategory,
    error: categoryError
  } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => fetchCategoryDetails(categoryId),
    enabled: !!categoryId
  });

  // Query: Products in Category
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError
  } = useQuery({
    queryKey: ['categoryProducts', categoryId, currentPage],
    queryFn: () => fetchCategoryProducts(categoryId, currentPage),
    enabled: !!categoryId
  });

  // Wishlist Effect
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistRes = await WishData();
        setWishlistItems(wishlistRes.results);
      } catch (err) {
        
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

  // Loading state
  if (isLoadingCategory || isLoadingProducts || wishlistLoading) {
    return (
      <div className="flex justify-center items-center py-10 text-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3" />
        Loading results...
      </div>
    );
  }

  // Error handling
  if (categoryError) return <div>Error loading category: {(categoryError as Error).message}</div>;
  if (productsError) return <div>Error loading products: {(productsError as Error).message}</div>;
  if (!categoryData) return <div>Category not found</div>;
  if (!productsData) return <div>No products found in this category</div>;

  // Check wishlist
  const getWishlistInfo = (productId: number) => {
    const matchedWish = wishlistItems.find(item => item.product.id === productId);
    return {
      isInitiallyLiked: !!matchedWish,
      wishItemId: matchedWish?.id
    };
  };

  // Sorting logic
  const sortedProducts = [...productsData.results].sort((a, b) => {
    const priceA = parseFloat(a.price);
    const priceB = parseFloat(b.price);

    if (sortOption === 'Highest price') return priceB - priceA;
    if (sortOption === 'Lowest price') return priceA - priceB;

    return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
  });

  const itemsPerPage = 16; // Match API page_size
  const totalPages = Math.ceil(productsData.count / itemsPerPage);

  return (
    <div className="w-full min-h-full flex flex-col px-6 md:px-24 py-8 md:py-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 pt-2">
        <div>
          <h1 className="text-3xl font-semibold capitalize">{categoryData.name.toLowerCase()}</h1>
          <p className="text-gray-600 mt-2">
            Showing {productsData.count} products in this category
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <SortDropdown selectedOption={sortOption} onSelectOption={handleSortOptionChange} />
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-10">
        {sortedProducts.map(product => {
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
      {productsData.results.length > 0 && (
        <div className="mt-6">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={Boolean(productsData.next)}
            hasPreviousPage={Boolean(productsData.previous)}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
