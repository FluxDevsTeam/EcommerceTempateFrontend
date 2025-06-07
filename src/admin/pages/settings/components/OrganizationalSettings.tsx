import { useState, useEffect } from "react";
import axios from "axios";

interface OrganizationSettings {
  available_states: Record<string, boolean> | string[];
  warehouse_state: string;
  phone_number: string;
  customer_support_email: string;
  admin_email: string;
  brand_logo: string | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  tiktok: string | null;
  instagram: string | null;
}

const allNigerianStates = [
  "Lagos", "FCT - Abuja", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", 
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", 
  "Kwara", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", 
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const OrganizationalSettings = () => {
  const [formData, setFormData] = useState<OrganizationSettings>({
    available_states: [],
    warehouse_state: '',
    phone_number: '+234',
    customer_support_email: '',
    admin_email: '',
    brand_logo: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    tiktok: '',
    instagram: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [initialData, setInitialData] = useState<OrganizationSettings | null>(null);
  const [initialSelectedStates, setInitialSelectedStates] = useState<string[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizationSettings();
  }, []);

  const fetchOrganizationSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get<OrganizationSettings>(
        'http://kidsdesignecommerce.pythonanywhere.com/api/v1/admin/organisation-settings/',
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
        
        let states: string[] = [];
        if (Array.isArray(response.data.available_states)) {
          states = response.data.available_states;
        } else if (typeof response.data.available_states === 'object' && response.data.available_states !== null) {
          states = Object.keys(response.data.available_states)
            .filter(key => response.data.available_states[key] === true);
        }
        
        setSelectedStates(states);
        setInitialSelectedStates(states);

        if (response.data.brand_logo) {
          setLogoPreview(response.data.brand_logo);
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
    const apiFieldName = mapFieldNameToApi(name);
    setFormData(prev => ({
      ...prev,
      [apiFieldName]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
      'tiktok': 'tiktok',
      'instagram': 'instagram'
    };
    return mapping[fieldName] || fieldName;
  };

  const getUiFormData = () => {
    return {
      warehouseStates: formData.warehouse_state || '',
      availableStates: Array.isArray(formData.available_states)
        ? formData.available_states.join(', ')
        : typeof formData.available_states === 'object'
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
      instagram: formData.instagram || '',
    };
  };

  const handleSaveConfirm = () => {
    setShowConfirmModal(false);
    handleSave();
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      const formDataToSend = new FormData();
      formDataToSend.append('warehouse_state', formData.warehouse_state);
      formDataToSend.append('available_states', JSON.stringify(selectedStates.sort((a, b) => allNigerianStates.indexOf(a) - allNigerianStates.indexOf(b))));
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('customer_support_email', formData.customer_support_email);
      formDataToSend.append('admin_email', formData.admin_email);
      formDataToSend.append('facebook', formData.facebook || '');
      formDataToSend.append('twitter', formData.twitter || '');
      formDataToSend.append('linkedin', formData.linkedin || '');
      formDataToSend.append('tiktok', formData.tiktok || '');
      formDataToSend.append('instagram', formData.instagram || '');
      if (logoFile) {
        formDataToSend.append('brand_logo', logoFile);
      }

      const response = await axios.patch<OrganizationSettings>(
        'http://kidsdesignecommerce.pythonanywhere.com/api/v1/admin/organisation-settings/',
        formDataToSend,
        {
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      setFormData(response.data);
      setInitialData(response.data);
      setInitialSelectedStates(selectedStates.sort((a, b) => allNigerianStates.indexOf(a) - allNigerianStates.indexOf(b)));
      setLogoFile(null);
      setLogoPreview(response.data.brand_logo || logoPreview);
      
      setShowSuccessModal(true);
      setError(null);
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (err) {
      let errorMessage = 'Failed to update organization settings';

      if (axios.isAxiosError(err)) {
        if (err.response) {
          const data = err.response.data;
          console.error('Server responded with error:', data);

          if (typeof data === 'string') {
            errorMessage = data;
          } else if (typeof data === 'object' && data !== null) {
            const messages: string[] = [];

            for (const key in data) {
              const value = data[key];
              if (Array.isArray(value)) {
                messages.push(`${key}: ${value.join(', ')}`);
              } else if (typeof value === 'string') {
                messages.push(`${key}: ${value}`);
              } else {
                messages.push(`${key}: ${JSON.stringify(value)}`);
              }
            }

            errorMessage = messages.join(' | ');
          } else {
            errorMessage = JSON.stringify(data);
          }

        } else if (err.request) {
          console.error('No response received:', err.request);
          errorMessage = 'No response received from server';
        } else {
          console.error('Request setup error:', err.message);
          errorMessage = `Request error: ${err.message}`;
        }
      } else {
        console.error('Unexpected error:', err);
        errorMessage = `Unexpected error: ${err instanceof Error ? err.message : String(err)}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    if (!initialData) return false;

    const formChanged =
      formData.warehouse_state !== initialData.warehouse_state ||
      formData.phone_number !== initialData.phone_number ||
      formData.customer_support_email !== initialData.customer_support_email ||
      formData.admin_email !== initialData.admin_email ||
      formData.facebook !== initialData.facebook ||
      formData.twitter !== initialData.twitter ||
      formData.linkedin !== initialData.linkedin ||
      formData.tiktok !== initialData.tiktok ||
      formData.instagram !== initialData.instagram ||
      logoFile !== null;

    const statesChanged = 
      selectedStates.length !== initialSelectedStates.length ||
      !selectedStates.every(state => initialSelectedStates.includes(state));

    return formChanged || statesChanged;
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData(initialData);
      setSelectedStates(initialSelectedStates);
      setLogoFile(null);
      setLogoPreview(initialData.brand_logo);
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
            <p className="text-sm text-gray-500">Logo</p>
            {initialData?.brand_logo ? (
              <img 
                src={initialData.brand_logo} 
                alt="Brand Logo" 
                className="w-16 h-16 object-cover rounded-md"
              />
            ) : (
              <p className="font-medium">Not set</p>
            )}
          </div>
        </div>
        
        {(initialData?.facebook || initialData?.twitter || initialData?.linkedin || initialData?.tiktok || initialData?.instagram) && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md border border-gray-200">
            <h4 className="font-medium mb-2">Social Media Links</h4>
            <div className="grid grid-cols-1 gap-2">
              {initialData?.facebook && (
                <div>
                  <span className="font-medium">Facebook: </span>
                  <span className="text-sm break-all">{initialData.facebook}</span>
                </div>
              )}
              {initialData?.twitter && (
                <div>
                  <span className="font-medium">Twitter: </span>
                  <span className="text-sm break-all">{initialData.twitter}</span>
                </div>
              )}
              {initialData?.linkedin && (
                <div>
                  <span className="font-medium">LinkedIn: </span>
                  <span className="text-sm break-all">{initialData.linkedin}</span>
                </div>
              )}
              {initialData?.tiktok && (
                <div>
                  <span className="font-medium">TikTok: </span>
                  <span className="text-sm break-all">{initialData.tiktok}</span>
                </div>
              )}
              {initialData?.instagram && (
                <div>
                  <span className="font-medium">Instagram: </span>
                  <span className="text-sm break-all">{initialData.instagram}</span>
                </div>
              )}
            </div>
          </div>
        )}
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
            <div className="border border-gray-300 rounded-md p-4 h-36 overflow-y-auto">
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
            <div className="flex items-center space-x-4">
              {logoPreview && (
                <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gray-50 file:text-gray-700
                    hover:file:bg-gray-100"
                />
              </div>
            </div>
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
            <label className="block text-sm font-medium mb-2">Twitter <span className="text-red-500">*</span><span className="text-xs text-gray-500 ml-1">(Enter full URL with https://)</span></label>
            <div className="flex">
              <input
                type="url"
                name="twitter"
                value={formData.twitter || ''}
                onChange={handleChange}
                placeholder="https://twitter.com/yourprofile"
                className="flex-1 p-3 border border-gray-300 rounded-md"
                maxLength={100}
              />
            </div>
            {formData.twitter && !formData.twitter.startsWith('http') && (
              <p className="text-xs text-red-500 mt-1">URL must start with http:// or https://</p>
            )}
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
            <label className="block text-sm font-medium mb-2">Facebook <span className="text-red-500">*</span><span className="text-xs text-gray-500 ml-1">(Enter full URL with https://)</span></label>
            <div className="flex">
              <input
                type="url"
                name="facebook"
                value={formData.facebook || ''}
                onChange={handleChange}
                placeholder="https://facebook.com/yourpage"
                className="flex-1 p-3 border border-gray-300 rounded-md"
                maxLength={100}
              />
            </div>
            {formData.facebook && !formData.facebook.startsWith('http') && (
              <p className="text-xs text-red-500 mt-1">URL must start with http:// or https://</p>
            )}
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
            <label className="block text-sm font-medium mb-2">LinkedIn <span className="text-red-500">*</span><span className="text-xs text-gray-500 ml-1">(Enter full URL with https://)</span></label>
            <div className="flex">
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin || ''}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/yourpage"
                className="flex-1 p-3 border border-gray-300 rounded-md"
                maxLength={100}
              />
            </div>
            {formData.linkedin && !formData.linkedin.startsWith('http') && (
              <p className="text-xs text-red-500 mt-1">URL must start with http:// or https://</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">TikTok <span className="text-red-500">*</span><span className="text-xs text-gray-500 ml-1">(Enter full URL with https://)</span></label>
            <div className="flex">
              <input
                type="url"
                name="tiktok"
                value={formData.tiktok || ''}
                onChange={handleChange}
                placeholder="https://tiktok.com/@yourusername"
                className="flex-1 p-3 border border-gray-300 rounded-md"
                maxLength={100}
              />
            </div>
            {formData.tiktok && !formData.tiktok.startsWith('http') && (
              <p className="text-xs text-red-500 mt-1">URL must start with http:// or https://</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Instagram <span className="text-red-500">*</span><span className="text-xs text-gray-500 ml-1">(Enter full URL with https://)</span></label>
            <div className="flex">
              <input
                type="url"
                name="instagram"
                value={formData.instagram || ''}
                onChange={handleChange}
                placeholder="https://instagram.com/yourprofile"
                className="flex-1 p-3 border border-gray-300 rounded-md"
                maxLength={100}
              />
            </div>
            {formData.instagram && !formData.instagram.startsWith('http') && (
              <p className="text-xs text-red-500 mt-1">URL must start with http:// or https://</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-end space-x-4 mb-8">
            <button 
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCancel}
              disabled={loading || !hasChanges()}
            >
              Cancel
            </button>
            <button 
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
              onClick={() => setShowConfirmModal(true)}
              disabled={loading || !hasChanges()}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Confirm Changes</h3>
              <p className="mb-6">
                Are you sure you want to save these changes to organization settings?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setShowConfirmModal(false)}
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

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4 text-green-700">Success</h3>
              <p className="mb-6">
                Organization settings updated successfully!
              </p>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                  onClick={() => setShowSuccessModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationalSettings;