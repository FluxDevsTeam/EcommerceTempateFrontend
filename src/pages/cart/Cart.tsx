import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTrash2 } from "react-icons/fi";
import Suggested from "@/components/products/Suggested";

interface Product {
  id: number;
  name: string;
  image1: string;
  discounted_price: string;
  price: string;
}

interface Size {
  id: number;
  size: string; // e.g., "sm", "md"
  quantity: number; // Stock quantity for this size
}

// Interface for an individual item in the cart
interface CartItem {
  id: number; // This is the Cart Item ID
  product: Product;
  size: Size;
  quantity: number; // Quantity of this item in the cart
}

// Interface for the main Cart object within the results array
interface CartData {
  id: string; // Cart ID (UUID)
  user: number;
  cart_items: CartItem[];
  total: number;
}

interface CartApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CartData[];
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartUid, setCartUid] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseURL = `https://ecommercetemplate.pythonanywhere.com/`

  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true);
      setError(null);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("No access token found. User might not be logged in.");
        setCartItems([]);
        setIsLoading(false);
        setError("User not logged in.");
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
          setError(`Failed to load cart: ${response.statusText}`);
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
             console.warn("Cart items array not found in response:", data.results[0]);
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
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred while fetching cart."
        );
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const updateItemQuantityAPI = async (cartItemId: number, newQuantity: number) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No access token found for API call.");
      setError("Authentication error. Please log in again.");
      // return false;
    }
    if (!cartUid) {
      console.error("Cart UID not available for API call.");
      setError("Cart information missing. Cannot update item.");
      // return false;
    }

    try {
      const response = await fetch(`${baseURL}/api/v1/cart/${cartUid}/items/${cartItemId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `JWT ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`API Error (${response.status}) updating item ${cartItemId}:`, errorBody);
        setError(`Failed to update quantity: ${response.statusText}.`);
        return false; // Indicate failure
      }

      // console.log(`Successfully updated item ${cartItemId} quantity to ${newQuantity} via API.`);
      return true;

    } catch (error) {
      console.error("Network error updating item quantity:", error);
      setError("Network error updating cart. Please check your connection.");
      return false;
    }
  };

  const increaseQuantity = async (cartItemId: number) => {
    const itemIndex = cartItems.findIndex(item => item.id === cartItemId);
    if (itemIndex === -1) return;

    const currentItem = cartItems[itemIndex];
    const newQuantity = currentItem.quantity + 1;

    const originalItems = [...cartItems];

    // 1. Optimistic UI Update
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // 2. Call API
    const success = await updateItemQuantityAPI(cartItemId, newQuantity);

    // 3. Revert UI if API call failed
    if (!success) {
      setError(prevError => prevError || "Failed to save quantity change."); // Keep existing error if already set
      setCartItems(originalItems); 
    } else {
        setError(null);
    }
  };


  const decreaseQuantity = async (cartItemId: number) => {
    const itemIndex = cartItems.findIndex(item => item.id === cartItemId);
    // Don't decrease if item not found or quantity is already 1
    if (itemIndex === -1 || cartItems[itemIndex].quantity <= 1) return;

    const currentItem = cartItems[itemIndex];
    const newQuantity = currentItem.quantity - 1;

    const originalItems = [...cartItems];

    // 1. Optimistic UI Update
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // 2. Call API
    const success = await updateItemQuantityAPI(cartItemId, newQuantity);

    // 3. Revert UI if API call failed
    if (!success) {
      setError(prevError => prevError || "Failed to save quantity change."); // Keep existing error
      setCartItems(originalItems);
    } else {
        setError(null);
    }
  };

  const removeItem = (cartItemId: number) => {
    setCartItems(cartItems.filter((item: CartItem) => item.id !== cartItemId));
  };

  const subtotal = cartItems.reduce(
    (total: number, item: CartItem) =>
      total + Number(item.product.price) * item.quantity,
    0
  );

  const discountPercentage = 10;
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const total = subtotal - discountAmount;

  

  return (
    <div>
    <div className="max-w-6xl mx-auto px-4 py-6 font-poppins">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span>Cart</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Your cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          {cartItems.map((item: CartItem) => (
            <div
              key={item.id} // Use cart item ID
              className="border border-gray-200 rounded-lg p-4 mb-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-24 h-24 bg-gray-100 rounded-lg p-2 mr-4 flex-shrink-0">
                  {/* --- Update the src attribute here --- */}
                  <img
                    src={item.product.image1}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                  />
                </div>
                <div>
                  {/* Use data from item.product and item.size */}
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">
                    Size: {item.size.size}
                  </p>
                  <p className="font-bold mt-1">
                    ${Number(item.product.price).toFixed(2)}
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
                <div className="flex items-center">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded"
                    disabled={item.quantity <= 1}
                  >
                    <span>−</span>
                  </button>
                  <span className="mx-3 w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded"
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
            <h2 className="text-xl font-bold mb-6">Order</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                {/* Display calculated subtotal */}
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-red-500">
                <span>Discount (-{discountPercentage}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/confirm-order">
                <button className="w-full bg-black text-white py-3 px-6 rounded-full mt-4 flex items-center justify-center gap-2">
                  Go to Checkout
                  <FiArrowRight size={20}/>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* You might also like section */}
      <div className="mt-16 px-o md-px-4">
        <Suggested/>
      </div></div>
    </div>
  );
};

export default Cart;
