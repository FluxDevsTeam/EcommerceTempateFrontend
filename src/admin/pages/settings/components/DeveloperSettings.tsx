import { useState } from "react";

const DeveloperSettings = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    contact: '',
    termsOfService: '',
    backendRoute: '',
    frontendRoute: '',
    orderRoute: '',
    paymentFailedUrl: '',
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
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6">Developer Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Enter Business Name" 
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter Contact"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Terms of Service</label>
            <input
              type="text"
              name="termsOfService"
              value={formData.termsOfService}
              onChange={handleChange}
              placeholder="Enter Terms of Service"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Backend Route</label>
            <input
              type="text" 
              name="backendRoute"
              value={formData.backendRoute} 
              onChange={handleChange}
              placeholder="Enter Backend Route" 
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Frontend Route</label>
            <input
              type="text"
              name="frontendRoute"
              value={formData.frontendRoute}
              onChange={handleChange}
              placeholder="Enter Frontend Route"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Order Route</label>
            <input
              type="text"
              name="orderRoute" 
              value={formData.orderRoute}
              onChange={handleChange}
              placeholder="Enter Order Route"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div>
            <label className="block text-sm font-medium mb-2">Payment Failed URL</label> 
            <input
              type="text"
              name="paymentFailedUrl" 
              value={formData.paymentFailedUrl}
              onChange={handleChange}
              placeholder="Enter Payment Failed URL"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
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

export default DeveloperSettings;