import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiTrash2 } from "react-icons/fi";
import {
  getLocalCart,
  updateLocalCartItemQuantity,
  removeLocalCartItem,
} from "@/utils/cartStorage";
import { formatCurrency } from "@/admin/utils/formatting";
import Suggested from "@/components/products/Suggested";

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

interface CartApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CartData[];
}

interface ProductDetails {
  id: number;
  name: string;
  image1: string;
  sub_category: {
    id: number;
    name: string;
  } | null;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartUid, setCartUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 16;

  const baseURL = "https://api.fluxdevs.com";

  const subCategoryParams = useMemo(() => {
    if (cartItems.length === 0) {
      
      return { subCategoryId: undefined, secondSubCategoryId: undefined, excludeProductIds: [] };
    }

    const subCategoryCounts: { [key: number]: number } = {};
    const subCategoryProducts: { [key: number]: string[] } = {};
    const productIds: number[] = [];

    cartItems.forEach((item) => {
      productIds.push(item.product.id);
      if (item.product.sub_category?.id && typeof item.product.sub_category.id === 'number' && item.product.sub_category.id > 0) {
        const subCatId = item.product.sub_category.id;
        subCategoryCounts[subCatId] = (subCategoryCounts[subCatId] || 0) + 1;
        if (!subCategoryProducts[subCatId]) {
          subCategoryProducts[subCatId] = [];
        }
        subCategoryProducts[subCatId].push(item.product.name);
      } else {
        
      }
    });

    
    for (const [subCatId, count] of Object.entries(subCategoryCounts)) {
      const subCatName = cartItems.find(
        (item) => item.product.sub_category?.id === Number(subCatId)
      )?.product.sub_category?.name || 'Unknown';
      
    }

    const sortedSubCategories = Object.entries(subCategoryCounts)
      .map(([id, count]) => ({ id: Number(id), count }))
      .sort((a, b) => b.count - a.count || a.id - b.id);

    const subCategoryId = sortedSubCategories[0]?.id && typeof sortedSubCategories[0].id === 'number' ? sortedSubCategories[0].id : undefined;
    const secondSubCategoryId = sortedSubCategories[1]?.id && typeof sortedSubCategories[1].id === 'number' ? sortedSubCategories[1].id : undefined;

    

    return { subCategoryId, secondSubCategoryId, excludeProductIds: productIds };
  }, [cartItems]);

  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true);
      setError(null);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        try {
          const localCart = getLocalCart();

          const formattedCart = localCart.map((item) => {
            let undiscountedPriceForSize: number;
            if (item.sizeUndiscountedPrice !== undefined && item.sizeUndiscountedPrice !== null) {
              undiscountedPriceForSize = Number(item.sizeUndiscountedPrice);
            } else if (item.discountedPrice !== undefined && item.discountedPrice !== null && item.productPrice < item.discountedPrice) {
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
                  id: item.subCategoryId || 0, // Update if subcategory data is available
                  name: item.subCategoryName || "",
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
                undiscounted_price: undiscountedPriceForSize,
                price: String(item.productPrice),
              },
              quantity: item.quantity,
            };
          });

          const startIndex = (currentPage - 1) * pageSize;
          const paginatedCart = formattedCart.slice(startIndex, startIndex + pageSize);
          setCartItems(paginatedCart as CartItem[]);
          setTotalPages(Math.ceil(formattedCart.length / pageSize));
          
        } catch (err) {
          console.error("Failed to load local cart:", err);
          setError("Failed to load cart items");
          setCartItems([]);
          setTotalPages(1);
        } finally {
          setIsLoading(false);
        }
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
          console.error(`HTTP error! status: ${response.status}, body:`, errorBody);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CartApiResponse = await response.json();
        if (data && data.results && data.results.length > 0 && Array.isArray(data.results[0].cart_items)) {
          setCartUid(data.results[0].id);
          const allCartItems = data.results[0].cart_items;

          // Fetch product details to get sub_category
          const productDetails = await Promise.all(
            allCartItems.map((item) =>
              fetch(`${baseURL}/api/v1/product/item/${item.product.id}/`, {
                headers: {
                  Authorization: `JWT ${accessToken}`,
                  "Content-Type": "application/json",
                },
              })
                .then((res) => {
                  if (!res.ok) throw new Error(`Failed to fetch product ${item.product.id}`);
                  return res.json() as Promise<ProductDetails>;
                })
                .catch((err) => {
                  console.error(`Error fetching product ${item.product.id}:`, err);
                  return {
                    id: item.product.id,
                    name: item.product.name,
                    image1: item.product.image1,
                    sub_category: { id: 0, name: "" },
                  };
                })
            )
          );

          const enrichedCartItems = allCartItems.map((item, index) => ({
            ...item,
            product: {
              ...item.product,
              sub_category: productDetails[index].sub_category || { id: 0, name: "" },
            },
          }));

          const startIndex = (currentPage - 1) * pageSize;
          const paginatedCart = enrichedCartItems.slice(startIndex, startIndex + pageSize);
          setCartItems(paginatedCart);
          setTotalPages(Math.ceil(enrichedCartItems.length / pageSize));
          
        } else {
          console.warn("Received unexpected data format or empty cart from API:", data);
          setCartItems([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Failed to fetch cart data:", err);
        setError("Failed to fetch cart data");
        setCartItems([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, [currentPage]);

  const updateItemQuantityAPI = async (cartItemId: number, newQuantity: number) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
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
      const response = await fetch(`${baseURL}/api/v1/cart/${cartUid}/items/${cartItemId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`API Error (${response.status}) updating item ${cartItemId}:`, errorBody);
        return false;
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

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    const success = await updateItemQuantityAPI(cartItemId, newQuantity);

    if (!success) {
      setCartItems(originalItems);
    }
  };

  const decreaseQuantity = async (cartItemId: number) => {
    const itemIndex = cartItems.findIndex((item) => item.id === cartItemId);
    if (itemIndex === -1 || cartItems[itemIndex].quantity <= 1) return;

    const currentItem = cartItems[itemIndex];
    const newQuantity = currentItem.quantity - 1;

    const originalItems = [...cartItems];

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    const success = await updateItemQuantityAPI(cartItemId, newQuantity);

    if (!success) {
      setCartItems(originalItems);
    }
  };

  const removeItem = async (cartItemId: number) => {
    const accessToken = localStorage.getItem("accessToken");

    const originalItems = [...cartItems];

    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));

    if (!accessToken) {
      const itemToRemove = originalItems.find((item) => item.id === cartItemId);
      if (itemToRemove) {
        const productId = itemToRemove.product.id;
        const sizeId = itemToRemove.size.id;
        removeLocalCartItem(productId, sizeId);
      }
      return;
    }

    if (!cartUid) {
      console.error("Cart UID not available for API call.");
      setCartItems(originalItems);
      return;
    }

    try {
      const response = await fetch(`${baseURL}/api/v1/cart/${cartUid}/items/${cartItemId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to delete cart item:", error);
      setCartItems(originalItems);
    }
  };

  const subtotal = cartItems.reduce((total: number, item: CartItem) => {
    const itemPrice = Number(item.size.price);
    return total + itemPrice * item.quantity;
  }, 0);

  const undiscountedTotal = cartItems.reduce((total: number, item: CartItem) => {
    const originalPrice = Number(item.size.undiscounted_price);
    const currentPrice = Number(item.size.price);
    return total + (originalPrice > currentPrice ? originalPrice : currentPrice) * item.quantity;
  }, 0);

  const totalSavings = undiscountedTotal - subtotal;
  const discountPercentage = Math.round((totalSavings / undiscountedTotal) * 100) || 0;
  const total = subtotal;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-6 font-poppins text-center">
        <p className="p-10 text-red-500">{error}</p>
        <Link
          to="/products"
          className="inline-block bg-gray-600 text-white py-3 px-8 rounded-full hover:bg-gray-800 transition-colors"
        >
          Continue Browsing Our Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-6 font-poppins">
        <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="relative flex flex-col items-center gap-2">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
              <span className="text-lg text-gray-500 mt-2">Loading cart...</span>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-medium text-gray-600 mb-4">No Items In Cart</h2>
            <Link
              to="/products"
              className="inline-block bg-gray-600 text-white py-3 px-8 rounded-full hover:bg-gray-800 transition-colors"
            >
              Continue Browsing Our Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 mb-9">
            <div className="w-full lg:w-2/3">
              {cartItems.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 mb-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className="w-24 h-24 bg-gray-100 rounded-lg p-2 mr-4 flex-shrink-0 relative cursor-pointer"
                      onClick={() => navigate(`/product/item/${item.product.id}`)}
                    >
                      <div className="absolute top-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-tl-lg rounded-br-lg z-10">
                        {item.size.quantity ? `${item.size.quantity} in stock` : "Unlimited"}
                      </div>
                      <img
                        src={item.product.image1}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                        onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold line-clamp-1">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">Size: {item.size.size.toUpperCase()}</p>
                      <div className="mt-1">
                        {item.size.undiscounted_price && Number(item.size.undiscounted_price) > Number(item.size.price) ? (
                          <div>
                            <span className="line-through text-gray-500">
                              {formatCurrency(Number(item.size.undiscounted_price))}
                            </span>{" "}
                            <br />
                            <span className="font-bold text-green-600">
                              {formatCurrency(Number(item.size.price))}
                            </span>{" "}
                            <br className="md:hidden" />
                            <span className="text-xs text-green-600">
                              ({Math.round((1 - Number(item.size.price) / Number(item.size.undiscounted_price)) * 100)}% off)
                            </span>
                          </div>
                        ) : (
                          <p className="font-bold">{formatCurrency(Number(item.size.price || 0))}</p>
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
                        className={`w-8 h-8 border border-gray-300 flex items-center justify-center rounded ${item.quantity <= 1 ? "cursor-not-allowed" : ""}`}
                        disabled={item.quantity <= 1}
                      >
                        <span>−</span>
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.size.quantity ? item.quantity >= item.size.quantity : false}
                      >
                        <span>+</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded ${currentPage === page ? 'bg-black text-white' : 'bg-gray-200'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/3">
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Original Price</span>
                    <span className="font-semibold line-through text-gray-500">
                      {formatCurrency(undiscountedTotal)}
                    </span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Total Savings ({discountPercentage}% off)</span>
                      <span>-{formatCurrency(totalSavings)}</span>
                    </div>
                  )}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="font-bold">Final Price</span>
                      <span className="font-bold">{formatCurrency(total)}</span>
                    </div>
                  </div>
                  <Link
                    to={localStorage.getItem("accessToken") ? "/confirm-order" : "/login?redirect=/confirm-order"}
                    className="w-full"
                  >
                    <button className="w-full bg-gray-600 text-white py-3 px-6 rounded-full mt-4 flex items-center justify-center gap-2">
                      Go To Checkout
                      <FiArrowRight size={20} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <Suggested
          subcategory_id={subCategoryParams.subCategoryId}
          isCartContext={true}
          second_subcategory_id={subCategoryParams.secondSubCategoryId}
          excludeProductIds={subCategoryParams.excludeProductIds}
        />
      </div>
    </div>
  );
};

export default Cart;