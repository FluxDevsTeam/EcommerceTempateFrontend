import { useState, useEffect } from "react";

const PersonalInfo = () => {
  const baseURL = `http://kidsdesignecommerce.pythonanywhere.com`;

  const [personalInfo, setPersonalInfo] = useState({
    new_first_name: "",
    new_last_name: "",
    new_phone_number: "",
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

    useEffect(() => {
      if (userProfileDeets) {
        setPersonalInfo({
          new_first_name: userProfileDeets.first_name || "",
          new_last_name: userProfileDeets.last_name || "",
          new_phone_number: userProfileDeets.phone_number || "",
        });
      }
    }, [userProfileDeets]);

  const personalInfoPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Access token not found");
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
      setIsInfoSubmitMsgOpen(true);
      setIsRequestingChange(false);
    }
  };

	const passwordPost = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const accessToken = localStorage.getItem("accessToken");

		if (!accessToken) {
      console.error("Access token not found");
      setPasswordSubmitMsg("Authentication error. Please log in again.");
      setIsPasswordSubmitMsgOpen(true);
      return;
    }

    if (!passwordFormData.password) {
        setPasswordSubmitMsg("Please enter your password to verify.");
        setIsPasswordSubmitMsgOpen(true);
        return;
    }

    setIsSavingPassword(true);

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

      const message = logData?.data || logData?.message || logData?.detail || (response.ok ? "Profile updated successfully!" : "Verification failed.");
      setPasswordSubmitMsg(message);
      setIsPasswordSubmitMsgOpen(true);
      setIsSavingPassword(false);

      if (response.ok) {
        await getUserProfileDeets();

        setPersonalInfo({
          new_first_name: "",
          new_last_name: "",
          new_phone_number: "",
        });
        setPasswordFormData({
          password: "",
        });

        const passwordForm = document?.querySelector('.passwordForm');
        passwordForm?.classList.add("hidden");

      } else {
        console.error("Failed to verify profile change", logData);
      }

    } catch (error) {
      console.error("Error verifying profile change:", error);
      setPasswordSubmitMsg("An error occurred during verification. Please try again.");
      setIsPasswordSubmitMsgOpen(true);
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="bg-white rounded-2xl p-8 shadow-md">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
            <p className="text-gray-500 text-sm">Update your personal details</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Information</h3>
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 min-w-[120px]">Full Name:</span>
              <span className="font-medium">
                {userProfileDeets?.first_name || "–"} {userProfileDeets?.last_name || "–"}
              </span>
            </div>
            <div className="flex items-center md:gap-4">
              <span className="text-gray-500 min-w-[120px]">Phone Number:</span>
              <span className="font-medium">{userProfileDeets?.phone_number || "–"}</span>
            </div>
          </div>
        </div>

        <form onSubmit={personalInfoPost} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New First Name
              </label>
              <input
                type="text"
                name="new_first_name"
                value={personalInfo.new_first_name}
                onChange={handlePersonalInfoChange}
                placeholder="Enter new first name"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Last Name
              </label>
              <input
                type="text"
                name="new_last_name"
                value={personalInfo.new_last_name}
                onChange={handlePersonalInfoChange}
                placeholder="Enter new last name"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Phone Number
            </label>
            <input
              type="tel"
              name="new_phone_number"
              value={personalInfo.new_phone_number}
              onChange={handlePersonalInfoChange}
              placeholder="Enter new phone number"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            disabled={isRequestingChange || !personalInfo.new_first_name || !personalInfo.new_last_name || !personalInfo.new_phone_number || (personalInfo.new_first_name === userProfileDeets?.first_name && personalInfo.new_last_name === userProfileDeets?.last_name && personalInfo.new_phone_number === userProfileDeets?.phone_number)}
            type="submit"
            className={`
              px-6 py-3 rounded-lg text-white font-medium transition-all
              ${isRequestingChange || !personalInfo.new_first_name || !personalInfo.new_last_name || !personalInfo.new_phone_number || (personalInfo.new_first_name === userProfileDeets?.first_name && personalInfo.new_last_name === userProfileDeets?.last_name && personalInfo.new_phone_number === userProfileDeets?.phone_number)
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-100"
              }
            `}
          >
            {isRequestingChange ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Requesting...
              </div>
            ) : (
              "Request Change"
            )}
          </button>
        </form>

        <form onSubmit={passwordPost} className="passwordForm hidden mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Verify Changes</h3>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Password to Confirm
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              name="password"
              onChange={(e) => setPasswordFormData({...passwordFormData, password: e.target.value})}
              required
            />
          </div>

          <button
            disabled={isSavingPassword || !passwordFormData.password}
            type="submit"
            className={`
              mt-4 px-6 py-3 rounded-lg text-white font-medium transition-all
              ${isSavingPassword || !passwordFormData.password
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-100"
              }
            `}
          >
            {isSavingPassword ? "Saving..." : "Confirm Changes"}
          </button>
        </form>
      </div>

      {isInfoSubmitMsgOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Profile Change Status
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
  );
};

export default PersonalInfo;
