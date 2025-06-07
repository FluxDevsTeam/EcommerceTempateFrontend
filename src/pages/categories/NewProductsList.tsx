import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import Card from '@/card/Card';
import PaginationComponent from '../../components/Pagination';
import { useState, useEffect } from 'react';
import { WishData } from '@/card/wishListApi';
import { WishItem } from '@/card/types';

// Interfaces (unchanged)
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

interface NewProductsListProps {
  sortOption: string;
}

const fetchProducts = async (page = 1): Promise<ApiResponse> => {
  const response = await fetch(`https://api.kidsdesigncompany.com/api/v1/product/item/?is_available=true&page_size=16&page=${page}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  // Validate pagination data
  if (typeof data.count !== 'number' || !Array.isArray(data.results)) {
    throw new Error('Invalid pagination data');
  }
  return data;
};

const NewProductsList = ({ sortOption }: NewProductsListProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  // Fetch products
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['products', currentPage],
    queryFn: () => fetchProducts(currentPage),
  });

  // Fetch wishlist data
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

  if (isLoading || wishlistLoading) return (
    <div className="flex justify-center items-center py-10 text-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
      Loading results...
    </div>
  );

  if (error) return <div>Error: {(error as Error).message}</div>;

  // Helper function to check if a product is in wishlist
  const getWishlistInfo = (productId: number) => {
    const matchedWish = wishlistItems.find(item => item.product.id === productId);
    return {
      isInitiallyLiked: !!matchedWish,
      wishItemId: matchedWish?.id
    };
  };

  // Copy and sort the products
  const sortedProducts = [...(data?.results || [])].sort((a, b) => {
    const priceA = parseFloat(a.price);
    const priceB = parseFloat(b.price);

    if (sortOption === 'Highest price') {
      return priceB - priceA;
    } else if (sortOption === 'Lowest price') {
      return priceA - priceB;
    } else {
      // Latest items (assuming latest means higher ID)
      return b.id - a.id;
    }
  });

  // Calculate total pages
  const itemsPerPage = 16; // Match API page_size
  const totalPages = data?.count ? Math.ceil(data.count / itemsPerPage) : 1;

  // Determine if there are next and previous pages
  const hasNextPage = Boolean(data?.next);
  const hasPreviousPage = Boolean(data?.previous);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 md:space-x-8 space-x-0 gap-4 md:gap-8 mb-8 sm:mb-16">
        {sortedProducts.map((item) => {
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

      {/* Pagination controls */}
      {sortedProducts.length > 0 && (
        <div className="mt-6">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default NewProductsList;