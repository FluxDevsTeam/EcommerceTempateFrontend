import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiTrash2 } from "react-icons/fi";
import {
  getLocalCart,
  updateLocalCartItemQuantity,
  removeLocalCartItem,
} from "../../utils/cartStorage";
import Suggested from "../../components/products/Suggested";

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

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartUid, setCartUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const baseURL = `http://kidsdesignecommerce.pythonanywhere.com`;

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        // Load cart from local storage for guest users
        const localCart = getLocalCart();

        const formattedCart = localCart.map((item) => {
          // Determine the best undiscounted price for the size
          let undiscountedPriceForSize: number;
          if (item.sizeUndiscountedPrice !== undefined && item.sizeUndiscountedPrice !== null) {
            undiscountedPriceForSize = Number(item.sizeUndiscountedPrice);
          } else if (item.discountedPrice !== undefined && item.discountedPrice !== null && item.productPrice < item.discountedPrice) {
            // This case assumes item.discountedPrice was actually the original price before a product-level discount
            undiscountedPriceForSize = Number(item.discountedPrice);
          } else {
            undiscountedPriceForSize = Number(item.productPrice);
          }

          return {
            id: parseInt(`${item.productId}${item.sizeId}`), 
            product: {
              id: item.productId,
              name: item.productName,
              image1: item.productImage,
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
              undiscounted_price: undiscountedPriceForSize, // Use the determined undiscounted price for the size
              price: String(item.productPrice), 
            },
            quantity: item.quantity, 
          };
        });
        setCartItems(formattedCart as CartItem[]);
        setIsLoading(false);
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
      } finally {
        setIsLoading(false); // Set loading false after API call completes
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

    // Store original cart items for potential rollback
    const originalItems = [...cartItems];

    // Optimistic UI update - remove item immediately
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));

    if (!accessToken) {
      // For guest users, find the item in original items
      const itemToRemove = originalItems.find((item) => item.id === cartItemId);
      if (itemToRemove) {
        // Extract the real productId and sizeId from the cartItem
        const productId = itemToRemove.product.id;
        const sizeId = itemToRemove.size.id;

        // Remove from local storage
        removeLocalCartItem(productId, sizeId);
      }
      return;
    }

    // Rest of the authenticated user logic
    if (!cartUid) {
      console.error("Cart UID not available for API call.");
      setCartItems(originalItems); // Rollback on error
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

      // API call successful, UI is already updated
    } catch (error) {
      console.error("Failed to delete cart item:", error);
      // Rollback UI on error
      setCartItems(originalItems);
    }
  };

  const subtotal = cartItems.reduce((total: number, item: CartItem) => {
    const itemPrice = Number(item.size.price);
    return total + itemPrice * item.quantity;
  }, 0);

  const undiscountedTotal = cartItems.reduce(
    (total: number, item: CartItem) => {
      // For guest cart items, item.size.undiscounted_price is now populated correctly.
      // For API items, it comes directly.
      const originalPrice = Number(item.size.undiscounted_price);
      const currentPrice = Number(item.size.price);
      // Ensure we use the actual original price for the sum if it's greater than current price
      return (
        total +
        (originalPrice > currentPrice ? originalPrice : currentPrice) *
          item.quantity
      );
    },
    0
  );

  const totalSavings = undiscountedTotal - subtotal;
  const discountPercentage =
    Math.round((totalSavings / undiscountedTotal) * 100) || 0;
  const total = subtotal;

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-6 font-poppins">
        <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="relative flex flex-col items-center gap-2">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-customBlue rounded-full animate-spin"></div>
              <span className="text-lg text-gray-500 mt-2">
                Loading cart...
              </span>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-medium text-gray-600 mb-4">
              No Items In Cart
            </h2>
            <Link
              to="/products"
              className="inline-block bg-customBlue text-white py-3 px-8 rounded-full hover:bg-gray-800 transition-colors"
            >
              Continue Browsing Our Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 mb-9">
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
                      onClick={() =>
                        navigate(`/product/item/${item.product.id}`)
                      }
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
                      <h3 className="font-semibold line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Size: {item.size.size.toUpperCase()}
                      </p>
                      <div className="mt-1">
                        {item.size.undiscounted_price &&
                        Number(item.size.undiscounted_price) >
                          Number(item.size.price) ? (
                          <div className="">
                            <span className="line-through text-gray-500">
                              ₦{" "}
                              {formatPrice(
                                Number(item.size.undiscounted_price)
                              )}
                            </span>{" "}
                            <br />
                            <span className="font-bold text-green-600">
                              ₦ {formatPrice(Number(item.size.price))}
                            </span>{" "}
                            <br className="md:hidden" />
                            <span className="text-xs text-green-600">
                              (
                              {Math.round(
                                (1 -
                                  Number(item.size.price) /
                                    Number(item.size.undiscounted_price)) *
                                  100
                              )}
                              % off)
                            </span>
                          </div>
                        ) : (
                          <p className="font-bold">
                            ₦ {formatPrice(Number(item.size.price || 0))}
                          </p>
                        )}
                      </div>
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
                        className={`w-8 h-8 border border-gray-300 flex items-center justify-center rounded ${
                          item.quantity <= 1 ? "cursor-not-allowed" : " "
                        }`}
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
                      ₦ {formatPrice(undiscountedTotal)}
                    </span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Total Savings ({discountPercentage}% off)</span>
                      <span>-₦ {formatPrice(totalSavings)}</span>
                    </div>
                  )}

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="font-bold">Final Price</span>
                      <span className="font-bold">₦ {formatPrice(total)}</span>
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
                    <button className="w-full bg-customBlue text-white py-3 px-6 rounded-full mt-4 flex items-center justify-center gap-2">
                      Go To Checkout
                      <FiArrowRight size={20} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <Suggested />
      </div>
    </div>
  );
};

export default Cart;
