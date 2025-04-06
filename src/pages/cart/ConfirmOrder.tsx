import { useState } from "react";
import { Link } from "react-router-dom";

const ConfirmOrder = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    state: "",
    city: "",
    deliveryAddress: "",
    phoneNumber: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Order summary details
  const subtotal = 565;
  const numberOfItems = 3;
  const deliveryFee = 15;
  const total = 467;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-poppins">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500">
          Home
        </Link>
        <span className="mx-2">›</span>
        <Link to="/cart" className="text-gray-500">
          Cart
        </Link>
        <span className="mx-2">›</span>
        <span>Confirm Order</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Confirm your Order</h1>

      <div className="flex flex-col-reverse lg:flex-row gap-8">
        {/* Customer Details */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="abc@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter State"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm">Delivery Address</label>
            <input
              type="text"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleInputChange}
              placeholder="223b, Baker's street"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+234"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <button className="w-full bg-black text-white py-3 px-6 rounded-full">
            Confirm Delivery
          </button>

          {/* Payment Method */}
          <div className=" grid md:grid-cols-2 items-center mt-6 border border-gray-200 rounded-lg p-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <p className="text-sm text-gray-600 mb-4">
                Credit Card, Transfer, USSD
              </p>
              <p className="text-xs text-gray-500">Secure and encrypted</p>
            </div>
            <div className="flex space-x-8">
              <img
                src={`https://th.bing.com/th/id/OIP.vcIxy5gIS3D_hTxtBHDSLgHaCf?w=349&h=117&c=7&r=0&o=5&pid=1.7`}
                alt="Visa"
                className="h-6 w-fit"
              />
              <img
                src={`https://th.bing.com/th/id/OIP.E1H7K1pGXLYUVUvedgFMHwHaBy?w=349&h=84&c=7&r=0&o=5&pid=1.7`}
                alt="PayPal"
                className="h-6 w-fit"
              />
              <img
                src={`https://th.bing.com/th/id/OIP.JwOmOEpCOes2zw-Evu14XQHaEK?w=321&h=180&c=7&r=0&o=5&pid=1.7`}
                alt="Mastercard"
                className="h-6 w-fit"
              />
            </div>
          </div>

          {/* Order Summary - Mobile View */}
          <div className="lg:hidden border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>No. of Items</span>
                <span>{numberOfItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee}</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total}</span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Estimated delivery: 4th - 8th of April
                </div>
              </div>

              <Link to="/payment">
                <button className="w-full bg-black text-white py-3 px-6 rounded-full mt-4 flex items-center justify-center gap-2">
                  Proceed to Payment
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

        {/* Order Summary - Desktop View */}
        <div className="hidden lg:block w-full lg:w-1/3">
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>No. of Items</span>
                <span>{numberOfItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee}</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total}</span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Estimated delivery: 4th - 8th of April
                </div>
              </div>

              <Link to="/payment">
                <button className="w-full bg-black text-white py-3 px-6 rounded-full mt-4 flex items-center justify-center gap-2">
                  Proceed to Payment
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
    </div>
  );
};

export default ConfirmOrder;
