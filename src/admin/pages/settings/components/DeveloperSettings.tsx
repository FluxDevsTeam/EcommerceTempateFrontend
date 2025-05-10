import { useState, useEffect } from "react";

const DeveloperSettings = () => {
  const [formData, setFormData] = useState({
    brand_name: "",
    contact_us: "",
    terms_of_service: "",
    backend_base_route: "",
    frontend_base_route: "",
    order_route_frontend: "",
    payment_failed_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDeveloperSettings();
  }, []);

  const fetchDeveloperSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      // Simulating API call for demo purposes
      setTimeout(() => {
        setFormData({
          brand_name: "Demo Company",
          contact_us: "contact@demo.com",
          terms_of_service: "https://demo.com/terms",
          backend_base_route: "https://api.demo.com",
          frontend_base_route: "https://demo.com",
          order_route_frontend: "/orders",
          payment_failed_url: "/payment/failed",
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to load developer settings");
      console.error("Error fetching developer settings:", err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const apiFieldName = mapFieldNameToApi(name);
    setFormData((prev) => ({
      ...prev,
      [apiFieldName]: value,
    }));
  };

  const mapFieldNameToApi = (fieldName) => {
    const mapping = {
      businessName: "brand_name",
      contact: "contact_us",
      termsOfService: "terms_of_service",
      backendRoute: "backend_base_route",
      frontendRoute: "frontend_base_route",
      orderRoute: "order_route_frontend",
      paymentFailedUrl: "payment_failed_url",
    };

    return mapping[fieldName] || fieldName;
  };

  const getUiFormData = () => {
    return {
      businessName: formData.brand_name || "",
      contact: formData.contact_us || "",
      termsOfService: formData.terms_of_service || "",
      backendRoute: formData.backend_base_route || "",
      frontendRoute: formData.frontend_base_route || "",
      orderRoute: formData.order_route_frontend || "",
      paymentFailedUrl: formData.payment_failed_url || "",
    };
  };

  const handleSaveConfirm = () => {
    setShowModal(false);
    handleSave();
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Simulating API call for demo purposes
      setTimeout(() => {
        setSuccessMessage("Developer settings updated successfully");
        setError(null);
        setLoading(false);
        
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }, 1000);
    } catch (err) {
      setError("Failed to update developer settings");
      console.error("Error updating developer settings:", err);
      setLoading(false);
    }
  };

  if (loading && !formData.brand_name) {
    return <div className="p-4">Loading developer settings...</div>;
  }

  const uiFormData = getUiFormData();

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      

      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-50 rounded"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <h2 className="text-xl font-bold">Developer Settings</h2>
          <svg
            className={`w-6 h-6 transform transition-transform ${
              isCollapsed ? "" : "rotate-180"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        

        {isCollapsed && (

          
          <div className="mt-4 transition-all duration-300 ease-in-out">

<div className="mb-6 bg-gray-100 p-4 rounded-lg shadow border border-gray-200">
  <h3 className="font-medium text-lg mb-3">Current Developer Settings</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div>
      <p className="text-sm text-gray-500">Business Name</p>
      <p className="font-medium truncate">{formData.brand_name || 'Not set'}</p>
    </div>
    <div>
      <p className="text-sm text-gray-500">Contact Email</p>
      <p className="font-medium truncate">
        {formData.contact_us ? (
          <a href={`mailto:${formData.contact_us}`} className="text-blue-600 hover:underline">
            {formData.contact_us}
          </a>
        ) : (
          'Not set'
        )}
      </p>
    </div>
    <div>
      <p className="text-sm text-gray-500">Terms of Service</p>
      <p className="font-medium truncate">
        {formData.terms_of_service ? (
          <a href={formData.terms_of_service} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            View Terms
          </a>
        ) : (
          'Not set'
        )}
      </p>
    </div>
    <div>
      <p className="text-sm text-gray-500">Backend Base URL</p>
      <p className="font-medium truncate">{formData.backend_base_route || 'Not set'}</p>
    </div>
    <div>
      <p className="text-sm text-gray-500">Frontend Base URL</p>
      <p className="font-medium truncate">{formData.frontend_base_route || 'Not set'}</p>
    </div>
    <div>
      <p className="text-sm text-gray-500">Payment Failed URL</p>
      <p className="font-medium truncate">{formData.payment_failed_url || 'Not set'}</p>
    </div>
  </div>
</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={uiFormData.businessName}
                  onChange={handleChange}
                  placeholder="Enter Business Name"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={uiFormData.contact}
                  onChange={handleChange}
                  placeholder="Enter Contact"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  maxLength={200}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Terms of Service
                </label>
                <input
                  type="text"
                  name="termsOfService"
                  value={uiFormData.termsOfService}
                  onChange={handleChange}
                  placeholder="Enter Terms of Service"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Backend Route
                </label>
                <input
                  type="text"
                  name="backendRoute"
                  value={uiFormData.backendRoute}
                  onChange={handleChange}
                  placeholder="Enter Backend Route"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  maxLength={200}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Frontend Route
                </label>
                <input
                  type="text"
                  name="frontendRoute"
                  value={uiFormData.frontendRoute}
                  onChange={handleChange}
                  placeholder="Enter Frontend Route"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Order Route
                </label>
                <input
                  type="text"
                  name="orderRoute"
                  value={uiFormData.orderRoute}
                  onChange={handleChange}
                  placeholder="Enter Order Route"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  maxLength={200}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Failed URL
              </label>
              <input
                type="text"
                name="paymentFailedUrl"
                value={uiFormData.paymentFailedUrl}
                onChange={handleChange}
                placeholder="Enter Payment Failed URL"
                className="w-full p-3 border border-gray-300 rounded-md"
                maxLength={200}
              />
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={fetchDeveloperSettings}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                onClick={() => setShowModal(true)}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Changes</h3>
            <p className="mb-6">
              Are you sure you want to save these changes to developer settings?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                onClick={handleSaveConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperSettings;