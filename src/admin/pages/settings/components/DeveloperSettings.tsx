import { useState, useEffect } from "react";
import axios from "axios";

interface DeveloperSettings {
  brand_name: string;
  contact_us: string;
  terms_of_service: string;
  backend_base_route: string;
  frontend_base_route: string;
  order_route_frontend: string;
  payment_failed_url: string;
}

const DeveloperSettings = () => {
  const [formData, setFormData] = useState<DeveloperSettings>({
    brand_name: '',
    contact_us: '',
    terms_of_service: '',
    backend_base_route: '',
    frontend_base_route: '',
    order_route_frontend: '',
    payment_failed_url: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchDeveloperSettings();
  }, []);

  const fetchDeveloperSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get<DeveloperSettings>(
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
      }
      setError(null);
    } catch (err) {
      setError('Failed to load developer settings');
      console.error('Error fetching developer settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const apiFieldName = mapFieldNameToApi(name);
    setFormData(prev => ({
      ...prev,
      [apiFieldName]: value
    }));
  };
  
  const mapFieldNameToApi = (fieldName: string): string => {
    const mapping: {[key: string]: string} = {
      'businessName': 'brand_name',
      'contact': 'contact_us',
      'termsOfService': 'terms_of_service',
      'backendRoute': 'backend_base_route',
      'frontendRoute': 'frontend_base_route',
      'orderRoute': 'order_route_frontend',
      'paymentFailedUrl': 'payment_failed_url'
    };
    
    return mapping[fieldName] || fieldName;
  };
  
  const getUiFormData = () => {
    return {
      businessName: formData.brand_name || '',
      contact: formData.contact_us || '',
      termsOfService: formData.terms_of_service || '',
      backendRoute: formData.backend_base_route || '',
      frontendRoute: formData.frontend_base_route || '',
      orderRoute: formData.order_route_frontend || '',
      paymentFailedUrl: formData.payment_failed_url || ''
    };
  };
  
  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await axios.patch<DeveloperSettings>(
        'https://ecommercetemplate.pythonanywhere.com/api/v1/admin/developer-settings/',
        formData,
        {
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      setSuccessMessage('Developer settings updated successfully');
      setError(null);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to update developer settings');
      console.error('Error updating developer settings:', err);
    } finally {
      setLoading(false);
    }
  };
  
 
  
  if (loading && !formData.brand_name) {
    return <div className="p-4">Loading developer settings...</div>;
  }

  const uiFormData = getUiFormData();

  return (
    <div className="p-4">
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
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6">Developer Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Business Name</label>
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
            <label className="block text-sm font-medium mb-2">Terms of Service</label>
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
            <label className="block text-sm font-medium mb-2">Backend Route</label>
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
            <label className="block text-sm font-medium mb-2">Frontend Route</label>
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
            <label className="block text-sm font-medium mb-2">Order Route</label>
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
          <label className="block text-sm font-medium mb-2">Payment Failed URL</label> 
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
      </div>

     

      <div className="mb-6">
        <div className="flex justify-end space-x-4 mb-8">
          <button 
            className="px-6 py-2 border border-gray-300 rounded-md"
            onClick={fetchDeveloperSettings}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="px-6 py-2 bg-gray-800 text-white rounded-md"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperSettings;