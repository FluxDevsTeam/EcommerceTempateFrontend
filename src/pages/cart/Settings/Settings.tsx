import { useState } from "react";
import { Link } from "react-router-dom";
import PersonalInfo from "./settings component/Personal-Info";
import ChangeEmail from "./settings component/Change-Email";
import PasswordChange from "./settings component/Password-Change";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

const GeneralSettings = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal Info", icon: <FiUser /> },
    { id: "email", label: "Email", icon: <FiMail /> },
    { id: "password", label: "Password", icon: <FiLock /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header and Breadcrumbs */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span className="mx-2">›</span>
            <span>Settings</span>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 flex flex-wrap justify-center md:justify-start gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all
                ${
                  activeTab === tab.id
                    ? "bg-black text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {tab.icon}
              <span className="hidden md:flex">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-1">
            {activeTab === "personal" && <PersonalInfo />}
            {activeTab === "email" && <ChangeEmail />}
            {activeTab === "password" && <PasswordChange />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
