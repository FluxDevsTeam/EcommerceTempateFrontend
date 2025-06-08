import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import Suggested from "./Suggested";
import {
  addToLocalCart,
  isItemInLocalCart,
  isItemInUserCart,
} from "../../utils/cartStorage";

import DescriptionList from "./DescriptionList";

const baseURL = "https://api.kidsdesigncompany.com";

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
    `https://api.kidsdesigncompany.com/api/v1/product/item/${id}/`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const ProductDetail = () => {
  const { id } = useParams<keyof ProductDetailParams>() as ProductDetailParams;
  const productId = parseInt(id);
  const navigate = useNavigate();

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
  const [itemsInCart, setItemsInCart] = useState<{ [key: string]: boolean }>(
    {}
  );

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
      // Set the first in-stock size as default if none selected
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        // Find first in-stock size
        const inStockSize = product.sizes.find(
          (size) => product.unlimited || size.quantity > 0
        );
        // If there's an in-stock size, select it, otherwise select the first size
        if (inStockSize) {
          setSelectedSize(inStockSize.size);
        } else {
          setSelectedSize(product.sizes[0].size);
        }
      }
    }
  }, [product, mainImage, selectedSize]);

  // Check if items are in cart when component mounts or when product/selectedSize changes
  useEffect(() => {
    const checkCartItems = async () => {
      if (product && selectedSize) {
        const selectedSizeData = product.sizes.find(
          (size) => size.size === selectedSize
        );
        if (selectedSizeData) {
          const key = `${product.id}-${selectedSizeData.id}`;
          const isInCart = await isItemInUserCart(
            product.id,
            selectedSizeData.id
          );
          setItemsInCart((prev) => ({ ...prev, [key]: isInCart }));
        }
      }
    };

    checkCartItems();
  }, [product, selectedSize]);

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

    // Use the component-scoped selectedSizeData (defined around line 334)
    // This variable is updated whenever 'selectedSize' or 'product' changes.
    if (!selectedSizeData) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message:
          "Selected size details not available. Please select a valid size.",
        type: "error",
      });
      return;
    }

    // If item is ALREADY in cart and button is clicked, navigate to cart.
    if (product && isSizeInCart(product.id, selectedSizeData.id)) {
      navigate("/cart");
      return;
    }

    // If item is NOT already in cart, then proceed with adding.
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

    // The selectedSizeData from component scope is used for adding.
    // No need to re-fetch/re-find it here if it's already up-to-date.

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      // Guest user: Add to local cart
      // The check for item already in local cart is covered by isSizeInCart -> navigate above.
      addToLocalCart({
        productId: product.id,
        sizeId: selectedSizeData.id,
        productName: product.name,
        productImage: product.image1,
        productPrice: parseFloat(selectedSizeData.price) || product.price, // Use size-specific price
        discountedPrice: product.discounted_price || null, // This is product-level discount, might not be size-specific
        sizeName: selectedSizeData.size,
        quantity: quantity,
        maxQuantity: selectedSizeData.quantity,
        sizeUndiscountedPrice: selectedSizeData.undiscounted_price
          ? parseFloat(selectedSizeData.undiscounted_price)
          : product.undiscounted_price ||
            parseFloat(selectedSizeData.price) ||
            product.price, // Pass size-specific undiscounted price
        subCategoryId: product.sub_category?.id,
        subCategoryName: product.sub_category?.name,
      });

      const key = `${product.id}-${selectedSizeData.id}`;
      setItemsInCart((prev) => ({ ...prev, [key]: true }));

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Item added to cart successfully!",
        type: "success",
      });
      setIsAddingToCart(false);
      return;
    }

    // Authenticated user: Add to server cart
    try {
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

      if (!cartUuid) {
        try {
          cartUuid = await createNewCart(accessToken);
        } catch (error) {
          setModalConfig({
            isOpen: true,
            title: "Error",
            message: "Failed to create cart. Please try again.",
            type: "error",
          });
          setIsAddingToCart(false);
          return;
        }
      }

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
            quantity: quantity,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        setModalConfig({
          isOpen: true,
          title: "Notice",
          message:
            errorData.error || "Failed to add item to cart. Please try again.",
          type: "error",
        });
        setIsAddingToCart(false);
        return;
      }

      const key = `${product.id}-${selectedSizeData.id}`;
      setItemsInCart((prev) => ({ ...prev, [key]: true }));

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Item added to cart successfully!",
        type: "success",
      });
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "An unexpected error occurred. Please try again.",
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

  // Add useEffect for auto-closing modal
  useEffect(() => {
    if (modalConfig.isOpen) {
      const timer = setTimeout(() => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [modalConfig.isOpen]);

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
      <div className="w-full min-h-screen md:mt-6 px-4 pl-6 md:px-8 py-0 lg:px-12">
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
            </div>
          </div>
        )}

        {/* Product Main Section */}
        <div className="flex flex-col lg:flex-row lg-pt-0 justify-center items-start gap-6">
          {/* Thumbnail Images (Left Column) */}
          <div className="flex sm:mt-3 mx-auto lg:my-auto md:flex-col gap-3 order-1">
            {images.map((img, index) => (
              <div
                key={index}
                className={`bg-gray-100 p-1.5 rounded-md cursor-pointer hover:opacity-90 ${
                  mainImage === img ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setMainImage(img)}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/100";
                  }}
                />
              </div>
            ))}
          </div>

          {/* Main Product Image (Middle Column) */}
          <div className="rounded-lg lg:mt-2 mt-12 max-w-sm lg:max-w-md mx-auto lg:order-2 h-[350px] md:h-[450px] flex items-center justify-center">
            {mainImage && (
              <img
                src={mainImage}
                alt="Main Product"
                className="w-full h-full object-contain rounded-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/500";
                }}
              />
            )}
          </div>

          {/* Product Info (Right Column) */}
          <div className="flex-1 max-w-lg order-2 lg:order-3">
            <div className="space-y-2 sm:space-y-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl uppercase font-medium leading-tight">
                {product.name}
              </h1>

              <span className="inline-block bg-blue-100 text-blue-800 text-xs md:text-sm rounded-xl p-1.5">
                {product.unlimited
                  ? "Unlimited stock"
                  : `${availableQuantity} left in stock`}
              </span>

              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="text-lg md:text-2xl font-normal">
                  ₦ {selectedSizeData?.price}
                </span>
                <div className="flex space-x-1.5 items-center">
                  {undiscountedPrice > product.price && (
                    <span className="text-gray-500 line-through text-xl md:text-2xl">
                      ₦ {product.undiscounted_price}
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span className="bg-red-200 text-[#FF3333] p-1.5 rounded-full text-xs">
                      {discountPercentage}% off
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                {product.description}
              </p>
              {product.production_days > 0 && (
                <p className="text-gray-700 text-medium font-semibold leading-relaxed">
                  Production Days : {product.production_days}
                </p>
              )}

              <div className="space-y-1">
                <p className="text-gray-600 text-sm sm:text-base">Color</p>
                <p className="text-gray-900 font-bold capitalize">
                  {product.colour}
                </p>
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <p className="text-gray-600 text-sm sm:text-base">Size</p>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                  {isLoading ? (
                    <div className="col-span-4 sm:col-span-5 text-center py-1.5">
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
                        disabled={
                          !product.unlimited &&
                          item.quantity <= 0 &&
                          !isSizeInCart(product.id, item.id)
                        }
                        className={`p-2 text-xs sm:text-sm border rounded-xl transition-colors ${
                          item.size === selectedSize
                            ? "bg-blue-200 text-blue-800 border-blue-300" // Selected: light blue background
                            : isSizeInCart(product.id, item.id)
                            ? "bg-green-100 text-green-800 border-green-300 cursor-pointer" // In cart: light green background
                            : !product.unlimited && item.quantity <= 0
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" // Disabled
                            : "bg-white text-blue-600 border-blue-300 hover:bg-gray-100 cursor-pointer" // Not selected: White background
                        }`}
                        title={
                          isSizeInCart(product.id, item.id)
                            ? "Item in Cart"
                            : !product.unlimited && item.quantity <= 0
                            ? "Out of stock"
                            : ""
                        }
                      >
                        {item.size.toUpperCase()}
                        {isSizeInCart(product.id, item.id) ? (
                          <span className="block text-xs text-green-600">
                            (In Cart)
                          </span>
                        ) : !product.unlimited && item.quantity <= 0 ? (
                          <span className="block text-xs text-red-500">
                            (Sold out)
                          </span>
                        ) : null}
                      </button>
                    ))
                  ) : (
                    <div className="col-span-4 sm:col-span-5 text-center py-1.5 text-red-500">
                      No sizes available
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <button
                  className="p-1.5 sm:p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleQuantityDecrease}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-base">{quantity}</span>
                <button
                  className="p-1.5 sm:p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleQuantityIncrease}
                  disabled={!product.unlimited && quantity >= availableQuantity}
                >
                  +
                </button>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-2.5 px-3 text-white rounded-xl transition-colors cursor-pointer ${
                    !isInStock || isAddingToCart
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-customBlue hover:brightness-90"
                  }`}
                  type="button"
                  disabled={!isInStock || isAddingToCart}
                >
                  {isAddingToCart
                    ? "Adding..."
                    : !isInStock
                    ? "Out of Stock"
                    : selectedSizeData &&
                      isSizeInCart(product.id, selectedSizeData.id)
                    ? "Item in Cart"
                    : "Add to Cart"}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-8 flex flex-col  md:flex-row  space-y-4">
          <div className="md:w-[60%] w-full gap-4 space-y-2.5">
            <h2 className="text-lg sm:text-xl font-medium">Description</h2>
            <p
              className={`product-description text-gray-700 text-xs sm:text-sm ${
                !isDescriptionExpanded ? "line-clamp-6" : ""
              }`}
            >
              {product.description}
            </p>
            {product.description.length > 300 && (
              <span
                className={` text-blue-800 text-xs cursor-pointer`}
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                {isDescriptionExpanded ? "view less" : "view full description"}
              </span>
            )}
          </div>
          <div className="md:w-[30%] mx-auto w-full flex justify-center items-center">
            <DescriptionList
              details={{
                Category: product.sub_category?.category?.name || "N/A",
                Subcategory: product.sub_category?.name || "N/A",
                // Weight: product.weight || 'N/A',
                Color: product.colour || "N/A",
              }}
            />
          </div>
          {/* Conditional rendering for Suggested or SuggestedProductDetails */}
        </div>
      </div>

      <div className="px-0 md:px-8 ">
        <Suggested
          subcategory_id={product.sub_category?.id | 0}
          excludeProductIds={[product.id]}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
