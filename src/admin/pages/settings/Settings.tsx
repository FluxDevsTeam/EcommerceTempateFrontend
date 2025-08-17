import React, { useState } from 'react';
import OrganizationalSettings from "./components/OrganizationalSettings";
import DeveloperSettings from "./components/DeveloperSettings";
import DeliverySettings from "./components/DeliverySettings";
import { FiBriefcase, FiTruck, FiCpu } from 'react-icons/fi'; // Removed FiSettings as it was a placeholder

interface Tab {
  id: string;
  label: string;
  icon: JSX.Element;
  component: JSX.Element;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('organization'); // Set 'organization' as the default active tab

  const tabs: Tab[] = [
    {
      id: 'organization',
      label: 'Organization',
      icon: <FiBriefcase size={18} />,
      component: <OrganizationalSettings />,
    },
    {
      id: 'delivery',
      label: 'Delivery',
      icon: <FiTruck size={18} />,
      component: <DeliverySettings />,
    },
    {
      id: 'developer',
      label: 'Developer',
      icon: <FiCpu size={18} />,
      component: <DeveloperSettings />,
    },
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
            Application Settings
          </h1>
          <p className="mt-2 text-md text-gray-500 max-w-3xl">
            Configure and manage various modules of your application. Select a category to view or modify its settings.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8 flex flex-wrap border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2.5 px-5 py-3.5 -mb-px font-medium text-sm 
                focus:outline-none transition-all duration-200 ease-in-out
                ${
                  activeTab === tab.id
                    ? 'border-b-2 border-gray-800 text-gray-900 bg-white rounded-t-md shadow-sm'
                    : 'border-b-2 border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area: Renders the component of the active tab */}
        <div className="bg-white shadow-xl rounded-b-lg rounded-tr-lg ring-1 ring-gray-200">
          <div className="p-6 sm:p-8 lg:p-10">
            {currentTab ? currentTab.component : <div>Please select a settings category.</div>}
          </div>
        </div>

        {/* Optional Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            SHOP Admin Panel &copy; {new Date().getFullYear()} | Empowering Your E-commerce
          </p>
        </div>
      </div>
    </div>
  );
}