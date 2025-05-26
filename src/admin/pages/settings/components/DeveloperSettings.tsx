import { useState, useEffect } from "react";
import axios from "axios";

interface DeveloperSettingsData {
  brand_name: string;
  contact_us: string;
  terms_of_service: string;
  backend_base_route: string;
  frontend_base_route: string;
  order_route_frontend: string;
  payment_failed_url: string;
}

interface UiFormData {
  businessName: string;
  contact: string;
  termsOfService: string;
  backendRoute: string;
  frontendRoute: string;
  orderRoute: string;
  paymentFailedUrl: string;
}

const DeveloperSettings: React.FC = () => {
  const [formData, setFormData] = useState<DeveloperSettingsData>({
    brand_name: "",
    contact_us: "",
    terms_of_service: "",
    backend_base_route: "",
    frontend_base_route: "",
    order_route_frontend: "",
    payment_failed_url: "",
  });
  const [initialData, setInitialData] = useState<DeveloperSettingsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false); // Changed to false to open by default

  useEffect(() => {
    fetchDeveloperSettings();
  }, []);

  const fetchDeveloperSettings = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      const response = await axios.get<DeveloperSettingsData>(
        'https://ecommercetemplate.pythonanywhere.com/api/v1/admin/developer-settings/',
        {
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.data) {
        setFormData(response.data);
        setInitialData(response.data);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load Developer settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const apiFieldName = mapFieldNameToApi(name);
    setFormData((prev) => ({
      ...prev,
      [apiFieldName]: value,
    }));
  };

  const mapFieldNameToApi = (fieldName: string): string => {
    const mapping: Record<string, keyof DeveloperSettingsData> = {
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

  const getUiFormData = (): UiFormData => {
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

  const handleSaveConfirm = (): void => {
    setShowConfirmModal(false);
    handleSave();
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const apiFormData = {
        brand_name: formData.brand_name,
        contact_us: formData.contact_us,
        terms_of_service: formData.terms_of_service,
        backend_base_route: formData.backend_base_route,
        frontend_base_route: formData.frontend_base_route,
        order_route_frontend: formData.order_route_frontend,
        payment_failed_url: formData.payment_failed_url,
      };
      const token = localStorage.getItem('accessToken');

      await axios.patch(
        'https://ecommercetemplate.pythonanywhere.com/api/v1/admin/developer-settings/',
        apiFormData,
        {
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      setShowSuccessModal(true);
      setError(null);
      setInitialData(formData);
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (err) {
      setError('Failed to update developer settings');
      console.error('Error updating developer settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = (): boolean => {
    if (!initialData) return false;
    return (
      formData.brand_name !== initialData.brand_name ||
      formData.contact_us !== initialData.contact_us ||
      formData.terms_of_service !== initialData.terms_of_service ||
      formData.backend_base_route !== initialData.backend_base_route ||
      formData.frontend_base_route !== initialData.frontend_base_route ||
      formData.order_route_frontend !== initialData.order_route_frontend ||
      formData.payment_failed_url !== initialData.payment_failed_url
    );
  };

  const handleCancel = (): void => {
    if (initialData) {
      setFormData({...initialData});
    }
  };

  if (loading && !initialData) {
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

        {!isCollapsed && (
          <div className="mt-4 transition-all duration-300 ease-in-out">
            <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow border border-gray-200">
              <h3 className="font-medium text-lg mb-3">Current Developer Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Business Name</p>
                  <p className="font-medium truncate">{initialData?.brand_name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Email</p>
                  <p className="font-medium truncate">
                    {initialData?.contact_us ? (
                      <a href={`mailto:${initialData.contact_us}`} className="text-blue-600 hover:underline">
                        {initialData.contact_us}
                      </a>
                    ) : (
                      'Not set'
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Terms of Service</p>
                  <p className="font-medium truncate">{initialData?.terms_of_service || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Backend Base URL</p>
                  <p className="font-medium truncate">{initialData?.backend_base_route || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Frontend Base URL</p>
                  <p className="font-medium truncate">{initialData?.frontend_base_route || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Failed URL</p>
                  <p className="font-medium truncate">{initialData?.payment_failed_url || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Route</p>
                  <p className="font-medium truncate">{initialData?.order_route_frontend || 'Not set'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="businessName">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={uiFormData.businessName}
                  onChange={handleChange}
                  placeholder="Enter Business Name"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="contact">
                  Contact
                </label>
                <input
                  type="text"
                  id="contact"
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
                <label className="block text-sm font-medium mb-2" htmlFor="termsOfService">
                  Terms of Service
                </label>
                <input
                  type="text"
                  id="termsOfService"
                  name="termsOfService"
                  value={uiFormData.termsOfService}
                  onChange={handleChange}
                  placeholder="Enter Terms of Service"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="backendRoute">
                  Backend Route
                </label>
                <input
                  type="text"
                  id="backendRoute"
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
                <label className="block text-sm font-medium mb-2" htmlFor="frontendRoute">
                  Frontend Route
                </label>
                <input
                  type="text"
                  id="frontendRoute"
                  name="frontendRoute"
                  value={uiFormData.frontendRoute}
                  onChange={handleChange}
                  placeholder="Enter Frontend Route"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="orderRoute">
                  Order Route
                </label>
                <input
                  type="text"
                  id="orderRoute"
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
              <label className="block text-sm font-medium mb-2" htmlFor="paymentFailedUrl">
                Payment Failed URL
              </label>
              <input
                type="text"
                id="paymentFailedUrl"
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
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCancel}
                disabled={loading || !hasChanges()}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => setShowConfirmModal(true)}
                disabled={loading || !hasChanges()}
                type="button"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Changes</h3>
            <p className="mb-6">
              Are you sure you want to save these changes to developer settings?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setShowConfirmModal(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                onClick={handleSaveConfirm}
                type="button"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4 text-green-700">Success</h3>
            <p className="mb-6">
              Developer settings updated successfully!
            </p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                onClick={() => setShowSuccessModal(false)}
                type="button"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperSettings;