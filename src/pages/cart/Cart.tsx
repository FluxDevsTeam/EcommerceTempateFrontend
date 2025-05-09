import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiTrash2 } from "react-icons/fi";
import {
  getLocalCart,
  updateLocalCartItemQuantity,
  removeLocalCartItem,
} from "../../utils/cartStorage";
import Suggested from "../../components/products/Suggested";
// Update the interfaces to match API response
interface Product {
  id: number;
  name: string;
  image1: string;
  sub_category: {
    id: number;
    name: string;
  };
}

interface Size {
  id: number;
  size: string;
  quantity: number;
  undiscounted_price: number | null;
  price: string;
}

interface CartItem {
  id: number;
  product: Product;
  cart: {
    id: string;
    user: number;
  };
  size: Size;
  quantity: number;
}

interface CartData {
  id: string;
  user: number;
  first_name: string;
  last_name: string;
  email: string;
  state: string;
  city: string;
  delivery_address: string;
  phone_number: string;
  estimated_delivery: string;
  cart_items: CartItem[];
  total: number;
}

// Update the CartApiResponse interface
interface CartApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CartData[];
}

// Add new interface for suggested products
interface SuggestedProduct {
  id: number;
  name: string;
  description: string;
  image1: string;
  price: string;
  discounted_price: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartUid, setCartUid] = useState<string | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<
    SuggestedProduct[]
  >([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const baseURL = `https://ecommercetemplate.pythonanywhere.com`;

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    const fetchCartData = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        // Load cart from local storage for guest users
        const localCart = getLocalCart();

        const formattedCart = localCart.map((item) => ({
          id: parseInt(`${item.productId}${item.sizeId}`),
          product: {
            id: item.productId,
            name: item.productName,
            image1: item.productImage,
            price: item.productPrice,
            discounted_price: item.discountedPrice,
            sub_category: {
              id: 0,
              name: "",
            },
          },
          cart: {
            id: "guest-cart",
            user: 0,
          },
          size: {
            id: item.sizeId,
            size: item.sizeName,
            quantity: item.maxQuantity,
            undiscounted_price: null,
            price: item.productPrice,
          },
          quantity: item.quantity,
        }));
        setCartItems(formattedCart);
        return;
      }

      try {
        const response = await fetch(`${baseURL}/api/v1/cart/`, {
          method: "GET",
          headers: {
            Authorization: `JWT ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          let errorBody;
          try {
            errorBody = await response.json();
          } catch (e) {
            errorBody = await response.text();
          }
          console.error(
            `HTTP error! status: ${response.status}, body:`,
            errorBody
          );
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Type the fetched data
        const data: CartApiResponse = await response.json();
        console.log("Cart data fetched:", data);

        // --- Correctly update state with the array of cart items ---
        if (
          data &&
          data.results &&
          data.results.length > 0 &&
          Array.isArray(data.results[0].cart_items)
        ) {
          setCartUid(data.results[0].id);

          if (Array.isArray(data.results[0].cart_items)) {
            setCartItems(data.results[0].cart_items);
          } else {
            console.warn(
              "Cart items array not found in response:",
              data.results[0]
            );
            setCartItems([]);
          }
        } else {
          console.warn(
            "Received unexpected data format or empty cart from API:",
            data
          );
          setCartItems([]);
        }
        // -------------------------------------------------
      } catch (err) {
        console.error("Failed to fetch cart data:", err);
        setCartItems([]);
      }
    };

    fetchCartData();
  }, []);

  // Update the helper functions to handle numeric IDs
  const updateItemQuantityAPI = async (
    cartItemId: number, // Change type to number
    newQuantity: number
  ) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      // Extract productId and sizeId from the composite numeric ID
      const idString = cartItemId.toString();
      const productId = parseInt(idString.slice(0, -1));
      const sizeId = parseInt(idString.slice(-1));
      updateLocalCartItemQuantity(productId, sizeId, newQuantity);
      return true;
    }

    if (!cartUid) {
      console.error("Cart UID not available for API call.");
      return false;
    }

    try {
      const response = await fetch(
        `${baseURL}/api/v1/cart/${cartUid}/items/${cartItemId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `JWT ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          `API Error (${response.status}) updating item ${cartItemId}:`,
          errorBody
        );
        return false; // Indicate failure
      }

      return true;
    } catch (error) {
      console.error("Network error updating item quantity:", error);
      return false;
    }
  };

  const increaseQuantity = async (cartItemId: number) => {
    const itemIndex = cartItems.findIndex((item) => item.id === cartItemId);
    if (itemIndex === -1) return;

    const currentItem = cartItems[itemIndex];
    const newQuantity = currentItem.quantity + 1;

    const originalItems = [...cartItems];

    // 1. Optimistic UI Update
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // 2. Call API
    const success = await updateItemQuantityAPI(cartItemId, newQuantity);

    // 3. Revert UI if API call failed
    if (!success) {
      setCartItems(originalItems);
    }
  };

  const decreaseQuantity = async (cartItemId: number) => {
    const itemIndex = cartItems.findIndex((item) => item.id === cartItemId);
    // Don't decrease if item not found or quantity is already 1
    if (itemIndex === -1 || cartItems[itemIndex].quantity <= 1) return;

    const currentItem = cartItems[itemIndex];
    const newQuantity = currentItem.quantity - 1;

    const originalItems = [...cartItems];

    // 1. Optimistic UI Update
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // 2. Call API
    const success = await updateItemQuantityAPI(cartItemId, newQuantity);

    // 3. Revert UI if API call failed
    if (!success) {
      setCartItems(originalItems);
    }
  };

  const removeItem = async (cartItemId: number) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      // Handle local storage deletion
      const idString = cartItemId.toString();
      const productId = parseInt(idString.slice(0, -1));
      const sizeId = parseInt(idString.slice(-1));
      removeLocalCartItem(productId, sizeId);
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      return;
    }

    if (!cartUid) {
      console.error("Cart UID not available for API call.");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}/api/v1/cart/${cartUid}/items/${cartItemId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `JWT ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
  };

  const subtotal = cartItems.reduce((total: number, item: CartItem) => {
    const itemPrice = Number(item.size.price);
    return total + itemPrice * item.quantity;
  }, 0);

  const undiscountedTotal = cartItems.reduce((total: number, item: CartItem) => {
    const undiscountedPrice = item.size.undiscounted_price || Number(item.size.price);
    return total + undiscountedPrice * item.quantity;
  }, 0);

  // Calculate total savings from product discounts
  const totalSavings = undiscountedTotal - subtotal;
  const discountPercentage = Math.round((totalSavings / undiscountedTotal) * 100) || 0;
  const total = subtotal;
  
  // Update the getMostCommonSubcategoryIds function with proper checks
  // const getMostCommonSubcategoryIds = (cartItems: CartItem[]) => {
  //   // Count occurrences of each subcategory ID
  //   const subcategoryCounts = cartItems.reduce<{ [key: number]: number }>(
  //     (acc, item) => {
  //       // Skip items without valid sub_category
  //       if (!item.product?.sub_category?.id) {
  //         return acc;
  //       }
  //       const subCategoryId = item.product.sub_category.id;
  //       acc[subCategoryId] = (acc[subCategoryId] || 0) + 1;
  //       return acc;
  //     },
  //     {}
  //   );

  //   // Convert to array of [id, count] pairs and sort by count in descending order
  //   const sortedSubcategories = Object.entries(subcategoryCounts)
  //     .map(([id, count]) => ({ id: Number(id), count }))
  //     .sort((a, b) => {
  //       // First sort by count in descending order
  //       if (b.count !== a.count) {
  //         return b.count - a.count;
  //       }
  //       // If counts are equal, sort by ID to ensure consistent results
  //       return a.id - b.id;
  //     });

  //   // Return the top two subcategory IDs, or empty array if none found
  //   return sortedSubcategories.slice(0, 2).map((item) => item.id);
  // };

  // Function to fetch suggested products
  // const fetchSuggestedProducts = async () => {
  //   setSuggestionsLoading(true);
  //   const accessToken = localStorage.getItem("accessToken");

  //   try {
  //     let url = `${baseURL}/api/v1/product/item/suggestions/`;

  //     if (cartItems.length > 0) {
  //       const topSubcategoryIds = getMostCommonSubcategoryIds(cartItems);

  //       if (topSubcategoryIds.length === 1) {
  //         url += `?sub_category_id=${topSubcategoryIds[0]}`;
  //       } else if (topSubcategoryIds.length === 2) {
  //         url += `?sub_category_id=${topSubcategoryIds[0]}&second_sub_category_id=${topSubcategoryIds[1]}`;
  //       }
  //     }

  //     const response = await fetch(url, {
  //       headers: {
  //         Authorization: `JWT ${accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     setSuggestedProducts(data.results);
  //   } catch (error) {
  //     console.error("Error fetching suggested products:", error);
  //   } finally {
  //     setSuggestionsLoading(false);
  //   }
  // };

  // Fetch suggested products when cart items change
  // useEffect(() => {
  //   fetchSuggestedProducts();
  // }, [cartItems]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-poppins">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span>Cart</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-medium text-gray-600 mb-4">
            No Items In Cart
          </h2>
          <Link
            to="/products"
            className="inline-block bg-black text-white py-3 px-8 rounded-full hover:bg-gray-800 transition-colors"
          >
            Continue Browsing Our Products
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            {cartItems.map((item: CartItem) => (
              <div
                key={item.id} // Use cart item ID
                className="border border-gray-200 rounded-lg p-4 mb-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div 
                    className="w-24 h-24 bg-gray-100 rounded-lg p-2 mr-4 flex-shrink-0 relative cursor-pointer"
                    onClick={() => navigate(`/product/item/${item.product.id}`)}
                  >
                    <div className="absolute top-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-tl-lg rounded-br-lg z-10">
                      {item.size.quantity
                        ? `${item.size.quantity} in stock`
                        : "Unlimited"}
                    </div>
                    <img
                      src={item.product.image1}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                      onError={(e) =>
                        (e.currentTarget.src = "/placeholder.jpg")
                      }
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold line-clamp-2">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      Size: {item.size.size.toUpperCase()}
                    </p>
                    <p className="font-bold mt-1">
                      ₦{" "}{formatPrice(Number(item.size.price || 0))}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 mb-12"
                    aria-label={`Remove ${item.product.name}`}
                  >
                    <FiTrash2 size={23} />
                  </button>
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className={`w-8 h-8 border border-gray-300 flex items-center justify-center rounded ${item.quantity <= 1 ? "cursor-not-allowed" : " "}`}
                      disabled={item.quantity <= 1}
                    >
                      <span>−</span>
                    </button>
                    <span className="">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      // Only disable if there's a quantity limit and we've reached it
                      disabled={
                        item.size.quantity
                          ? item.quantity >= item.size.quantity
                          : false
                      }
                    >
                      <span>+</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Original Price</span>
                  <span className="font-semibold line-through text-gray-500">
                    ₦{" "}{formatPrice(undiscountedTotal)}
                  </span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Total Savings ({discountPercentage}% off)</span>
                    <span>-₦{" "}{formatPrice(totalSavings)}</span>
                  </div>
                )}

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-bold">Final Price</span>
                    <span className="font-bold">₦{" "}{formatPrice(total)}</span>
                  </div>
                </div>

                <Link
                  to={
                    localStorage.getItem("accessToken")
                      ? "/confirm-order"
                      : "/login?redirect=/confirm-order"
                  }
                  className="w-full"
                >
                  <button className="w-full bg-black text-white py-3 px-6 rounded-full mt-4 flex items-center justify-center gap-2">
                    Go To Checkout
                    <FiArrowRight size={20} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* You might also like section */}
      {/* <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {suggestionsLoading
            ? // Loading skeleton
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 animate-pulse"
                  >
                    <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))
            : suggestedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-50 rounded-lg p-4 relative"
                >
                  <button className="absolute top-4 right-4 z-10">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        stroke="black"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                  </button>

                  <div className="h-40 bg-white rounded-lg mb-4 flex items-center justify-center">
                    <img
                      src={product.image1}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <h3 className="font-medium">{product.name}</h3>

                  <div className="flex items-center mt-2">
                    <span className="font-bold">
                      $
                      {Number(product.discounted_price) > 0
                        ? (
                            Number(product.price) -
                            Number(product.discounted_price)
                          ).toFixed(2)
                        : Number(product.price).toFixed(2)}
                    </span>
                    {Number(product.discounted_price) > 0 && (
                      <>
                        <span className="text-gray-400 line-through ml-2">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <span className="bg-red-100 text-red-500 text-xs px-2 py-1 ml-2 rounded">
                          -
                          {Math.round(
                            (Number(product.discounted_price) /
                              Number(product.price)) *
                              100
                          )}
                          %
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
        </div>
      </div> */}

      <Suggested />
    </div>
  );
};

export default Cart;
