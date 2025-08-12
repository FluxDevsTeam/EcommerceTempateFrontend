import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import search from '/images/Empty-rafiki 1 (1).png';
import Card from '@/card/Card';
import PaginationComponent from '@/components/Pagination';
import { WishData } from '@/card/wishListApi';
import { WishItem } from '@/card/types';

// Full search API endpoint
const SEARCH_API_URL = "https://api.kidsdesigncompany.com/api/v1/product/item/search/";

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

const fetchSearchResults = async (
  searchQuery?: string, 
  page: number = 1, 
  ordering?: string
): Promise<ApiResponse> => {
  const url = new URL(SEARCH_API_URL);
  
  if (searchQuery) {
    url.searchParams.set('search', searchQuery);
  }
  
  url.searchParams.set('page', page.toString());
  url.searchParams.set('page_size', '16'); // Explicitly set page_size to 16
  
  if (ordering) {
    url.searchParams.set('ordering', ordering);
  }
  
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch products");
  const data = await response.json();
  // Validate pagination data
  if (typeof data.count !== 'number' || !Array.isArray(data.results)) {
    throw new Error('Invalid pagination data');
  }
  return data;
};

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const orderingParam = searchParams.get('ordering') || '';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productsData, setProductsData] = useState<ApiResponse>({
    count: 0,
    next: null,
    previous: null,
    results: []
  });
  const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [ordering, setOrdering] = useState(orderingParam);

  useEffect(() => {
    const loadSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchSearchResults(query, currentPage, ordering);
        setProductsData(data);
        
      } catch (err) {
        console.error('Search results fetching error:', err);
        
        if (err instanceof Error) {
          setError(`Error loading search results: ${err.message}`);
        } else if (typeof err === 'string') {
          setError(`Error loading search results: ${err}`);
        } else {
          setError('Failed to load search results. Please try again later.');
        }
        
        setProductsData({
          count: 0,
          next: null,
          previous: null,
          results: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadSearchResults();
  }, [query, currentPage, ordering]);

  // Fetch wishlist data
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistRes = await WishData();
        setWishlistItems(wishlistRes.results);
      } catch (err) {
        console.error('Error loading wishlist:', err);
      } finally {
        setWishlistLoading(false);
      }
    };

    fetchWishlist();
  }, []);

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

  const handleOrderingChange = (newOrdering: string) => {
    setOrdering(newOrdering);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('ordering', newOrdering);
      newParams.delete('page');
      return newParams;
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8 md:py-0">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || wishlistLoading) {
    return (
      <div className="flex justify-center items-center py-10 text-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
        Loading search results...
      </div>
    );
  }
  
  const hasResults = productsData.results.length > 0;
  const itemsPerPage = 16; // Match specified pagination size
  const totalPages = productsData.count ? Math.ceil(productsData.count / itemsPerPage) : 1;

  return (
    <div className="container mx-auto px-4 md:px-14 py-8 md:py-12">
      {hasResults && (
        <div className="mb-6">
          <h1 className="text-xl md:text-3xl font-medium flex justify-center items-center pt-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600 mt-2 text-center">
            Showing {productsData.count} results
          </p>
        </div>
      )}

      {!hasResults && query && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-600 text-3xl">Couldn't find search results for "{query}"</p>
          <p className="text-gray-500 mt-2"><img src={search} alt='search-results' /></p>
        </div>
      )}

      {/* Products Grid */}
      {hasResults && (
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-10">
            {productsData.results.map((item) => {
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
      )}
    </div>
  );
};

export default SearchResults;