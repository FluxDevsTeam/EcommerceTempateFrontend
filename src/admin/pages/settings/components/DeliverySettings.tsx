import { useState, useEffect } from "react";
import axios from "axios";
import { formatCurrency } from "../../../utils/formatting";

interface DeliverySettings {
  base_fee: string;
  fee_per_km: string;
  weight_fee: string;
  size_fee: string;
}

const DeliverySettings = () => {
  const [formData, setFormData] = useState<DeliverySettings>({
    base_fee: '',
    fee_per_km: '',
    weight_fee: '',
    size_fee: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<DeliverySettings | null>(null);

  useEffect(() => {
    fetchDeliverySettings();
  }, []);

  const fetchDeliverySettings = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      const response = await axios.get<DeliverySettings>(
        'https://api.fluxdevs.com/api/v1/admin/delivery-settings/',
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
      setError('Failed to load delivery settings');
      
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
  
  const handleSaveConfirm = () => {
    setShowConfirmModal(false);
    handleSave();
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const apiFormData = {
        base_fee: formData.base_fee,
        fee_per_km: formData.fee_per_km,
        weight_fee: formData.weight_fee,
        size_fee: formData.size_fee
      };
      const token = localStorage.getItem('accessToken');

      await axios.patch<DeliverySettings>(
        'https://api.fluxdevs.com/api/v1/admin/delivery-settings/',
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
      setError('Failed to update delivery settings');
      
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    if (!initialData) return false;
    return (
      formData.base_fee !== initialData.base_fee ||
      formData.fee_per_km !== initialData.fee_per_km ||
      formData.weight_fee !== initialData.weight_fee ||
      formData.size_fee !== initialData.size_fee
    );
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData(initialData);
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

      <div className="mb-8 bg-gray-100 p-4 rounded-lg shadow border border-gray-200">
        <h3 className="font-medium text-lg mb-3">Current Delivery Fees</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-r border-gray-200 pr-4">
            <p className="text-sm text-gray-500">Base Fee</p>
            <p className="font-medium text-lg">
              {initialData?.base_fee ? formatCurrency(initialData.base_fee) : 'Not set'}
            </p>
          </div>
          <div className="border-r border-gray-200 pr-4">
            <p className="text-sm text-gray-500">Per Kilometer</p>
            <p className="font-medium text-lg">
              {initialData?.fee_per_km ? `${formatCurrency(initialData.fee_per_km)}/km` : 'Not set'}
            </p>
          </div>
          <div className="border-r border-gray-200 pr-4">
            <p className="text-sm text-gray-500">Weight Fee</p>
            <p className="font-medium text-lg">
              {initialData?.weight_fee ? `${formatCurrency(initialData.weight_fee)}/kg` : 'Not set'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Size Fee</p>
            <p className="font-medium text-lg">
              {initialData?.size_fee ? `${formatCurrency(initialData.size_fee)}/m³` : 'Not set'}
            </p>
          </div>
        </div>
      </div>
      
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
              name="weight_fee"
              value={formData.weight_fee}
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
              Are you sure you want to save these changes to delivery settings?
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
              Delivery settings updated successfully!
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
  );
};

export default DeliverySettings;