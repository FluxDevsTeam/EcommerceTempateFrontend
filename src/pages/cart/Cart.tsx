import { useState } from "react";
import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}



const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Gradient Graphic T-shirt",
      price: 145,
      size: "Large",
      color: "White",
      quantity: 1,
      image: "https://th.bing.com/th/id/OIP.isIzC64ISx8G8jPpKeiPRwHaHa?w=184&h=184&c=7&r=0&o=5&pid=1.7",
    },
    {
      id: 2,
      name: "Checkered Shirt",
      price: 180,
      size: "Medium",
      color: "Red",
      quantity: 1,
      image: `https://th.bing.com/th/id/OIP.pLy_d4q6NSl8Y5__dojzWAHaHa?w=205&h=205&c=7&r=0&o=5&pid=1.7`,
    },
    
    {
      id: 3,
      name: `Skinny Fit Jeans`,
      price: 240,
      size: `Large`,
      color: `Blue`,
      quantity: 1,
      image: `https://th.bing.com/th/id/OIP.jjPDtijj_nC1hnWJM_YnKAHaHa?w=205&h=205&c=7&r=0&o=5&pid=1.7`,
    },
  ]);

  const increaseQuantity = (id: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Calculate order summary
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discountPercentage = 20;
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const total = subtotal - discountAmount;

  // Recommended products
  const recommendedProducts = [
    {
      id: 1,
      name: "Polo with Contrast Trims",
      price: 212,
      originalPrice: 242,
      discount: 20,
      image: `https://th.bing.com/th/id/OIP.dkNJ_ODZxla-khcYAQ6t8QHaLH?w=156&h=192&c=7&r=0&o=5&pid=1.7`,
    },
    {
      id: 2,
      name: `Polo with Contrast Trims`,
      price: 145,
      image: `https://th.bing.com/th/id/OIP.mxALY9ebC8FBKs-t3z1z1AHaLH?w=156&h=180&c=7&r=0&o=5&pid=1.7`,
    },
    {
      id: 3,
      name: `Polo with Tipping Details`,
      price: 180,
      image: `https://th.bing.com/th/id/OIP.JELDOYDe6rdYtlYo2jyj9wHaLH?w=204&h=306&c=7&r=0&o=5&pid=1.7`,
    },
    {
      id: 4,
      name: `Black Striped T-shirt`,
      price: 120,
      originalPrice: 150,
      discount: 20,
      image: `https://th.bing.com/th/id/OIP.wpEI3wVdH-Pj2w9K7mIBjAHaHa?w=205&h=205&c=7&r=0&o=5&pid=1.7`,
    },
  ];

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

      <h1 className="text-3xl font-bold mb-8">Your cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 mb-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-24 h-24 bg-gray-100 rounded-lg mr-4 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                  <p className="text-sm text-gray-500">Color: {item.color}</p>
                  <p className="font-bold mt-1">${item.price}</p>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 mb-12"
                >
                  <FiTrash2 size={24} />
                </button>
                <div className="flex items-center">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded"
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
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal}</span>
              </div>

              <div className="flex justify-between text-red-500">
                <span>Discount (-{discountPercentage}%)</span>
                <span>-${discountAmount}</span>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total}</span>
                </div>
              </div>

              <Link to="/checkout">
                <button className="w-full bg-black text-white py-3 px-6 rounded-full mt-4 flex items-center justify-center gap-2">
                  Go to Checkout
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* You might also like section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
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
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <h3 className="font-medium">{product.name}</h3>

              <div className="flex items-center mt-2">
                <span className="font-bold">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-gray-400 line-through ml-2">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-red-100 text-red-500 text-xs px-2 py-1 ml-2 rounded">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cart;
