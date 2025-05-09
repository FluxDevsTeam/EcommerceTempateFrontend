import { useState, useEffect } from "react";
import axios from "axios";

interface OrganizationSettings {
  available_states: any; // This appears to be an object in the API schema
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
        setFormData(response.data);
        console.log(response.data);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load organization settings');
      console.error('Error fetching organization settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Map UI field names to API field names
    const apiFieldName = mapFieldNameToApi(name);
    
    setFormData(prev => ({
      ...prev,
      [apiFieldName]: value
    }));
  };

  const mapFieldNameToApi = (fieldName: string): string => {
    const mapping: {[key: string]: string} = {
      'warehouseStates': 'warehouse_state',
      'availableStates': 'available_states',
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

  const getUiFormData = () => {
    return {
      warehouseStates: formData.warehouse_state || '',
      availableStates: typeof formData.available_states === 'object'
        ? JSON.stringify(formData.available_states)
        : formData.available_states || '',
      phoneNumber: formData.phone_number || '+234',
      logo: formData.brand_logo || '',
      customerSupportEmail: formData.customer_support_email || '',
      adminEmail: formData.admin_email || '',
      facebook: formData.facebook || '',
      twitter: formData.twitter || '',
      linkedin: formData.linkedin || '',
      tiktok: formData.tiktok || '',
    };
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      // Prepare data to be sent to the API
      const patchData = {
        warehouse_state: formData.warehouse_state,
        available_states: formData.available_states,
        phone_number: formData.phone_number,
        customer_support_email: formData.customer_support_email,
        admin_email: formData.admin_email,
        facebook: formData.facebook,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        tiktok: formData.tiktok
      };

      // For available_states, parse it back to an object if it's a string
      if (typeof formData.available_states === 'string') {
        try {
          patchData.available_states = JSON.parse(formData.available_states);
        } catch (e) {
          console.error('Error parsing available_states JSON:', e);
          setError('Invalid JSON format for Available States');
          setLoading(false);
          return;
        }
      }

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

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account');
      // Implementation for account deletion would go here
    }
  };

  if (loading && !formData.phone_number) {
    return <div className="p-4">Loading organization settings...</div>;
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
        <h2 className="text-xl font-bold mb-6">Organizational Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Warehouse State</label> 
            <input
              type="text"
              name="warehouseStates"
              value={uiFormData.warehouseStates}
              onChange={handleChange}
              placeholder="Enter Warehouse State" 
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Available States</label>
            <input
              type="text"
              name="availableStates"
              value={uiFormData.availableStates}
              onChange={handleChange}
              placeholder="Enter Available States"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Logo</label>
            <input
              type="text"
              name="logo"
              value={uiFormData.logo}
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
              value={uiFormData.phoneNumber}
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
              value={uiFormData.twitter}
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
              value={uiFormData.customerSupportEmail}
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
              value={uiFormData.facebook}
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
              value={uiFormData.adminEmail}
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
              value={uiFormData.linkedin}
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
              value={uiFormData.tiktok}
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