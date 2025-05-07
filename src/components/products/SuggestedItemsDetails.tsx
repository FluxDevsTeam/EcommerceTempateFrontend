import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import SuggestedProductDetails from "./SuggestedProductDetail";
import DescriptionList from "./DescriptionList";

// Define TypeScript interfaces for the API responses
interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  category: Category;
  name: string;
}

// Define proper size object structure
interface Size {
  id: number;
  size: string;
  quantity: number;
  undiscounted_price: string;
  price: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  total_quantity: number;
  sub_category: SubCategory;
  colour: string;
  image1: string;
  image2: string;
  image3: string;
  discounted_price?: string;
  price: string;
  undiscounted_price?: number;
  is_available: boolean;
  dimensional_size: string;
  weight: string;
  unlimited: boolean; // Added the unlimited field
  sizes: Size[];
}

interface ProductDetailParams {
  id: string;
}

const fetchProduct = async (id: number): Promise<Product> => {
  const response = await fetch(`https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/${id}/`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const SuggestedItemsDetails = () => {
  const { id } = useParams<keyof ProductDetailParams>() as ProductDetailParams;
  const productId = parseInt(id);
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // Fetch product data
  const { data: product, isLoading, error } = useQuery<Product, Error>({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId && !isNaN(productId)
  });

  // Initialize main image and selected size when product data is loaded
  useEffect(() => {
    if (product) {
      const images = [product.image1, product.image2, product.image3].filter(Boolean);
      if (images.length > 0 && !mainImage) {
        setMainImage(images[0]);
      }
      // Set the first available size as default if none selected
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        setSelectedSize(product.sizes[0].size);
      }
    }
  }, [product, mainImage, selectedSize]);

  if (!id || isNaN(productId)) {
    return <div className="text-center py-8">Invalid or missing product ID</div>;
  }

  if (isLoading) return <div className="text-center py-8">Loading product...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  // Images array - filter out falsy values for better type safety
  const images = [product.image1, product.image2, product.image3].filter(Boolean);

  // Calculate discount percentage
  const discountedPrice = parseFloat(product.price);
  const undiscountedPrice = product.undiscounted_price || parseFloat(product.price);
  const discountPercentage = undiscountedPrice > 0 
    ? Math.round(((undiscountedPrice - discountedPrice) / undiscountedPrice) * 100) 
    : 0;

  // Get available quantity for selected size
  const selectedSizeData = product.sizes.find(size => size.size === selectedSize);
  const availableQuantity = selectedSizeData?.quantity || 0;

  // Handle quantity changes
  const handleQuantityIncrease = () => {
    if (product.unlimited || quantity < availableQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Determine if the item is in stock
  const isInStock = product.unlimited || availableQuantity > 0;

  return (
    <div>
    <div className="w-full min-h-screen md:mt-8 px-6 md:px-12 py-4 lg:px-20">
      {/* Product Main Section */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-8">
        {/* Thumbnail Images (Left Column) */}
        <div className="flex mx-auto md:flex-col gap-5 order-1">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={`bg-gray-200 p-2 rounded-lg cursor-pointer hover:opacity-90 ${mainImage === img ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setMainImage(img)}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/100';
                }}
              />
            </div>
          ))}
        </div>

        {/* Main Product Image (Middle Column) */}
        <div className="rounded-lg max-w-md lg:order-2">
          {mainImage && (
            <img
              src={mainImage}
              alt="Main Product"
              className="w-[500px] h-[500px] aspect-square object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/500';
              }}
            />
          )}
        </div>

        {/* Product Info (Right Column) */}
        <div className="flex-1 max-w-lg order-2 lg:order-3">
          <div className="space-y-2 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl uppercase font-medium leading-tight">
              {product.name}
            </h1>
            
            <span className="inline-block bg-blue-100 text-sm md:text-base rounded-2xl p-2">
              {product.unlimited ? 'Unlimited stock' : `${availableQuantity} left in stock`}
            </span>
            
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <span className="text-xl md:text-3xl font-normal"> ₦ {product.price}</span>
              <div className="flex space-x-2">  
                {product.undiscounted_price && (
                  <span className="text-gray-500 line-through text-3xl"> 
                    ₦ {product.undiscounted_price}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-red-200 text-[#FF3333] p-3 rounded-full text-sm">
                    {discountPercentage}% off
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 text-base leading-relaxed line-clamp-2">
              {product.description}
            </p>
            
            <div className="space-y-1">
              <p className="text-gray-600 text-sm sm:text-base">Color</p>
              <p className="text-gray-900 font-bold capitalize">{product.colour}</p>
            </div>
            
            {/* Size Selector */}
            <div className="space-y-2">
              <p className="text-gray-600 text-sm sm:text-base">Size</p>
              <div className="grid grid-cols-4 gap-2">
                {isLoading ? (
                  <div className="col-span-4 text-center py-2">Loading sizes...</div>
                ) : product.sizes && product.sizes.length > 0 ? (
                  product.sizes.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => {
                        setSelectedSize(item.size);
                        setQuantity(1); // Reset quantity when size changes
                      }}
                      disabled={!product.unlimited && item.quantity <= 0}
                      className={`p-3 text-sm sm:text-base border rounded-2xl transition-colors ${
                        item.size === selectedSize
                          ? 'bg-black text-white border-black'
                          : !product.unlimited && item.quantity <= 0
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-gray-200 hover:bg-gray-300 border-gray-300 cursor-pointer'
                      }`}
                      title={!product.unlimited && item.quantity <= 0 ? 'Out of stock' : ''}
                    >
                      {item.size.toUpperCase()}
                      {!product.unlimited && item.quantity <= 0 && (
                        <span className="block text-xs text-red-500">(Sold out)</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="col-span-4 text-center py-2 text-red-500">No sizes available</div>
                )}
              </div>
            </div>
            
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <button 
                className="p-2 sm:p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleQuantityDecrease}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="text-lg">{quantity}</span>
              <button 
                className="p-2 sm:p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleQuantityIncrease}
                disabled={!product.unlimited && quantity >= availableQuantity}
              >
                +
              </button>
            </div>
            
            {/* Add to Cart */}
            <button 
              className="w-full py-3 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              disabled={!isInStock}
            >
              {isInStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-12 space-y-6">
        <h2 className="text-xl sm:text-2xl font-medium">Description</h2>
        <p className="text-gray-700 text-sm sm:text-base">
          {product.description}
        </p>
        <DescriptionList 
          details={{
            "Category": product.sub_category.category.name,
            "Subcategory": product.sub_category.name,
            "Weight": product.weight,
            "Color": product.colour
          }}
        />
        
        {/* Conditional rendering for Suggested or SuggestedProductDetails */}
      
      </div>
    </div>  
    <div className="px-0 md:px-12 ">
    <SuggestedProductDetails />
    </div>
    </div>
  );
};

export default SuggestedItemsDetails;