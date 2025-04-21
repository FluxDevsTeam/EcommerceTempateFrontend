import { useState, useEffect } from 'react';
import { useSearchParams} from 'react-router-dom';
import ProductCard from './ProductsCard';
import { Product } from '@/types/api-types';
import search from '/images/Empty-rafiki 1 (1).png';

const API_URL = "https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/search/";

const fetchProducts = async (searchQuery?: string): Promise<Product[]> => {
  const url = searchQuery ? `${API_URL}?q=${encodeURIComponent(searchQuery)}` : API_URL;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch products");
  const data = await response.json();
  return data.results; 
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get('q') || '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredResults, setFilteredResults] = useState<{
    productResults: Product[];
    categoryResults: Record<string, Product[]>;
  }>({
    productResults: [],
    categoryResults: {},
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const fetchedProducts = await fetchProducts(query);
        
        if (!fetchedProducts) {
          throw new Error('No products data received from the API');
        }
        
        if (!Array.isArray(fetchedProducts)) {
          throw new Error(`Invalid products data format: ${typeof fetchedProducts}`);
        }
        
        filterProducts(fetchedProducts, query);
        
      } catch (err) {
        console.error('Product fetching error:', err);
        
        if (err instanceof Error) {
          setError(`Error loading products: ${err.message}`);
        } else if (typeof err === 'string') {
          setError(`Error loading products: ${err}`);
        } else {
          setError('Failed to load products. Please try again later.');
        }
        
        setFilteredResults({
          productResults: [],
          categoryResults: {},
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [query]);

  const filterProducts = (products: Product[], searchQuery: string) => {
    try {
      const normalizedQuery = searchQuery.toLowerCase().trim();

      // Filter products that match the search query
      const productMatches = products.filter((product) => {
        const productName = product?.name || '';
        return productName.toLowerCase().includes(normalizedQuery);
      });

      // Group products by category
      const groupedCategoryMatches = products.reduce<Record<string, Product[]>>(
        (acc, product) => {
          const categoryName = product?.category?.name || 'Uncategorized';
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(product);
          return acc;
        },
        {}
      );

      setFilteredResults({
        productResults: productMatches,
        categoryResults: groupedCategoryMatches,
      });
    } catch (err) {
      console.error('Error filtering products:', err);
      setError('Error processing search results. Please try again.');
    }
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
        Loading search results...
      </div>
    );
  }
  

  const hasResults = filteredResults.productResults.length > 0 || 
                    Object.keys(filteredResults.categoryResults).length > 0;

  return (
    <div className="container mx-auto p-4 mb-8">
      {hasResults && (
        <h1 className="uppercase text-[30px] font-bold mb-3">
          Search Results for "{query}"
        </h1>
      )}

      {!hasResults && query && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-600 text-3xl">Couldn't find search results for "{query}"</p>
          <p className="text-gray-500 mt-2"><img src={search} alt='search-results' /></p>
        </div>
      )}

      {filteredResults.productResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Products</h2>
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredResults.productResults.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {Object.entries(filteredResults.categoryResults).map(([category, products]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {category}
          </h2>
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
