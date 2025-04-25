import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Define TypeScript interfaces for our data
interface Product {
  id: number;
  name: string;
  image1: string;
  discounted_price: string;
  price: string;
  sub_category: number;
  sizes: { size: string; quantity: number }[];
}

interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const FilteredProducts = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Get filter parameters from URL
  const subCategoriesParam = searchParams.get('subcategories');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const sizesParam = searchParams.get('sizes');

  // Parse filter parameters
  const selectedSubCategories = subCategoriesParam ? subCategoriesParam.split(',').map(Number) : [];
  const minPrice = minPriceParam ? parseInt(minPriceParam) : 0;
  const maxPrice = maxPriceParam ? parseInt(maxPriceParam) : 5000;
  const selectedSizes = sizesParam ? sizesParam.split(',') : [];

  // Fetch products on component mount and when filter parameters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data: ApiResponse<Product> = await response.json();
        setProducts(data.results);
        setTotalPages(Math.ceil(data.count / 12)); // Assuming 12 products per page
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters to products whenever products or filter parameters change
  useEffect(() => {
    if (products.length === 0) return;

    let filtered = [...products];

    // Filter by subcategories if any are selected
    if (selectedSubCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedSubCategories.includes(product.sub_category)
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => {
      const productPrice = product.discounted_price 
        ? parseFloat(product.discounted_price) 
        : parseFloat(product.price);
      return productPrice >= minPrice && productPrice <= maxPrice;
    });

    // Filter by sizes if any are selected
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => {
        // Check if product has any of the selected sizes
        return product.sizes && product.sizes.some(sizeObj => 
          selectedSizes.includes(sizeObj.size) && sizeObj.quantity > 0
        );
      });
    }

    setFilteredProducts(filtered);
  }, [products, selectedSubCategories, minPrice, maxPrice, selectedSizes]);

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Get current page products
  const itemsPerPage = 12;
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Format price to display with currency
  const formatPrice = (price: string) => {
    return `NGN ${parseFloat(price).toLocaleString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Filtered Products</h1>
      
      {/* Show active filters */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Active Filters:</h2>
        <div className="flex flex-wrap gap-2">
          {selectedSubCategories.length > 0 && (
            <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              Subcategories: {selectedSubCategories.length} selected
            </div>
          )}
          {(minPrice > 0 || maxPrice < 5000) && (
            <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              Price: NGN {minPrice} - NGN {maxPrice}
            </div>
          )}
          {selectedSizes.length > 0 && (
            <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              Sizes: {selectedSizes.join(', ')}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">No products match your filter criteria.</p>
          <p className="mt-2 text-gray-500">Try adjusting your filters to see more products.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-gray-600">{filteredProducts.length} products found</p>
          
          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map(product => (
              <div key={product.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200">
                  <img
                    src={product.image1}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm text-gray-700">{product.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {product.discounted_price ? (
                      <>
                        <p className="text-sm font-medium text-gray-900">{formatPrice(product.discounted_price)}</p>
                        <p className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</p>
                      </>
                    ) : (
                      <p className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</p>
                    )}
                  </div>
                  {/* Available sizes */}
                  {product.sizes && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.sizes.map((sizeObj, index) => (
                        sizeObj.quantity > 0 && (
                          <span
                            key={index}
                            className={`text-xs px-2 py-1 ${
                              selectedSizes.includes(sizeObj.size)
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {sizeObj.size}
                          </span>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {filteredProducts.length > itemsPerPage && (
            <div className="flex justify-center items-center space-x-4 mt-12">
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                variant="outline"
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Previous
              </Button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FilteredProducts;