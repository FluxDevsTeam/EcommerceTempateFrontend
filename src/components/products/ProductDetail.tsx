import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Suggested from "./Suggested";
import { addToLocalCart } from "../../utils/cartStorage";

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
  discounted_price: string;
  price: string;
  is_available: boolean;
  dimensional_size: string;
  weight: string;
}

interface ProductSize {
  id: number;
  product: {
    id: number;
    name: string;
    image1: string;
    discounted_price: string;
    price: string;
  };
  size: string;
  quantity: number;
}

interface ProductSizesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductSize[];
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

const fetchSizes = async (productId: number): Promise<ProductSize[]> => {
  const response = await fetch(
    `https://ecommercetemplate.pythonanywhere.com/api/v1/product/size/?product=${productId}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: ProductSizesResponse = await response.json();
  return data.results;
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

  // Fetch sizes for this specific product
  const { data: productSizes, isLoading: sizesLoading } = useQuery<
    ProductSize[],
    Error
  >({
    queryKey: ["productSizes", productId],
    queryFn: () => fetchSizes(productId),
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
      if (productSizes && productSizes.length > 0 && !selectedSize) {
        setSelectedSize(productSizes[0].size);
      }
    }
  }, [product, productSizes, mainImage, selectedSize]);

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

    if (!product) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Product data not available",
        type: "error",
      });
      return;
    }

    const selectedSizeData = productSizes?.find(
      (size) => size.size === selectedSize
    );

    if (!selectedSizeData) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Selected size not found",
        type: "error",
      });
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      // Store in local storage for guest users
      addToLocalCart({
        productId: product.id,
        sizeId: selectedSizeData.id,
        productName: product.name,
        productImage: product.image1,
        productPrice: product.price,
        discountedPrice: product.discounted_price,
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
      return;
    }

    try {
      // First get or create cart
      const cartResponse = await fetch(`${baseURL}/api/v1/cart/`, {
        method: "GET",
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!cartResponse.ok) throw new Error("Failed to get cart");

      const cartData = await cartResponse.json();
      const cartUuid = cartData.results[0]?.id;

      if (!cartUuid) throw new Error("No cart UUID found");

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
          title: "Error",
          message: errorData.error || "Failed to add item to cart",
          type: "error",
        });
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
        message: "Failed to add item to cart",
        type: "error",
      });
    }
  };

  // Add modal close handler
  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  if (!id) {
    return <div className="text-center py-8">Product ID not provided</div>;
  }

  if (isLoading)
    return <div className="text-center py-8">Loading product...</div>;
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
  const price = parseFloat(product.price);
  const discountedPrice = parseFloat(product.discounted_price);
  const discountPercentage =
    price > 0 ? Math.round(((price - discountedPrice) / price) * 100) : 0;

  // Get available quantity for selected size
  const selectedSizeData = productSizes?.find(
    (size) => size.size === selectedSize
  );
  const availableQuantity = selectedSizeData?.quantity || 0;

  // Handle quantity changes
  const handleQuantityIncrease = () => {
    if (quantity < availableQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="w-full min-h-screen md:mt-8 px-6 md:px-12 py-4 lg:px-20">
      {/* Success/Error Modal */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border-t-4 ${
              modalConfig.type === "success"
                ? "border-green-500"
                : "border-red-500"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${
                modalConfig.type === "success"
                  ? "text-green-600"
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
                  ? "bg-green-600 hover:bg-green-700"
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
              className="w-[500px] h-[500px] aspect-square object-cover"
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
              {availableQuantity} left in stock
            </span>

            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <span className="text-xl md:text-3xl font-normal">
                {" "}
                ₦ {product.discounted_price}
              </span>
              <div className="flex space-x-2">
                <span className="text-gray-500 line-through text-3xl">
                  {" "}
                  ₦ {product.price}
                </span>
                {discountPercentage > 0 && (
                  <span className="bg-red-200 text-[#FF3333] p-3 rounded-full text-sm">
                    {discountPercentage}% off
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-700 text-base leading-relaxed">
              {product.description}
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
                {sizesLoading ? (
                  <div className="col-span-4 text-center py-2">
                    Loading sizes...
                  </div>
                ) : productSizes && productSizes.length > 0 ? (
                  productSizes.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => {
                        setSelectedSize(item.size);
                        setQuantity(1); // Reset quantity when size changes
                      }}
                      disabled={item.quantity <= 0}
                      className={`p-3 text-sm sm:text-base border rounded-2xl transition-colors ${
                        item.size === selectedSize
                          ? "bg-black text-white border-black"
                          : item.quantity <= 0
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-gray-200 hover:bg-gray-300 border-gray-300 cursor-pointer"
                      }`}
                      title={item.quantity <= 0 ? "Out of stock" : ""}
                    >
                      {item.size.toUpperCase()}
                      {item.quantity <= 0 && (
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
                disabled={quantity >= availableQuantity}
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              disabled={availableQuantity <= 0}
            >
              {availableQuantity <= 0 ? "Out of Stock" : "Add to Cart"}
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
            Category: product.sub_category.category.name,
            Subcategory: product.sub_category.name,
            Weight: product.weight,
            Size: product.dimensional_size,
            Color: product.colour,
          }}
        />

        {/* Conditional rendering for Suggested or SuggestedProductDetails */}
        <Suggested />
      </div>
    </div>
  );
};

export default ProductDetail;
