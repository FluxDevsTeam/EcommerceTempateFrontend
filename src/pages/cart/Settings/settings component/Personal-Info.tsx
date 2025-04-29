import { useState, useEffect } from "react";

const PersonalInfo = () => {
  const baseURL = `https://ecommercetemplate.pythonanywhere.com`;

  const [personalInfo, setPersonalInfo] = useState({
    new_first_name: "",
    new_last_name: "",
    new_phone_number: "",
    // email: "",
    // country: "",
    // cityState: "",
    // postalCode: "",
  });

	const [passwordFormData, setPasswordFormData] = useState({
		password: ""
	})

  const [infoSubmitMsg, setInfoSubmitMsg] = useState<string | null>(null);
  const [isInfoSubmitMsgOpen, setIsInfoSubmitMsgOpen] =
    useState<boolean>(false);
    const [infoSubmitResponseStatus, setInfoSubmitResponseStatus] = useState<number | null>(null);

    const [passwordSubmitMsg, setPasswordSubmitMsg] = useState<any | null>(null);
  const [isPasswordSubmitMsgOpen, setIsPasswordSubmitMsgOpen] =
    useState<boolean>(false);
  const [isRequestingChange, setIsRequestingChange] = useState<boolean>(false);
  const [isSavingPassword, setIsSavingPassword] = useState<boolean>(false);
  const [userProfileDeets, setUserProfileDeets] = useState<any>([]);


  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    //   get user profile details
    const getUserProfileDeets = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
  
      try {
        const response = await fetch(`${baseURL}/auth/profile/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${accessToken}`,
          },
        });
  
        const logData = await response.json();
        console.log(logData);
  
        setUserProfileDeets(logData);
      } catch (error) {}
    };
  
    useEffect(() => {
      getUserProfileDeets();
    }, []);

  const personalInfoPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Access token not found");
      // Optionally set an error message and show the modal here too
      setInfoSubmitMsg("Authentication error. Please log in again.");
      setIsInfoSubmitMsgOpen(true);
      return;
    }

    if (!personalInfo.new_first_name || !personalInfo.new_last_name || !personalInfo.new_phone_number) {
        setInfoSubmitMsg("Please fill in all fields for the profile change request.");
        setIsInfoSubmitMsgOpen(true);
        return;
    }

    setIsRequestingChange(true);

    const personalInfoPayload = {
      new_first_name: personalInfo.new_first_name,
      new_last_name: personalInfo.new_last_name,
      new_phone_number: personalInfo.new_phone_number,
    };

    try {
      const response = await fetch(
        `${baseURL}/auth/profile/request-profile-change/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${accessToken}`,
          },
          body: JSON.stringify(personalInfoPayload),
        }
      );

      setInfoSubmitResponseStatus(response.status);

      const logData = await response.json();
      console.log(logData);

      const message = logData?.data || logData?.message || logData?.detail || (response.ok ? "Request submitted. Please verify with your password." : "Request failed.");
      setInfoSubmitMsg(message);
      setIsInfoSubmitMsgOpen(true);
      setIsRequestingChange(false);

      if (response.ok || response.status === 200) {
         const passwordForm = document?.querySelector('form:nth-of-type(2)');
         passwordForm?.classList.remove("hidden");
      } else {
         console.error("Failed to request profile change", logData);
      }

    } catch (error) {
      console.error("Error requesting profile change:", error);
      setInfoSubmitMsg("An error occurred while submitting the request. Please try again.");
      setIsInfoSubmitMsgOpen(true); // <-- Show modal on error
      setIsRequestingChange(false); // <-- Stop loading AFTER modal state is set
    }
  };

	const passwordPost = async (e: React.FormEvent<HTMLFormElement>) => { // <-- Corrected event type
		e.preventDefault();
		const accessToken = localStorage.getItem("accessToken");

		if (!accessToken) {
      console.error("Access token not found");
      setPasswordSubmitMsg("Authentication error. Please log in again.");
      setIsPasswordSubmitMsgOpen(true);
      return;
    }

    // Optional: Check if password is empty before submitting
    if (!passwordFormData.password) {
        setPasswordSubmitMsg("Please enter your password to verify.");
        setIsPasswordSubmitMsgOpen(true);
        return;
    }

    setIsSavingPassword(true); // <-- Start loading

    try {
      const response = await fetch(
        `${baseURL}/auth/profile/verify-profile-change/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${accessToken}`,
          },
          body: JSON.stringify({
            password: passwordFormData.password,
          }),
        }
      );

      const logData = await response.json();
      console.log(logData);

      // Determine message based on response
      const message = logData?.data || logData?.message || logData?.detail || (response.ok ? "Profile updated successfully!" : "Verification failed.");
      setPasswordSubmitMsg(message);
      setIsPasswordSubmitMsgOpen(true); // <-- Show modal
      setIsSavingPassword(false); // <-- Stop loading AFTER modal state is set

      if (response.ok) {
        await getUserProfileDeets(); // Refresh user details on success

        // Clear forms on success
        setPersonalInfo({
          new_first_name: "",
          new_last_name: "",
          new_phone_number: "",
        });
        setPasswordFormData({
          password: "",
        });

        // Hide the password form again after success
        const passwordForm = document?.querySelector('.passwordForm');
        passwordForm?.classList.add("hidden");

      } else {
        console.error("Failed to verify profile change", logData);
        // Optionally clear only the password field on failure
        // setPasswordFormData({ password: "" });
      }

    } catch (error) {
      console.error("Error verifying profile change:", error);
      setPasswordSubmitMsg("An error occurred during verification. Please try again.");
      setIsPasswordSubmitMsgOpen(true); // <-- Show modal on error
      setIsSavingPassword(false); // <-- Stop loading AFTER modal state is set
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Personal Information</h1>

      <div className="mb-16 shadow-2xl px-6 py-10 rounded-3xl md:rounded-md md:shadow-xl">

        {/* Display Current User Info */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Current Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-600 w-28">Full Name:{" "}</span>
              <span className="text-sm text-gray-800">
                {userProfileDeets?.first_name || " "}{" "}
                {userProfileDeets?.last_name || " "}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600 w-28">Phone Number:</span>
              <span className="text-sm text-gray-800">
                {userProfileDeets?.phone_number || " "}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}

        <form onSubmit={personalInfoPost} className="mb-5">
          {/* first and last name */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-2 text-sm">First Name</label>
              <input
                type="text"
                name="new_first_name"
                value={personalInfo.new_first_name}
                onChange={handlePersonalInfoChange}
                placeholder="e.g John"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Last Name</label>
              <input
                type="text"
                name="new_last_name"
                value={personalInfo.new_last_name}
                onChange={handlePersonalInfoChange}
                placeholder="e.g Doe"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* email and new_phone_number */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* <div className="mb-3">
              <label className="block mb-2 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange} // Add this line
                placeholder="e.g johndoe@gmail.com"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div> */}
            <div>
              <label className="block mb-2 text-sm">New phone number</label>
              <input
                type="tel"
                minLength={11}
                name="new_phone_number"
                value={personalInfo.new_phone_number}
                onChange={handlePersonalInfoChange}
                placeholder="Enter new phone number"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <button
            // Disable if loading OR if inputs are empty
            disabled={
              isRequestingChange || // <-- Add loading state check
              !personalInfo.new_first_name ||
              !personalInfo.new_last_name ||
              !personalInfo.new_phone_number
            }
            type="submit"
            className={`w-fit text-xs px-3 py-2 text-white rounded-lg mb-1
						${
              // Style as disabled if loading OR inputs are empty
              isRequestingChange ||
              !personalInfo.new_first_name ||
              !personalInfo.new_last_name ||
              !personalInfo.new_phone_number
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-blue-600 transition-colors" // Use bg-black for default enabled state
            }`}
          >
            {/* Change text based on loading state */}
            {isRequestingChange ? "Requesting..." : "Request Change"}
          </button>

          {/* country, city and state */}
          {/* <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-2 text-sm">Country</label>
              <input
                type="text"
                name="country"
                value={personalInfo.country}
                onChange={handlePersonalInfoChange} // Add this line
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
                onChange={handlePersonalInfoChange} // Add this line
                placeholder="City/State"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div> */}

          {/* postal code */}
          {/* <div>
            <label className="block mb-2 text-sm">Postal/Zip Code</label>
            <input
              type="text"
              name="postalCode"
              value={personalInfo.postalCode}
              onChange={handlePersonalInfoChange} // Add this line
              placeholder="e.g John Doe"
              className="w-fit p-3 border border-gray-300 rounded-lg"
            />
          </div> */}
        </form>

        {/* password */}
        <form onSubmit={passwordPost} className="passwordForm hidden">
          <div>
            <label className="block mb-2 text-sm">Verify password</label>
            <input
              type="password"
              className="w-fit p-3 border border-gray-300 rounded-lg"
              name="password"
							onChange={(e)=> setPasswordFormData({...passwordFormData, password: e.target.value})}
              required
            />
          </div>

          {/* Action Buttons for name, and number change */}
          <div className="flex justify-end mt-8">
            <button
              // Disable if saving OR if password input is empty
              disabled={isSavingPassword || !passwordFormData.password}
              type="submit"
              className={`px-6 py-3 text-white rounded-full transition-colors
                ${
                  isSavingPassword || !passwordFormData.password
                    ? "bg-gray-400 cursor-not-allowed" // Disabled style
                    : "bg-black hover:bg-gray-700" // Default enabled style
                }
              `}
            >
              {/* Change text based on loading state */}
              {isSavingPassword ? "Saving..." : "Save"}
            </button>
          </div>
        </form>

        {isInfoSubmitMsgOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Profile Change Status
								{/* kkk */}
              </h3>
              <p className={`mb-4 ${infoSubmitResponseStatus !== 200 ? "text-red-500" : ""}`}>{infoSubmitMsg || "Processing..."}</p>
              <button
                onClick={() => {
                  setIsInfoSubmitMsgOpen(false);
                }}
                className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {isPasswordSubmitMsgOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Info Change Status
              </h3>
              {/* Apply conditional text color */}
              <p className={`mb-4`}>{passwordSubmitMsg || (passwordSubmitMsg && passwordSubmitMsg.password && passwordSubmitMsg.password[0]) || "No message available"}</p>
              <button
                onClick={() => {
                  setIsPasswordSubmitMsgOpen(false);
                }}
                className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
