import { useState } from "react";
import { Link } from "react-router-dom";

<<<<<<< HEAD
const GeneralSettings = () => {
=======
const Settings = () => {
>>>>>>> 77deae6a75272dcedd736d8ff51733b4e73d9031
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    cityState: "",
    postalCode: "",
  });

  const [emailChange, setEmailChange] = useState({
    oldEmail: "",
    otp: "",
    newEmail: "",
  });

  const [passwordChange, setPasswordChange] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailChange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordChange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-poppins">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span>Settings</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Personal Information</h1>

      <div className="space-y-6">
        {/* Personal Information Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm">First Name</label>
            <input
              type="text"
              name="firstName"
              value={personalInfo.firstName}
              onChange={handlePersonalInfoChange}
              placeholder="e.g John"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={personalInfo.lastName}
              onChange={handlePersonalInfoChange}
              placeholder="e.g Doe"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={personalInfo.email}
              onChange={handlePersonalInfoChange}
              placeholder="e.g johndoe@gmail.com"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm">Phone</label>
            <input
              type="tel"
              name="phone"
              value={personalInfo.phone}
              onChange={handlePersonalInfoChange}
              placeholder="Enter Phone Number"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm">Country</label>
            <input
              type="text"
              name="country"
              value={personalInfo.country}
              onChange={handlePersonalInfoChange}
              placeholder="Select Country"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm">City/State</label>
            <input
              type="text"
              name="cityState"
              value={personalInfo.cityState}
              onChange={handlePersonalInfoChange}
              placeholder="City/State"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm">Postal/Zip Code</label>
          <input
            type="text"
            name="postalCode"
            value={personalInfo.postalCode}
            onChange={handlePersonalInfoChange}
            placeholder="e.g John Doe"
            className="w-fit p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Change Email Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 mt-14">Change Email</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">Old Email Address</label>
              <input
                type="email"
                name="oldEmail"
                value={emailChange.oldEmail}
                onChange={handleEmailChangeInput}
                placeholder="e.g jonesdexter@xyz.com"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                Enter the OTP sent to you
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="otp"
                  value={emailChange.otp}
                  onChange={handleEmailChangeInput}
                  placeholder="Enter OTP"
                  className="w-fit p-3 border border-gray-300 rounded-lg"
                />
                <span className="ml-2 text-sm text-blue-500">
                  Resend <br/>
                  <span className="text-gray-900">(2:58)</span>
                </span>
              </div>
              {emailChange.otp && (
                <p className="text-red-500 text-sm mt-1">Incorrect OTP</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm">New Email Address</label>
              <input
                type="email"
                name="newEmail"
                value={emailChange.newEmail}
                onChange={handleEmailChangeInput}
                placeholder="e.g jonesdexter@xyz.com"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 mt-20">Change Password</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordChange.oldPassword}
                onChange={handlePasswordChangeInput}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordChange.newPassword}
                onChange={handlePasswordChangeInput}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm">Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordChange.confirmNewPassword}
                onChange={handlePasswordChangeInput}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button className="px-6 py-3 border border-gray-300 rounded-full">
            Cancel
          </button>
          <button className="px-6 py-3 bg-black text-white rounded-full">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default GeneralSettings;
=======
export default Settings;
>>>>>>> 77deae6a75272dcedd736d8ff51733b4e73d9031
