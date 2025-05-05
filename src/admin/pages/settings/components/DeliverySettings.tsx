import { useState } from "react";

const DeliverySettings = () => {
  const [formData, setFormData] = useState({
    baseFee: '',
    feePerKm: '',
    weightFee: '', // Fixed typo from "weighFee" to "weightFee"
    sizeFee: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = () => {
    console.log('Saving changes:', formData);
    // Implementation for saving data would go here
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account');
      // Implementation for account deletion would go here
    }
  };
  
  return (
    <div> {/* Added root div wrapper to match other components */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6">Delivery Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Base Fee</label>
            <input
              type="text"
              name="baseFee"
              value={formData.baseFee}
              onChange={handleChange}
              placeholder="Enter Base Fee" // Improved placeholder text
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Fee per km</label>
            <input
              type="text"
              name="feePerKm"
              value={formData.feePerKm}
              onChange={handleChange}
              placeholder="Enter Fee per km" // Fixed incorrect placeholder
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Size Fee</label>
            <input
              type="text"
              name="sizeFee"
              value={formData.sizeFee}
              onChange={handleChange}
              placeholder="Enter Size Fee"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Weight Fee</label> {/* Fixed typo in label */}
            <input
              type="text"
              name="weightFee" /* Fixed property name to match state */
              value={formData.weightFee} /* Updated to match corrected state property */
              onChange={handleChange}
              placeholder="Enter Weight Fee" /* Added appropriate placeholder */
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <button 
          className="text-red-500 font-medium"
          onClick={handleDelete}
        >
          Delete Account
        </button>
      </div>  

      <div className="mb-6">
        <div className="flex justify-end space-x-4 mb-8">
          <button className="px-6 py-2 border border-gray-300 rounded-md">
            Cancel
          </button>
          <button 
            className="px-6 py-2 bg-gray-800 text-white rounded-md"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliverySettings;