import { useState, useEffect } from "react";
import axios from "axios";

interface OrganizationSettings {
  available_states: any;
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

const allNigerianStates = [
  "Lagos", "Ogun", "Oyo", "Osun", "Ondo", "Ekiti", "Edo", "Delta", "Kwara", 
  "Kogi", "Niger", "Abuja", "Kaduna", "Kano", "Borno", "Yobe", "Sokoto", 
  "Zamfara", "Taraba", "Gombe", "Bauchi", "Adamawa", "Katsina", "Jigawa", 
  "Nasarawa", "Benue", "Kebbi", "Bayelsa", "Rivers", "Akwa Ibom", 
  "Cross River", "Enugu", "Anambra", "Abia", "Imo", "Ebonyi", "FCT - Abuja"
];

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
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [initialData, setInitialData] = useState<OrganizationSettings | null>(null);
  const [initialSelectedStates, setInitialSelectedStates] = useState<string[]>([]);

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
        setInitialData(response.data);
        
        // Initialize selected states from the available_states in the response
        if (response.data.available_states) {
          const states = Object.keys(response.data.available_states)
            .filter(key => response.data.available_states[key] === true);
          setSelectedStates(states);
          setInitialSelectedStates(states);
        }
      }
      setError(null);
    } catch (err) {
      setError('Failed to load organization settings');
      console.error('Error fetching organization settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStateToggle = (state: string) => {
    setSelectedStates(prev => {
      if (prev.includes(state)) {
        return prev.filter(s => s !== state);
      } else {
        return [...prev, state];
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSaveConfirm = () => {
    setShowModal(false);
    handleSave();
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      // Create available_states object from selected states
      const availableStatesObj: Record<string, boolean> = {};
      allNigerianStates.forEach(state => {
        availableStatesObj[state] = selectedStates.includes(state);
      });

      // Prepare data to be sent to the API
      const patchData = {
        warehouse_state: formData.warehouse_state,
        available_states: availableStatesObj,
        phone_number: formData.phone_number,
        customer_support_email: formData.customer_support_email,
        admin_email: formData.admin_email,
        facebook: formData.facebook,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        tiktok: formData.tiktok
      };

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
      setInitialData(formData);
      setInitialSelectedStates(selectedStates);
      
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

  const hasChanges = () => {
    if (!initialData) return false;
    
    // Check form fields
    const formChanged = 
      formData.warehouse_state !== initialData.warehouse_state ||
      formData.phone_number !== initialData.phone_number ||
      formData.customer_support_email !== initialData.customer_support_email ||
      formData.admin_email !== initialData.admin_email ||
      formData.facebook !== initialData.facebook ||
      formData.twitter !== initialData.twitter ||
      formData.linkedin !== initialData.linkedin ||
      formData.tiktok !== initialData.tiktok;

    // Check if selected states have changed
    const statesChanged = 
      selectedStates.length !== initialSelectedStates.length ||
      !selectedStates.every(state => initialSelectedStates.includes(state));

    return formChanged || statesChanged;
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData(initialData);
      setSelectedStates(initialSelectedStates);
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

<div className="mb-8 bg-gray-100 p-4 rounded-lg shadow border border-gray-200">
  <h3 className="font-medium text-lg mb-3">Current Settings</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div>
      <p className="text-sm text-gray-500">Warehouse State</p>
      <p className="font-medium">{initialData?.warehouse_state || 'Not set'}</p>
    </div>
    <div>
      <p className="text-sm text-gray-500">Phone Number</p>
      <p className="font-medium">{initialData?.phone_number || 'Not set'}</p>
    </div>
    <div>
      <p className="text-sm text-gray-500">Customer Support Email</p>
      <p className="font-medium">{initialData?.customer_support_email || 'Not set'}</p>
    </div>
    <div>
      <p className="text-sm text-gray-500">Admin Email</p>
      <p className="font-medium">{initialData?.admin_email || 'Not set'}</p>
    </div>
    <div>
      <p className="text-sm text-gray-500">Available States</p>
      <p className="font-medium">
        {initialSelectedStates.length > 0 
          ? `${initialSelectedStates.length} states selected` 
          : 'No states selected'}
      </p>
    </div>
    <div>
      <p className="text-sm text-gray-500">Social Media</p>
      <div className="flex space-x-2 mt-1">
        {initialData?.facebook && (
          <a href={`https://facebook.com/${initialData.facebook}`} target="_blank" rel="noopener noreferrer">
            <span className="text-blue-600">FB</span>
          </a>
        )}
        {initialData?.twitter && (
          <a href={`https://twitter.com/${initialData.twitter}`} target="_blank" rel="noopener noreferrer">
            <span className="text-blue-400">TW</span>
          </a>
        )}
        {initialData?.linkedin && (
          <a href={`https://linkedin.com/${initialData.linkedin}`} target="_blank" rel="noopener noreferrer">
            <span className="text-blue-700">LI</span>
          </a>
        )}
        {initialData?.tiktok && (
          <a href={`https://tiktok.com/@${initialData.tiktok}`} target="_blank" rel="noopener noreferrer">
            <span className="text-black">TT</span>
          </a>
        )}
        {!initialData?.facebook && !initialData?.twitter && !initialData?.linkedin && !initialData?.tiktok && (
          <span className="text-gray-400">None</span>
        )}
      </div>
    </div>
  </div>
</div>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6">Organizational Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Warehouse State</label>
            <select
              name="warehouseStates"
              value={uiFormData.warehouseStates}
              onChange={handleChange}
              className="w-full p-3 text-base border border-gray-300 rounded-md"
            >
              <option value="">Select a warehouse state</option>
              {allNigerianStates.map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Available States</label>
            <div className="border border-gray-300 rounded-md p-4 h-64 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {allNigerianStates.map(state => (
                  <div key={state} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`state-${state}`}
                      checked={selectedStates.includes(state)}
                      onChange={() => handleStateToggle(state)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor={`state-${state}`} className="ml-2 text-sm">
                      {state}
                    </label>
                  </div>
                ))}
              </div>
            </div>
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
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={handleCancel}
            disabled={loading || !hasChanges()}
          >
            Cancel
          </button>
          <button 
            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            onClick={() => setShowModal(true)}
            disabled={loading || !hasChanges()}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Changes</h3>
            <p className="mb-6">
              Are you sure you want to save these changes to organization settings?
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

export default OrganizationalSettings;