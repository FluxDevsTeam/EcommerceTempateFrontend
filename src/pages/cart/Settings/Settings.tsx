import { useState } from "react";
import { Link } from "react-router-dom";
import PersonalInfo from "./settings component/Personal-Info";
import ChangeEmail from "./settings component/Change-Email";
import PasswordChange from "./settings component/Password-Change";
import DeleteAccount from "./settings component/Delete-Account";
import { FiUser, FiMail, FiLock, FiTrash2 } from "react-icons/fi";

const GeneralSettings = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal Info", icon: <FiUser /> },
    { id: "email", label: "Email", icon: <FiMail /> },
    { id: "password", label: "Password", icon: <FiLock /> },
    { id: "delete", label: "Delete Account", icon: <FiTrash2 /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header and Breadcrumbs */}
        <div className="mb-8">
          <h1 className="text-3xl font-semi-bold capitalize mb-2">
            Account Settings
          </h1>
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
            {activeTab === "delete" && <DeleteAccount />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
