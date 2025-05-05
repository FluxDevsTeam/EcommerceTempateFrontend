import OrganizationalSettings from "./components/OrganizationalSettings";
import DeveloperSettings from "./components/DeveloperSettings";
import DeliverySettings from "./components/DeliverySettings";







export default function SettingsPage() {

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">Update your settings and a preference</p>
        </div>
        
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold">General Settings</h2>
      </div>

      <OrganizationalSettings/>
      <DeveloperSettings/>
      <DeliverySettings/>
      
  

  
    </div>
  );
}