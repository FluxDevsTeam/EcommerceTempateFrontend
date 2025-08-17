import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiInfo, FiPhone } from "react-icons/fi";
import CopyablePhone from '@/components/CopyablePhone';

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
  const baseURL = `https://api.kidsdesigncompany.com`;
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [includeDeliveryFee, setIncludeDeliveryFee] = useState(true);
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);

  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [isFormModified, setIsFormModified] = useState(false); // New state to track form changes

  // Handle tooltip collapse on click outside or scroll
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".delivery-info-container")) {
        setShowDeliveryInfo(false);
      }
    };

    const handleScroll = () => {
      setShowDeliveryInfo(false);
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setIsFormModified(true);
    setIsOrderConfirmed(false);
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
      const response = await fetch(
        `${baseURL}/api/v1/payment/summary/?include_delivery_fee=${includeDeliveryFee}`,
        {
          method: "GET",
          headers: {
            Authorization: `JWT ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        
      } else {
        
        setOrderSummary(data);
        setError(null);
      }
    } catch (err) {
      
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
  }, [includeDeliveryFee]);

  useEffect(() => {
    const fetchCartData = async () => {
      setError(null);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error(
          "No access token found for cart details. User might not be logged in."
        );
        setCartDetails(null);
        setCartId(null);
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
        

        if (data && data.results && data.results.length > 0) {
          const cartResult = data.results[0];
          setCartDetails(cartResult);
          setCartId(cartResult.id);
          setIncludeDeliveryFee(cartResult.include_delivery_fee ?? true);
        } else {
          console.warn("No cart data found in response results.");
          setCartDetails(null);
          setCartId(null);
          setError("No cart found for this user.");
        }
      } catch (err) {
        
        if (!error || error.includes("cart")) {
          setError(
            err instanceof Error
              ? err.message
              : "An unknown error occurred fetching cart details."
          );
        }
        setCartDetails(null);
        setCartId(null);
      }
    };

    fetchCartData();
  }, []);

  useEffect(() => {
    if (cartDetails) {
      

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
      setIsFormModified(false);
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
      include_delivery_fee: includeDeliveryFee,
    };



    try {
      const response = await fetch(`${baseURL}/api/v1/cart/${cartId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();

        } catch (parseError) {
          errorData = await response.text();

        }
        setError(
          `Failed to update details: ${response.statusText} ${JSON.stringify(
            errorData
          )}`
        );
        throw new Error(`API error: ${response.status}`);
        setIsOrderConfirmed(false);
      }

      const responseData = await response.json();
      

      setIsOrderConfirmed(true);
      setIsFormModified(false);

      await fetchOrderSummary();

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      
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

  // Helper function to format numbers with commas
  const formatCurrency = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return "N/A";
    }
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDeliveryDate = (dates: string[] | undefined): string => {
    if (!dates || dates.length < 2) {
      return "Not available";
    }
    try {
      const startDate = new Date(dates[0]);
      const endDate = new Date(dates[1]);
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

      return `${startStr} - ${endStr}`;
    } catch (e) {

      return "Date unavailable";
    }
  };

  const initiatePayment = async () => {
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
          include_delivery_fee: includeDeliveryFee,
        }),
      });

      const logData = await response.json();
      

      if (response.ok && logData?.data?.payment_link) {

        window.location.href = logData.data.payment_link;
      } else {
        const errorMessage =
          logData?.message ||
          `Failed to initiate payment. Status: ${response.status}`;

        setError(errorMessage);
      }
    } catch (error) {
      
      setError(
        error instanceof Error
          ? error.message
          : "An unknown error occurred during payment initiation."
      );
    }
  };

  // Handle phone number click
  const handlePhoneClick = () => {
    const phoneNumber = "+2348063224027";
    // Try to open phone app
    window.location.href = `tel:${phoneNumber}`;
    // Copy to clipboard as fallback
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phoneNumber).then(() => {
        setPhoneCopied(true);
        setTimeout(() => setPhoneCopied(false), 2000);
      });
    }
  };

  useEffect(() => {
    const fetchAvailableStates = async () => {
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
        
        setAvailableStates(data.available_states);
      } catch (error) {
        
      }
    };

    fetchAvailableStates();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-poppins relative">
      <h1
        className="mt-11 font-bold mb-8 md:mt-0"
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

            {/* Delivery Fee Toggle with Info Icon */}
            <div className="relative delivery-info-container">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeDeliveryFee"
                  checked={includeDeliveryFee}
                  onChange={(e) => {
                    setIncludeDeliveryFee(e.target.checked);
                    setIsFormModified(true); // Mark form as modified
                    setIsOrderConfirmed(false); // Reset order confirmation
                  }}
                  className="mr-2 cursor-pointer"
                  disabled={isSubmitting}
                />
                <label htmlFor="includeDeliveryFee" className="text-sm">
                  Include Delivery Fee
                </label>
                <FiInfo
                  className="ml-2 text-gray-500 cursor-pointer hover:text-gray-700"
                  size={16}
                  onClick={() => setShowDeliveryInfo(!showDeliveryInfo)}
                />
              </div>
              {showDeliveryInfo && (
                <div className="absolute top-full mt-2 left-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-sm text-gray-600 max-w-xs">
                  Delivery is optional. Choose to opt out if you prefer to pick up your order in person. The delivery fee may vary based on your location, order quantity, and preferred delivery method. For more details or to discuss custom delivery options,{" "}
                  <a
                    href="https://wa.me/message/IJCGAQKFVMKUB1 "
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    contact us here
                  </a>.
                </div>
              )}
            </div>

            {/* Note when delivery is unchecked */}
            {!includeDeliveryFee && (
              <div className="text-sm text-gray-600 mt-1">
                By opting out of delivery, you agree to pick up your order in person at our designated location.{" "}
                <a
                  href="https://wa.me/message/IJCGAQKFVMKUB1 "
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  Contact us here
                </a>{" "}
                for pickup details.
              </div>
            )}

            {/* Display Submission Error if any */}
            {error && error.includes("update details") && (
              <div className="text-red-500 text-sm mt-[-1rem]">{error}</div>
            )}

            <button
              type="submit"
              className={`w-full bg-gray-600 text-white py-3 px-6 rounded-full ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting || isLoadingSummary}
            >
              {isSubmitting ? "Confirming..." : "Confirm Details"}
            </button>
          </form>

          {/* --- Update Order Summary section --- */}
          <div>
            <div className="border border-gray-200 rounded-lg p-6 md:h-fit">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              {isLoadingSummary && (
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
                      ₦ {formatCurrency(orderSummary?.subtotal)}
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
                      {includeDeliveryFee
                        ? `₦ ${formatCurrency(Number(orderSummary?.delivery_fee))}`
                        : "Not included"}
                    </span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">
                        ₦ {formatCurrency(orderSummary?.total)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Estimated delivery:{" "}
                      {formatDeliveryDate(orderSummary?.estimated_delivery)}
                    </div>
                  </div>

                  <div className="payProviders flex justify-center gap-x-6 py-3 border-t border-b border-gray-200 my-4">
                    <div className="flex justify-center items-center">
                      <input
                        type="radio"
                        name="paymentProvider"
                        id="paystack"
                        value="paystack"
                        checked={selectedProvider === "paystack"}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        className="mr-1 cursor-pointer"
                      />
                      <img
                        src="https://th.bing.com/th/id/R.45adb7d2e08de3f29a8194c790a6d1f6?rik=tFgLQDy65jK5Sg&pid=ImgRaw&r=0"
                        alt="Paystack logo"
                        className="h-4 ml-1 object-contain"
                      />
                    </div>

                    <div className="">
                      <div className="flex justify-center items-center">
                        <input
                          type="radio"
                          name="paymentProvider"
                          id="flutterwave"
                          value="flutterwave"
                          checked={selectedProvider === "flutterwave"}
                          onChange={(e) => setSelectedProvider(e.target.value)}
                          className="mr-1 cursor-pointer"
                        />
                        <img
                          src="https://leadership.ng/wp-content/uploads/2022/09/Flutterwave-New-Logo-2022-Transparent-1-2048x323.png"
                          alt="Flutterwave logo"
                          className="h-4 ml-1 object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={initiatePayment}
                    className={`paymentBtn w-full bg-gray-600 text-white py-3 px-6 rounded-full mt-4 flex items-center justify-center gap-2 ${
                      isSubmitting ||
                      isLoadingSummary ||
                      !isOrderConfirmed ||
                      isFormModified
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-800"
                    }`}
                    disabled={
                      isSubmitting ||
                      isLoadingSummary ||
                      !isOrderConfirmed ||
                      isFormModified
                    }
                  >
                    {isOrderConfirmed && !isFormModified
                      ? "Proceed to payment"
                      : "Confirm details to proceed"}
                    <FiArrowRight />
                  </button>
                </div>
              )}
              {!orderSummary && !isLoadingSummary && !error && (
                <div className="flex flex-col items-center justify-center text-center text-gray-500 py-6">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3">
                    <rect x="18" y="18" width="44" height="54" rx="6" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="3"/>
                    <rect x="28" y="12" width="24" height="12" rx="4" fill="#3B82F6" stroke="#3B82F6" strokeWidth="2"/>
                    <path d="M30 44L38 52L50 36" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-semibold text-lg text-gray-700">Confirm your order to see the summary</span>
                  <span className="text-sm text-gray-500 mt-1">Fill in your details and confirm to view your order summary and proceed to payment.</span>
                </div>
              )}
            </div>
            {/* Order Summary Note */}
            <div className="text-sm text-gray-600 mt-4">
              Delivery is optional, with convenient on-site pickup available. Delivery fees can be tailored based on your order quantity, location, and preferred delivery method. For personalized support or questions before purchasing, contact our support team: {"  "}
              <FiPhone
                className="inline-block mx-1 cursor-pointer text-gray-500 hover:text-blue-700"
                size={16}
                onClick={handlePhoneClick}
              />
              <CopyablePhone 
                phoneNumber="+234 916 409 7582" 
                className="text-blue-500 underline hover:text-blue-700 cursor-pointer"
              />
              {" "}or message us{" "}
              <a
                href="https://wa.me/message/IJCGAQKFVMKUB1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                here
              </a>.
              {phoneCopied && (
                <span className="ml-2 text-green-600 bg-green-100 px-2 py-1 rounded">
                  Phone number copied
                </span>
              )}
            </div>
          </div>

          {orderSummary && !isLoadingSummary && !error && (
            <div className="grid md:grid-cols-2 items-center mt-6 border border-gray-200 rounded-lg p-6 md:col-span-2">
              <div className="mb-8 md:mb-0">
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
                  className="h-7 w-fit"
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
            className="bg-green-100 border border-blue-400 text-gray-600 px-8 py-6 rounded-lg shadow-xl max-w-md w-full text-center relative"
            role="alert"
          >
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-blue-700 focus:outline-none"
              aria-label="Close success modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <strong className="font-bold text-xl block mb-2">Success!</strong>
            <span className="block sm:inline text-lg">
              Details confirmed. You can now proceed to payment.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmOrder;