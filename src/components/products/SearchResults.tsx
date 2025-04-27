import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductsCard';
import { Product } from '@/types/api-types';
import search from '/images/Empty-rafiki 1 (1).png';

// Full search API endpoint
const SEARCH_API_URL = "https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/search/";



const fetchSearchResults = async (searchQuery?: string, page: number = 1, pageSize: number = 24, ordering?: string): Promise<{
  products: Product[],
  totalProducts: number,
  totalPages: number
}> => {
  const url = new URL(SEARCH_API_URL);
  
  // Add search query parameter
  if (searchQuery) {
    url.searchParams.set('search', searchQuery);
  }
  
  // Add pagination parameters
  url.searchParams.set('page', page.toString());
  url.searchParams.set('page_size', pageSize.toString());
  
  // Add ordering parameter if provided
  if (ordering) {
    url.searchParams.set('ordering', ordering);
  }
  
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch products");
  const data = await response.json();
  
  const products = data.results || [];
  const totalProducts = data.count || 0;
  const totalPages = Math.ceil(totalProducts / pageSize);
  
  return {
    products,
    totalProducts,
    totalPages
  };
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const pageParam = searchParams.get('page');
  const orderingParam = searchParams.get('ordering');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: currentPage,
    totalPages: 1,
    totalProducts: 0
  });
  const [ordering, setOrdering] = useState(orderingParam || '');

  useEffect(() => {
    const loadSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { products, totalProducts, totalPages } = 
          await fetchSearchResults(query, currentPage, 24, ordering);
        
        if (!products) {
          throw new Error('No products data received from the API');
        }
        
        if (!Array.isArray(products)) {
          throw new Error(`Invalid products data format: ${typeof products}`);
        }
        
        setProducts(products);
        setPagination({
          currentPage,
          totalPages,
          totalProducts
        });
        
      } catch (err) {
        console.error('Search results fetching error:', err);
        
        if (err instanceof Error) {
          setError(`Error loading search results: ${err.message}`);
        } else if (typeof err === 'string') {
          setError(`Error loading search results: ${err}`);
        } else {
          setError('Failed to load search results. Please try again later.');
        }
        
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadSearchResults();
  }, [query, currentPage, ordering]);

  // Function to navigate to a specific page
  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    window.history.pushState({}, '', url.toString());
    window.location.href = url.toString();
  };

  // Handle ordering change
  const handleOrderingChange = (newOrdering: string) => {
    setOrdering(newOrdering);
    
    const url = new URL(window.location.href);
    url.searchParams.set('ordering', newOrdering);
    url.searchParams.delete('page'); // Reset to page 1 when changing ordering
    window.history.pushState({}, '', url.toString());
    
    // No need to trigger location change here, the useEffect will handle the new API call
  };

  // Render pagination controls
  const renderPagination = () => {
    const { currentPage, totalPages } = pagination;
    
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    const maxPageButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-8 space-x-2">
        {currentPage > 1 && (
          <button 
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            className={`px-3 py-1 border rounded-md ${
              currentPage === number ? 'bg-black text-white' : 'hover:bg-gray-100'
            }`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
        
        {currentPage < totalPages && (
          <button 
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
        Loading search results...
      </div>
    );
  }
  
  const hasResults = products.length > 0;

  return (
    <div className="container mx-auto p-4 my-8">
      {hasResults && (
        <div className="mb-6">
          <h1 className="uppercase text-4xl font-medium flex justify-center items-center">
            Search Results for "{query}"
          </h1>
        
          {/* Sort/Ordering Options */}
          <div className="flex justify-end mt-4 mb-6">
            <label className="flex items-center">
              <span className="mr-2 text-gray-700">Sort by:</span>
              <select 
                className="border rounded-md p-2"
                value={ordering}
                onChange={(e) => handleOrderingChange(e.target.value)}
              >
                <option value="">Default</option>
                <option value="name">Name A-Z</option>
                <option value="-name">Name Z-A</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-created_at">Newest</option>
              </select>
            </label>
          </div>
        </div>
      )}

      {!hasResults && query && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-600 text-3xl">Couldn't find search results for "{query}"</p>
          <p className="text-gray-500 mt-2"><img src={search} alt='search-results' /></p>
        </div>
      )}

      {/* Products Grid - Display all products without grouping */}
      {hasResults && (
        <div className="mb-8">
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
          
          {/* Pagination Controls */}
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default SearchResults;