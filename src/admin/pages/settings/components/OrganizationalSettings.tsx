import { useState, useEffect } from "react";
import axios from "axios";

interface OrganizationSettings {
  available_states: Record<string, string>; // Object with state keys and values
  warehouse_state: string;
  phone_number: string;
  customer_support_email: string;
  admin_email: string;
  brand_logo: string | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  tiktok: string | null;
}

const OrganizationalSettings = () => {
  const [formData, setFormData] = useState<OrganizationSettings>({
    available_states: {},
    warehouse_state: '',
    phone_number: '+234',
    customer_support_email: '',
    admin_email: '',
    brand_logo: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    tiktok: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizationSettings();
  }, []);
  
  // Debug when formData changes
  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  const fetchOrganizationSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get<OrganizationSettings>(
        'https://ecommercetemplate.pythonanywhere.com/api/v1/admin/organisation-settings/',
        {
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.data) {
        // For debugging
        console.log("API Response:", response.data);
        console.log("Available States:", response.data.available_states);
        console.log("Warehouse State:", response.data.warehouse_state);
        
        // Ensure available_states is treated as an object
        const formattedData = {
          ...response.data,
          available_states: response.data.available_states || {}
        };
        
        setFormData(formattedData);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load organization settings');
      console.error('Error fetching organization settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For debugging
    console.log(`Field changed: ${name}, value: ${value}`);
    
    // Handle warehouse_state directly since it's a special case
    if (name === 'warehouseState') {
      setFormData(prev => ({
        ...prev,
        warehouse_state: value
      }));
    } else {
      // For other fields, map to API field names
      const apiFieldName = mapFieldNameToApi(name);
      setFormData(prev => ({
        ...prev,
        [apiFieldName]: value
      }));
    }
  };
  
  const mapFieldNameToApi = (fieldName: string): string => {
    const mapping: {[key: string]: string} = {
      'phoneNumber': 'phone_number',
      'logo': 'brand_logo',
      'customerSupportEmail': 'customer_support_email',
      'adminEmail': 'admin_email',
      'facebook': 'facebook',
      'twitter': 'twitter',
      'linkedin': 'linkedin',
      'tiktok': 'tiktok'
    };
    
    return mapping[fieldName] || fieldName;
  };
  
  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const patchData = {
        warehouse_state: formData.warehouse_state,
        phone_number: formData.phone_number,
        customer_support_email: formData.customer_support_email,
        admin_email: formData.admin_email,
        facebook: formData.facebook,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        tiktok: formData.tiktok
      };
      
      // Log what we're sending
      console.log("Sending update:", patchData);
      
      await axios.patch<OrganizationSettings>(
        'https://ecommercetemplate.pythonanywhere.com/api/v1/admin/organisation-settings/',
        patchData,
        {
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      setSuccessMessage('Organization settings updated successfully');
      setError(null);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to update organization settings');
      console.error('Error updating organization settings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.phone_number) {
    return <div className="p-4">Loading organization settings...</div>;
  }

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
        <h2 className="text-xl font-bold mb-6">Organizational Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Warehouse State</label> 
            <input
              type="text"
              name="warehouseState"
              value={formData.warehouse_state || ''}
              onChange={handleChange}
              placeholder="Enter Warehouse State" 
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Available States</label>
            <select
              name="warehouseState"
              value={formData.warehouse_state || ''}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="">Select a state</option>
              {formData.available_states && Object.keys(formData.available_states).length > 0 ? (
                Object.entries(formData.available_states).map(([key, value]) => (
                  <option key={key} value={key}>
                    {String(value)}
                  </option>
                ))
              ) : (
                <option value="">No states available</option>
              )}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Logo</label>
            <input
              type="text"
              name="logo"
              value={formData.brand_logo || ''}
              onChange={handleChange}
              placeholder="Enter Logo"
              className="w-full p-3 border border-gray-300 rounded-md"
              disabled={true}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label> 
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phone_number || '+234'}
              onChange={handleChange}
              placeholder="Enter Phone Number" 
              className="w-full p-3 border border-gray-300 rounded-md"
              maxLength={20}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Twitter</label>
            <input
              type="text"
              name="twitter"
              value={formData.twitter || ''}
              onChange={handleChange}
              placeholder="Enter Twitter Username"
              className="w-full p-3 border border-gray-300 rounded-md"
              maxLength={100}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Customer Support Email</label>
            <input
              type="email"
              name="customerSupportEmail"
              value={formData.customer_support_email || ''}
              onChange={handleChange}
              placeholder="Enter Email Address"
              className="w-full p-3 border border-gray-300 rounded-md"
              maxLength={254}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Facebook</label>
            <input
              type="text"
              name="facebook"
              value={formData.facebook || ''}
              onChange={handleChange}
              placeholder="Enter Facebook Username" 
              className="w-full p-3 border border-gray-300 rounded-md"
              maxLength={100}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Admin Email</label>
            <input
              type="email"
              name="adminEmail"
              value={formData.admin_email || ''}
              onChange={handleChange}
              placeholder="Enter Email Address"
              className="w-full p-3 border border-gray-300 rounded-md"
              maxLength={254}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin || ''}
              onChange={handleChange}
              placeholder="Enter LinkedIn Username" 
              className="w-full p-3 border border-gray-300 rounded-md"
              maxLength={100}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">TikTok</label> 
            <input
              type="text"
              name="tiktok"
              value={formData.tiktok || ''}
              onChange={handleChange}
              placeholder="Enter TikTok Username" 
              className="w-full p-3 border border-gray-300 rounded-md"
              maxLength={100}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-end space-x-4 mb-8">
          <button 
            className="px-6 py-2 border border-gray-300 rounded-md"
            onClick={fetchOrganizationSettings}
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

export default OrganizationalSettings;