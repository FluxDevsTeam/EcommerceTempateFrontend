import { useState, useEffect } from "react";
import axios from "axios";

interface DeliverySettings {
  base_fee: string;
  fee_per_km: string;
  weigh_fee: string;
  size_fee: string;
}

const DeliverySettings = () => {
  const [formData, setFormData] = useState<DeliverySettings>({
    base_fee: '',
    fee_per_km: '',
    weigh_fee: '',
    size_fee: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch delivery settings on component mount
  useEffect(() => {
    fetchDeliverySettings();
  }, []);

  const fetchDeliverySettings = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      const response = await axios.get<DeliverySettings>(
        'https://ecommercetemplate.pythonanywhere.com/api/v1/admin/delivery-settings/',
        {
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      // Updated to handle direct object response instead of array
      if (response.data) {
        setFormData(response.data);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load delivery settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    try {
      setLoading(true);
      
      const apiFormData = {
        base_fee: formData.base_fee,
        fee_per_km: formData.fee_per_km,
        weigh_fee: formData.weigh_fee,
        size_fee: formData.size_fee
      };
      const token = localStorage.getItem('accessToken');

      await axios.patch<DeliverySettings>(
        'https://ecommercetemplate.pythonanywhere.com/api/v1/admin/delivery-settings/',
        apiFormData,
        {
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      setSuccessMessage('Delivery settings updated successfully');
      setError(null);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to update delivery settings');
      console.error('Error updating delivery settings:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !formData.base_fee) {
    return <div className="p-4">Loading delivery settings...</div>;
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
        <h2 className="text-xl font-bold mb-6">Delivery Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Base Fee</label>
            <input
              type="text"
              name="base_fee"
              value={formData.base_fee}
              onChange={handleChange}
              placeholder="Enter Base Fee"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Fee per km</label>
            <input
              type="text"
              name="fee_per_km"
              value={formData.fee_per_km}
              onChange={handleChange}
              placeholder="Enter Fee per km"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Size Fee</label>
            <input
              type="text"
              name="size_fee"
              value={formData.size_fee}
              onChange={handleChange}
              placeholder="Enter Size Fee"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Weight Fee</label>
            <input
              type="text"
              name="weigh_fee"
              value={formData.weigh_fee}
              onChange={handleChange}
              placeholder="Enter Weight Fee"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-end space-x-4 mb-8">
          <button 
            className="px-6 py-2 border border-gray-300 rounded-md"
            onClick={fetchDeliverySettings}
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

export default DeliverySettings;