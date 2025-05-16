import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
// import { ThreeDots } from "react-loader-spinner";

const ConfirmOrder = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login?redirect=/confirm-order");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    state: "",
    city: "",
    delivery_address: "",
    phone_number: "",
  });

  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [cartDetails, setCartDetails] = useState<any>(null);
  const [cartId, setCartId] = useState<string | null>(null);

  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("paystack");
  const [error, setError] = useState<string | null>(null);
  const baseURL = `https://ecommercetemplate.pythonanywhere.com`;
  const [availableStates, setAvailableStates] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // ORDER SUMMARY Fetch Function
  const fetchOrderSummary = async () => {
    setIsLoadingSummary(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error(
        "No access token found for summary. User might not be logged in."
      );
      setOrderSummary(null);
      setIsLoadingSummary(false);
      setError("User not logged in (summary).");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/api/v1/payment/summary/`, {
        method: "GET",
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data)
        
      } else {
        console.log("Order summary fetched/refreshed:", data);
        setOrderSummary(data);
        setError(null);
      }

    } catch (err) {
      console.error("Failed to fetch order summary:", err);
      if (!error || error.includes("summary")) {
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred while fetching summary."
        );
      }
      setOrderSummary(null);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchOrderSummary();
  }, []);

  useEffect(() => {
    const fetchCartData = async () => {
      // setIsLoadingCart(true);
      setError(null);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error(
          "No access token found for cart details. User might not be logged in."
        );
        setCartDetails(null);
        setCartId(null);
        // setIsLoadingCart(false);
        setError("User not logged in (cart details).");
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
          const errorText = await response.text();
          console.error(
            `HTTP error fetching cart! status: ${response.status}, body: ${errorText}`
          );
          setError(`Failed to load cart details: ${response.statusText}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Cart details fetched:", data);

        if (data && data.results && data.results.length > 0) {
          const cartResult = data.results[0];
          setCartDetails(cartResult);
          setCartId(cartResult.id);
          // console.log("Cart ID set:", cartResult.id);
        } else {
          console.warn("No cart data found in response results.");
          setCartDetails(null);
          setCartId(null);
          setError("No cart found for this user.");
        }
      } catch (err) {
        console.error("Failed to fetch cart data:", err);
        if (!error || error.includes("cart")) {
          setError(
            err instanceof Error
              ? err.message
              : "An unknown error occurred fetching cart details."
          );
        }
        setCartDetails(null);
        setCartId(null);
      } finally {
        // setIsLoadingCart(false);
      }
    };

    fetchCartData();
  }, []);

  useEffect(() => {
    if (cartDetails) {
      console.log(
        "Populating form data from fetched cart details:",
        cartDetails
      );
      setFormData((prevData) => ({
        ...prevData,
        first_name: cartDetails.first_name || "",
        last_name: cartDetails.last_name || "",
        email: cartDetails.email || "",
        state: cartDetails.state || "",
        city: cartDetails.city || "",
        delivery_address: cartDetails.delivery_address || "",
        phone_number: cartDetails.phone_number || "",
      }));
    }
  }, [cartDetails]);

  // TO PATCH CUSTOMER DETAILS AND REFRESH SUMMARY
  const patchCustomerDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("User not logged in.");
      setIsSubmitting(false);
      return;
    }
    if (!cartId) {
      // Check using the separate cartId state
      setError("Cart ID not found. Cannot update details.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      state: formData.state,
      city: formData.city,
      delivery_address: formData.delivery_address,
      phone_number: formData.phone_number,
    };

    console.log("Submitting (PATCH) customer details:", payload);

    try {
      const response = await fetch(`${baseURL}/api/v1/cart/${cartId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // console.log("PATCH Response Status:", response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error("API Error Response:", errorData);
        } catch (parseError) {
          errorData = await response.text();
          console.error("API Error Response (non-JSON):", errorData);
        }
        setError(
          `Failed to update details: ${response.statusText} ${JSON.stringify(
            errorData
          )}`
        );
        throw new Error(`API error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Successfully patched customer details:", responseData);

      console.log("Refreshing order summary after successful PATCH...");
      await fetchOrderSummary();

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (error) {
      console.error("Error patching customer details:", error);
      if (!error) {
        setError(
          error instanceof Error
            ? error.message
            : "An unknown error occurred during submission."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDeliveryDate = (dates: string[] | undefined): string => {
    if (!dates || dates.length < 2) {
      return "Not available";
    }
    try {
      const startDate = new Date(dates[0]);
      const endDate = new Date(dates[1]);
      // Basic formatting, adjust as needed
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
      };
      const startStr = !isNaN(startDate.getTime())
        ? startDate.toLocaleDateString("en-US", options)
        : "Invalid Date";
      const endStr = !isNaN(endDate.getTime())
        ? endDate.toLocaleDateString("en-US", options)
        : "Invalid Date";

      if (startStr === "Invalid Date" || endStr === "Invalid Date")
        return "Currently not delivering to that state";

      // Simple range display
      return `${startStr} - ${endStr}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Date unavailable";
    }
  };

  const initiatePayment = async () => {
    console.log("btn was clicked");
    // Directly manipulate the button element
    const paymentButton = document.querySelector(
      ".paymentBtn"
    ) as HTMLButtonElement | null;

    if (paymentButton) {
      paymentButton.disabled = true;
      paymentButton.textContent = "Processing...";
      paymentButton.classList.add(
        "cursor-not-allowed",
        "opacity-50",
        "bg-gray-400"
      );
      paymentButton.classList.remove("bg-black", "hover:bg-gray-800");
    }

    // Set timeout to re-enable the button after 5 seconds
    setTimeout(() => {
      if (paymentButton) {
        paymentButton.disabled = false;
        paymentButton.textContent = "Proceed to Payment";
        paymentButton.classList.remove(
          "cursor-not-allowed",
          "opacity-50",
          "bg-gray-400"
        );
        paymentButton.classList.add("bg-black", "hover:bg-gray-800");
      }
    }, 10000);

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error(
        "No access token found for payment initiation. User might not be logged in."
      );
      setError("User not logged in.");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/api/v1/payment/initiate/`, {
        method: "POST",
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: selectedProvider,
        }),
      });

      const logData = await response.json();
      console.log("Initiate Payment Response:", logData);

      if (response.ok && logData?.data?.payment_link) {
        console.log("Redirecting to:", logData.data.payment_link);
        window.location.href = logData.data.payment_link;
      } else {
        const errorMessage =
          logData?.message ||
          `Failed to initiate payment. Status: ${response.status}`;
        console.error("Payment initiation failed:", errorMessage, logData);
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An unknown error occurred during payment initiation."
      );
    }
  };

  useEffect(() => {
    const fetchAvailableStates = async () => {
      // setIsLoadingStates(true);

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error(
          "No access token found for cart details. User might not be logged in."
        );
        return;
      }

      try {
        const response = await fetch(
          `${baseURL}/api/v1/admin/user/organisation-settings/`,
          {
            method: "GET",
            headers: {
              Authorization: `JWT ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch states");
        const data = await response.json();
        console.log(data);
        setAvailableStates(data.available_states);

        // console.log(data.available_states)
      } catch (error) {
        console.error("Error fetching states:", error);
      }
      //  finally {
      //   // setIsLoadingStates(false);
      // }
    };

    fetchAvailableStates();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-poppins relative">
     
      <h1
        className="font-bold mb-8"
        style={{ fontSize: "clamp(18px, 3vw, 24px)" }}
      >
        Confirm your Order
      </h1>

      <div className="gap-8">
        <div className="w-full grid md:grid-cols-[60%_40%]">
          {/* Customer Details */}
          <form
            onSubmit={patchCustomerDetails}
            className="grid gap-y-7 mb-8 md:w-11/12"
          >
            {/* first and last name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm">First Name</label>
                <input
                  required
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="John"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Last Name</label>
                <input
                  required
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* email address */}
            <div className="">
              <label className="block mb-2 text-sm">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="abc@example.com"
                className="w-full p-3 border border-gray-300 rounded-lg"
                disabled={isSubmitting}
              />
            </div>

            {/* state and city */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="">
                <label className="block mb-2 text-sm">State</label>
                <select
                  required
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  disabled={isSubmitting}
                >
                  <option value="">Select a state</option>
                  {availableStates.map((state, indexPurpose) => (
                    <option key={indexPurpose} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm">City</label>
                <input
                  required
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* delivery address */}
            <div>
              <label className="block mb-2 text-sm">Delivery Address</label>
              <input
                required
                maxLength={50}
                type="text"
                name="delivery_address"
                value={formData.delivery_address}
                onChange={handleInputChange}
                placeholder="223b, Baker's street"
                className="w-full p-3 border border-gray-300 rounded-lg"
                disabled={isSubmitting}
              />
              <span className="block text-right text-xs text-gray-500 mt-1 pr-2">
                {formData.delivery_address.length} / 50
              </span>
            </div>

            <div>
              <label className="block mb-2 text-sm">Phone Number</label>
              <input
                required
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+123 456 7890"
                className="w-full p-3 border border-gray-300 rounded-lg"
                disabled={isSubmitting}
              />
            </div>

            {/* Display Submission Error if any */}
            {error && error.includes("update details") && (
              <div className="text-red-500 text-sm mt-[-1rem]">{error}</div>
            )}

            <button
              type="submit"
              className={`w-full bg-black text-white py-3 px-6 rounded-full ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting || isLoadingSummary}
            >
              {isSubmitting ? "Confirming..." : "Confirm Order"}
            </button>
          </form>

          {/* --- Update Order Summary section --- */}
          <div className="border border-gray-200 rounded-lg p-6 md:h-fit">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            {/* Conditionally render content based on loading/error/data */}
            {isLoadingSummary && (
              // loader
              <div>
                <div className="relative flex w-64 animate-pulse gap-2 p-4">
                  <div className="h-12 w-12 rounded-full bg-slate-400"></div>
                  <div className="flex-1">
                    <div className="mb-1 h-5 w-3/5 rounded-lg bg-slate-400 text-lg"></div>
                    <div className="h-5 w-[90%] rounded-lg bg-slate-400 text-sm"></div>
                  </div>
                  <div className="absolute bottom-5 right-0 h-4 w-4 rounded-full bg-slate-400"></div>
                </div>
              </div>
            )}

            {error && !isLoadingSummary && (
              <div className="text-center text-red-500">Error: {error}</div>
            )}

            {orderSummary && !isLoadingSummary && !error && (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    &#8358; {orderSummary?.subtotal?.toFixed(2) ?? "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>No. of Items</span>
                  <span>
                    {cartDetails?.cart_items?.reduce(
                      (total: number, item: { quantity: number }) =>
                        total + item.quantity,
                      0
                    ) ?? "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">
                    &#8358;
                    {Number(orderSummary?.delivery_fee)?.toFixed(2) ?? "N/A"}
                  </span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">
                      &#8358; {orderSummary?.total?.toFixed(2) ?? "N/A"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Estimated delivery:{" "}
                    {formatDeliveryDate(orderSummary?.estimated_delivery)}
                  </div>
                </div>

                {/* Payment Provider Selection */}
                <div className="payProviders flex justify-center gap-x-6 py-3 border-t border-b border-gray-200 my-4">
                  <div>
                    <input
                      type="radio"
                      name="paymentProvider"
                      id="paystack"
                      value="paystack"
                      checked={selectedProvider === "paystack"}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      className="mr-1 cursor-pointer"
                    />
                    <label htmlFor="paystack">PayStack</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="paymentProvider"
                      id="flutterwave"
                      value="flutterwave"
                      checked={selectedProvider === "flutterwave"}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      className="mr-1 cursor-pointer"
                    />
                    <label htmlFor="flutterwave">Flutterwave</label>
                  </div>
                </div>

                <button
                  onClick={initiatePayment}
                  className={`paymentBtn w-full bg-black text-white py-3 px-6 rounded-full mt-4 flex items-center justify-center gap-2 ${
                    isSubmitting ||
                    isLoadingSummary ||
                    !formData.city ||
                    !formData.delivery_address ||
                    !formData.email ||
                    !formData.first_name ||
                    !formData.last_name ||
                    !formData.phone_number ||
                    !formData.state
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-800"
                  }`}
                  disabled={
                    isSubmitting ||
                    isLoadingSummary ||
                    !formData.city ||
                    !formData.delivery_address ||
                    !formData.email ||
                    !formData.first_name ||
                    !formData.last_name ||
                    !formData.phone_number ||
                    !formData.state
                  }
                >
                  Proceed to Payment
                  <FiArrowRight />
                </button>
                <p className="text-red-700 text-xs">
                  Note: always fill in correct details and confirm order before
                  proceeding to payment
                </p>
              </div>
            )}
            {/* Show message if summary couldn't load but page is otherwise fine */}
            {!orderSummary && !isLoadingSummary && !error && (
              <div className="text-center text-gray-500">
                Summary unavailable.
              </div>
            )}
          </div>

          {orderSummary && !isLoadingSummary && !error && (
            <div className=" grid md:grid-cols-2 items-center mt-6 border border-gray-200 rounded-lg p-6 md:col-span-2">
              {" "}
              <div className="mb-8 md:mb-0">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Credit Card, Transfer, USSD
                </p>
                <p className="text-xs text-gray-500">Secure and encrypted</p>
              </div>
              <div className="flex space-x-8">
                {/* Payment icons */}
                <img
                  src={`https://th.bing.com/th/id/OIP.vcIxy5gIS3D_hTxtBHDSLgHaCf?w=349&h=117&c=7&r=0&o=5&pid=1.7`}
                  alt="Visa"
                  className="h-4 md:h-6 w-fit"
                />
                <img
                  src={`https://th.bing.com/th/id/OIP.E1H7K1pGXLYUVUvedgFMHwHaBy?w=349&h=84&c=7&r=0&o=5&pid=1.7`}
                  alt="PayPal"
                  className="h-[16.5px] md:h-6 w-fit"
                />
                <img
                  src={`https://th.bing.com/th/id/OIP.JwOmOEpCOes2zw-Evu14XQHaEK?w=321&h=180&c=7&r=0&o=5&pid=1.7`}
                  alt="Mastercard"
                  className="h-5 md:h-7 w-fit"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-8 py-6 rounded-lg shadow-xl max-w-md w-full text-center"
            role="alert"
          >
            <strong className="font-bold text-xl block mb-2">Success!</strong>
            <span className="block sm:inline text-lg">
              {" "}
              Details confirmed. You can now proceed to payment.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmOrder;
