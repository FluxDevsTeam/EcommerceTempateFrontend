import { useState, useEffect, useCallback } from 'react';

// Types
interface Product {
  id: number;
  name: string;
  image1: string;
  discounted_price: string;
  price: string;
  subcategory: number;
  sizes: {
    id: number;
    size: string;
    quantity: number;
  }[];
}

interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface FilterState {
  selectedSubCategories: number[];
  priceRange: [number, number];
  selectedSizes: string[];
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMoreProducts: () => void;
  applyFilters: (filters: FilterState) => void;
  resetFilters: () => void;
  totalCount: number;
  currentFilters: FilterState | null;
}

const useProducts = (initialFilters?: FilterState): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<FilterState | null>(initialFilters || null);
  const [totalCount, setTotalCount] = useState(0);

  // Function to build API query params based on the actual endpoint documentation
  const buildQueryParams = useCallback((filters: FilterState | null, pageNum: number): URLSearchParams => {
    const params = new URLSearchParams();
    params.append('page', pageNum.toString());
    params.append('page_size', '12');
    
    if (filters) {
      // Add subcategory filters using 'sub_category' param - note the underscore
      if (filters.selectedSubCategories.length) {
        filters.selectedSubCategories.forEach(subCatId => {
          params.append('sub_category', subCatId.toString());
        });
      }
      
      // Add price range using the correct parameter names
      if (filters.priceRange && filters.priceRange.length === 2) {
        params.append('min_price', filters.priceRange[0].toString());
        params.append('max_price', filters.priceRange[1].toString());
      }
    }
    
    return params;
  }, []);

  // Client-side filtering for size since the API doesn't support size filtering
  const applyClientSideFilters = useCallback((products: Product[], filters: FilterState | null): Product[] => {
    if (!filters || filters.selectedSizes.length === 0) return products;
    
    return products.filter(product => {
      // Size filter - this needs to be done client-side since the API doesn't support it
      return product.sizes?.some(sizeObj => filters.selectedSizes.includes(sizeObj.size));
    });
  }, []);

  // Fetch products with parameters matching the API documentation
  const fetchProducts = useCallback(async (filters: FilterState | null, pageNum: number) => {
    if (pageNum === 1) {
      setLoading(true);
      setProducts([]); // Clear products when starting a new search
    }
    
    try {
      const params = buildQueryParams(filters, pageNum);
      console.log("Fetching with params:", params.toString()); // Debug the URL parameters
      
      const response = await fetch(
        `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data: ApiResponse<Product> = await response.json();
      setTotalCount(data.count);
      
      // If this is page 1, just use the new results, otherwise append to existing
      const newProducts = pageNum === 1 ? data.results : [...products, ...data.results];
      
      // Apply client-side filtering for sizes since the API doesn't support it
      const filteredProducts = applyClientSideFilters(newProducts, filters);
      
      setProducts(filteredProducts);
      setHasMore(!!data.next && filteredProducts.length < data.count);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products');
      setLoading(false);
      console.error('Error fetching products:', err);
    }
  }, [products, buildQueryParams, applyClientSideFilters]);

  // Initial fetch
  useEffect(() => {
    fetchProducts(initialFilters, 1);
  }, []);

  // Apply filters
  const applyFilters = useCallback((filters: FilterState) => {
    console.log("Applying filters:", JSON.stringify(filters)); // Debug the filters
    setCurrentFilters(filters);
    setPage(1);
    fetchProducts(filters, 1);
  }, [fetchProducts]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setCurrentFilters(null);
    setPage(1);
    fetchProducts(null, 1);
  }, [fetchProducts]);

  // Load more products
  const loadMoreProducts = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(currentFilters, nextPage);
  }, [page, currentFilters, fetchProducts]);

  return {
    products,
    loading,
    error,
    hasMore,
    loadMoreProducts,
    applyFilters,
    resetFilters,
    totalCount,
    currentFilters
  };
};

export default useProducts;