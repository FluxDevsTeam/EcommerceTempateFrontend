import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Suggested from "./Suggested";
import { addToLocalCart, isItemInLocalCart, isItemInUserCart } from "../../utils/cartStorage";

import DescriptionList from "./DescriptionList";

const baseURL = "https://ecommercetemplate.pythonanywhere.com";

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
  discounted_price?: number;
  price: number;
  undiscounted_price?: number;
  is_available: boolean;
  dimensional_size: string;
  weight: string;
  unlimited: boolean;
  production_days: number;
  sizes: Size[];
}

interface ProductDetailParams {
  id: string;
}

const fetchProduct = async (id: number): Promise<Product> => {
  const response = await fetch(
    `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/${id}/`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const ProductDetail = () => {
  const { id } = useParams<keyof ProductDetailParams>() as ProductDetailParams;
  const productId = parseInt(id);

  // Group all useState hooks together at the top
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Fetch product data
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product, Error>({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  });

  // Group all useEffect hooks together
  useEffect(() => {
    if (product) {
      const images = [product.image1, product.image2, product.image3].filter(
        Boolean
      );
      if (images.length > 0 && !mainImage) {
        setMainImage(images[0]);
      }
      // Set the first available size as default if none selected
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        setSelectedSize(product.sizes[0].size);
      }
    }
  }, [product, mainImage, selectedSize]);

  const createNewCart = async (accessToken: string) => {
    const response = await fetch(`${baseURL}/api/v1/cart/`, {
      method: "POST",
      headers: {
        Authorization: `JWT ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: "",
        last_name: "",
        email: "",
        state: "",
        city: "",
        delivery_address: "",
        phone_number: "",
      }),
    });

    if (!response.ok) throw new Error("Failed to create cart");
    const data = await response.json();
    return data.id;
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Please select a size",
        type: "error",
      });
      return;
    }

    setIsAddingToCart(true);

    if (!product) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Product data not available",
        type: "error",
      });
      setIsAddingToCart(false);
      return;
    }

    const selectedSizeData = product?.sizes?.find(
      (size) => size.size === selectedSize
    );

    if (!selectedSizeData) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Selected size not found",
        type: "error",
      });
      setIsAddingToCart(false);
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      // Check if item already exists in local cart
      if (isItemInLocalCart(product.id, selectedSizeData.id)) {
        setModalConfig({
          isOpen: true,
          title: "Notice",
          message: "This item is already in your cart",
          type: "error",
        });
        setIsAddingToCart(false);
        return;
      }

      // Store in local storage for guest users
      addToLocalCart({
        productId: product.id,
        sizeId: selectedSizeData.id,
        productName: product.name,
        productImage: product.image1,
        productPrice: product.price,
        discountedPrice: product.discounted_price || null,
        sizeName: selectedSizeData.size,
        quantity: quantity, // Use the quantity from state
        maxQuantity: selectedSizeData.quantity,
      });

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Item added to cart successfully!",
        type: "success",
      });
      setIsAddingToCart(false);
      return;
    }

    try {
      // First try to get cart
      const cartResponse = await fetch(`${baseURL}/api/v1/cart/`, {
        method: "GET",
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      let cartUuid;

      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        cartUuid = cartData.results[0]?.id;
      }

      // If no cart exists, create one
      if (!cartUuid) {
        try {
          cartUuid = await createNewCart(accessToken);
        } catch (error) {
          console.error("Error creating cart:", error);
          setModalConfig({
            isOpen: true,
            title: "Error",
            message: "Failed to create cart",
            type: "error",
          });
          setIsAddingToCart(false);
          return;
        }
      }

      // Add item to cart with selected quantity
      const response = await fetch(
        `${baseURL}/api/v1/cart/${cartUuid}/items/`,
        {
          method: "POST",
          headers: {
            Authorization: `JWT ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product: product.id,
            size: selectedSizeData.id,
            quantity: quantity, // Use the quantity from state
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding to cart:", errorData);
        setModalConfig({
          isOpen: true,
          title: "Notice",
          message: errorData.error || "Failed to add item to cart",
          type: "error",
        });
        setIsAddingToCart(false);
        return;
      }

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Item added to cart successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to add item to cart 2",
        type: "error",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Add modal close handler
  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  if (!id || isNaN(productId)) {
    return <div className="text-center py-8">Product ID not provided</div>;
  }

  if (isLoading)
    return <div className="text-center py-8 mt-[10%]">Loading product...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );
  if (!product)
    return <div className="text-center py-8">Product not found</div>;

  // Images array - filter out falsy values for better type safety
  const images = [product.image1, product.image2, product.image3].filter(
    Boolean
  );

  // Calculate discount percentage

  const discountedPrice = product.price;
  const undiscountedPrice = product.undiscounted_price || product.price;
  const discountPercentage =
    undiscountedPrice > 0
      ? Math.round(
          ((undiscountedPrice - discountedPrice) / undiscountedPrice) * 100
        )
      : 0;

  // Get available quantity for selected size
  const selectedSizeData = product.sizes.find(
    (size) => size.size === selectedSize
  );
  const availableQuantity = selectedSizeData?.quantity || 0;
  const availableSizePrice = selectedSizeData?.price || 0;

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

  // State to track items in cart
  const [itemsInCart, setItemsInCart] = useState<{[key: string]: boolean}>({});

  // Check if items are in cart when component mounts or when product/selectedSize changes
  useEffect(() => {
    const checkCartItems = async () => {
      if (product && selectedSize) {
        const selectedSizeData = product.sizes.find(size => size.size === selectedSize);
        if (selectedSizeData) {
          const key = `${product.id}-${selectedSizeData.id}`;
          const isInCart = await isItemInUserCart(product.id, selectedSizeData.id);
          setItemsInCart(prev => ({ ...prev, [key]: isInCart }));
        }
      }
    };
    
    checkCartItems();
  }, [product, selectedSize]);

  const isSizeInCart = (productId: number, sizeId: number): boolean => {
    const key = `${productId}-${sizeId}`;
    const accessToken = localStorage.getItem("accessToken");
    
    // For guest users, check local storage directly
    if (!accessToken) {
      return isItemInLocalCart(productId, sizeId);
    }
    
    // For authenticated users, use the cached result from state
    return itemsInCart[key] || false;
  };

  return (
    <div>
      <div className="w-full min-h-screen md:mt-8 px-6 md:px-12 py-4 lg:px-20">
        {/* Success/Error Modal */}
        {modalConfig.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border-t-4 ${
                modalConfig.type === "success"
                  ? "border-customBlue"
                  : "border-red-500"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-4 ${
                  modalConfig.type === "success"
                    ? "text-customBlue"
                    : "text-red-600"
                }`}
              >
                {modalConfig.title}
              </h2>
              <p className="mb-6">{modalConfig.message}</p>
              <button
                onClick={handleCloseModal}
                className={`w-full py-2 px-4 text-white rounded ${
                  modalConfig.type === "success"
                    ? "bg-customBlue hover:bg-blue-700"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {modalConfig.type === "success" ? "Continue" : "Close"}
              </button>
            </div>
          </div>
        )}

        {/* Product Main Section */}
        <div className="flex flex-col lg:flex-row justify-center items-start gap-8">
          {/* Thumbnail Images (Left Column) */}
          <div className="flex mx-auto md:flex-col gap-5 order-1">
            {images.map((img, index) => (
              <div
                key={index}
                className={`bg-gray-200 p-2 rounded-lg cursor-pointer hover:opacity-90 ${
                  mainImage === img ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setMainImage(img)}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/100";
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
                className="w-[500px] h-[500px] aspect-square object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/500";
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
                {product.unlimited
                  ? "Unlimited stock"
                  : `${availableQuantity} left in stock`}
              </span>

              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <span className="text-xl md:text-3xl font-normal">
                  ₦ {selectedSizeData?.price}
                </span>
                <div className="flex space-x-2">
                  {product?.undiscounted_price > product.price && (
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
              <p className="text-gray-700 text-medium font-semibold leading-relaxed">
                {" "}
                Production Days : {product.production_days}{" "}
              </p>

              <div className="space-y-1">
                <p className="text-gray-600 text-sm sm:text-base">Color</p>
                <p className="text-gray-900 font-bold capitalize">
                  {product.colour}
                </p>
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <p className="text-gray-600 text-sm sm:text-base">Size</p>
                <div className="grid grid-cols-4 gap-2">
                  {isLoading ? (
                    <div className="col-span-4 text-center py-2">
                      Loading sizes...
                    </div>
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
                            ? "bg-customBlue text-white border-customBlue" // Selected state
                            : !product.unlimited && item.quantity <= 0
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300 border-gray-300 cursor-pointer"
                        }`}
                        title={
                          !product.unlimited && item.quantity <= 0
                            ? "Out of stock"
                            : ""
                        }
                      >
                        {item.size.toUpperCase()}
                        {!product.unlimited && item.quantity <= 0 && (
                          <span className="block text-xs text-red-500">
                            (Sold out)
                          </span>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="col-span-4 text-center py-2 text-red-500">
                      No sizes available
                    </div>
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
                onClick={handleAddToCart}
                className={`w-full py-3 text-white rounded-2xl transition-colors cursor-pointer ${
                  !isInStock || isAddingToCart || (selectedSizeData && isSizeInCart(product.id, selectedSizeData.id))
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-customBlue hover:brightness-90"
                }`}
                type="button"
                disabled={!isInStock || isAddingToCart || (selectedSizeData && isSizeInCart(product.id, selectedSizeData.id))}
              >
                {isAddingToCart
                  ? "Adding..."
                  : !isInStock
                  ? "Out of Stock"
                  : selectedSizeData && isSizeInCart(product.id, selectedSizeData.id)
                  ? "Already in Cart"
                  : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-12 flex flex-col  md:flex-row  space-y-6">
          <div className="md:w-[60%] w-full gap-5 space-y-3">
            <h2 className="text-xl sm:text-2xl font-medium">Description</h2>
            <p
              className={`text-gray-700 text-sm sm:text-base ${
                !isDescriptionExpanded ? "max-md:line-clamp-5" : ""
              }`}
            >
              {product.description}
            </p>
            <button
              className="md:hidden text-blue-800 text-sm sm:text-base cursor-pointer"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              {isDescriptionExpanded ? "view less" : "view more"}
            </button>
          </div>
          <div className="md:w-[30%] mx-auto w-full flex justify-center items-center">
            <DescriptionList
              details={{
                Category: product.sub_category?.category?.name || "N/A",
                Subcategory: product.sub_category?.name || 'N/A',
                Weight: product.weight || 'N/A',
                Color: product.colour || 'N/A',
              }}
            />
          </div>
          {/* Conditional rendering for Suggested or SuggestedProductDetails */}
        </div>
      </div>
      <div className="px-0 md:px-12 ">
        <Suggested />
      </div>
    </div>
  );
};

export default ProductDetail;
