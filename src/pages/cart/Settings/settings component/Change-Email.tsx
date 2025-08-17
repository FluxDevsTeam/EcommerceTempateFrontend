import { useState, useEffect } from "react";
import validator from "validator";
import OtpInput from "react-otp-input";

const ChangeEmail = () => {
  const baseURL = `https://shop.fluxdevs.com`;

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [emailChangeFormData, setEmailChangeFormData] = useState({
    new_email: "",
    password: "",
  });

  const [otpFormData, setOtpFormData] = useState({
    otp: "",
  });

  const [emailPostMsg, setEmailPostMsg] = useState<string | null>(null);
  const [isEmailPostMsgModalOpen, setIsEmailPostMsgModalOpen] = useState(false);

  const [OTPMsg, setOTPMsg] = useState<string | null>(null);
  const [isOTPMsgModalOpen, setIsOTPMsgModalOpen] = useState(false);

  const [OTPResendMsg, setOTPResendMsg] = useState<string | null>(null);
  const [isOTPResendMsgModalOpen, setIsOTPResendMsgModalOpen] = useState(false);

  const [userProfileDeets, setUserProfileDeets] = useState<any>([]);

  const [isEmailChangeSuccess, setIsEmailChangeSuccess] = useState<boolean | null>(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(0); // Time in seconds
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [isSavingOTP, setIsSavingOTP] = useState<boolean>(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailChangeFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //////////////////////////////////////////////////////////////
  const emailchange = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    if (!isValidEmail(emailChangeFormData.new_email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!accessToken) {
      console.error("Access token not found");
      return;
    }

    setIsButtonDisabled(true);

    try {
      const response = await fetch(
        `${baseURL}/auth/profile/request-email-change/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${accessToken}`,
          },
          body: JSON.stringify({
            new_email: emailChangeFormData.new_email,
            password: emailChangeFormData.password,
          }),
        }
      );

      const logData = await response.json();
      
      
      

      const otpForm = document?.querySelector(".emailOtpForm");
        

      setIsEmailChangeSuccess(response.ok);

      const message = logData?.data || logData?.message || logData?.detail || (response.ok ? "Request successful." : "An error occurred.");
      setEmailPostMsg(message);
      setIsEmailPostMsgModalOpen(true);
      setIsButtonDisabled(false);

      setOtpFormData({
        otp: "",
      });

      if (response.ok) {
        otpForm?.classList.remove("hidden");
      } else {
        console.error("Email change request failed:", logData);
        
      }
    } catch (error) {
      console.error("Error during email change request:", error);
      setIsEmailChangeSuccess(false);
      setEmailPostMsg("Failed to send request. Please try again.");
      setIsEmailPostMsgModalOpen(true);
      setIsButtonDisabled(false);
    }
  };

  const isValidEmail = (email: string): boolean => {
    return validator.isEmail(email);
  };

  const otpPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Access token not found");
      setOTPMsg("Authentication error. Please log in again.");
      setIsOTPMsgModalOpen(true); 
      return;
    }


    setIsSavingOTP(true);

    try {
      const response = await fetch(
        `${baseURL}/auth/profile/verify-email-change/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${accessToken}`,
          },
          body: JSON.stringify({
            otp: otpFormData.otp,
          }),
        }
      );

      const otpForm = document?.querySelector(".emailOtpForm");
      const logData = await response.json();
      

      // Determine message based on response
      const message = logData?.data || logData?.message || logData?.detail || (response.ok ? "Email updated successfully!" : "OTP verification failed.");
      setOTPMsg(message);
      setIsOTPMsgModalOpen(true); 
      setIsSavingOTP(false); 

      if (response.ok) {
        await getUserProfileDeets(); 

        
        setEmailChangeFormData({
          new_email: "",
          password: "",
        });
        setOtpFormData({
          otp: "",
        });

        otpForm?.classList.add('hidden'); 
        setIsTimerActive(false); 
        setTimeLeft(0);

      } else {
        console.error("OTP verification failed:", logData);
        
        
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setOTPMsg("An error occurred during verification. Please try again.");
      setIsOTPMsgModalOpen(true); 
      setIsSavingOTP(false); 
    }
  };

  const resendOTP = async () => {
    if (resendDisabled) {
      
      return;
    }

    
    const accessToken = localStorage.getItem("accessToken");
  
    if (!accessToken) {
      console.error("Access token not found, user might not be logged in");
      return;
    }
  
    setResendDisabled(true);
  
    try {
      const response = await fetch(
        `${baseURL}/auth/profile/resend-email-change-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${accessToken}`,
          },
        }
      );
  
      const logData = await response.json();
      
  
      setOTPResendMsg(logData.data || logData.message || "Processing...");
      setIsOTPResendMsgModalOpen(true);
  
      if (response.ok) {
        setTimeLeft(60);
        setIsTimerActive(true);
      } else {
        console.error("OTP resend failed:", logData);
        setResendDisabled(false);
      }
    } catch (error) {
      console.error("Error during OTP resend:", error);
      setOTPResendMsg("Failed to resend OTP. Please try again.");
      setIsOTPResendMsgModalOpen(true);
      // Re-enable button on catch
      setResendDisabled(false);
    }
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
      

      setUserProfileDeets(logData);
    } catch (error) {}
  };

  useEffect(() => {
    getUserProfileDeets();
  }, []);

  // Timer useEffect
  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) {
      setIsTimerActive(false);
      setResendDisabled(false);
      return;
    }
  
    // Set interval to decrease time every second
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
  

    return () => clearInterval(intervalId);
  }, [isTimerActive, timeLeft]);
  
  // Helper function to format time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-md">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Email Settings</h2>
            <p className="text-gray-500 text-sm">Manage your email preferences</p>
          </div>
        </div>

        <form onSubmit={emailchange} className="space-y-6">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Email Address
            </label>
            <input
              type="email"
              value={userProfileDeets?.email ?? ""}
              readOnly
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Email Address
            </label>
            <input
              type="email"
              name="new_email"
              value={emailChangeFormData.new_email}
              onChange={handleEmailChange}
              placeholder="Enter new email address"
              autocomplete="new-password"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {emailChangeFormData.new_email && !isValidEmail(emailChangeFormData.new_email) && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Please enter a valid email address
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verify With Your Password
            </label>
            <input
              type="password"
              name="password"
              value={emailChangeFormData.password}
              onChange={handleEmailChange}
              autocomplete="new-password"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            disabled={isButtonDisabled || !emailChangeFormData.new_email || !emailChangeFormData.password || !isValidEmail(emailChangeFormData.new_email)}
            type="submit"
            className={`
              px-6 py-3 rounded-lg text-white font-medium transition-all
              ${isButtonDisabled || !emailChangeFormData.new_email || !emailChangeFormData.password || !isValidEmail(emailChangeFormData.new_email)
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-100"
              }
            `}
          >
            {isButtonDisabled ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Please Wait...
              </div>
            ) : (
              "Change Email"
            )}
          </button>
        </form>

        {/* OTP Form */}
        <form onSubmit={otpPost} className="emailOtpForm hidden mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Verify Email Change</h3>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Enter Verification Code
            </label>
            <div className="flex items-center gap-2">
              <OtpInput
                value={otpFormData.otp}
                onChange={(otpValue: string) => setOtpFormData({ otp: otpValue })}
                numInputs={6}
                renderSeparator={<span className="w-2"></span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    style={{ width: "45px" }}
                    className="h-[45px] text-center text-xl font-bold border-2 border-gray-300 rounded-lg 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                    transition-all duration-200 shadow-sm
                    disabled:bg-gray-50 disabled:text-gray-400
                    [-webkit-appearance:none] [appearance:none] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    type="number"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                  />
                )}
                shouldAutoFocus={true}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSavingOTP || !otpFormData.otp || otpFormData.otp.length !== 6}
                className={`
                  px-6 py-3 rounded-lg text-white font-medium transition-all
                  ${isSavingOTP || !otpFormData.otp || otpFormData.otp.length !== 6
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-100"
                  }
                `}
              >
                {isSavingOTP ? "Verifying..." : "Verify Email"}
              </button>

              <button
                type="button"
                onClick={!resendDisabled ? resendOTP : undefined}
                disabled={resendDisabled}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${resendDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50"
                  }
                `}
              >
                Resend Code
                {isTimerActive && <span className="ml-2">({formatTime(timeLeft)})</span>}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Keep existing modals but update their styling */}
      {/* Email Change Status Modal */}
      {isEmailPostMsgModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Email Change Status</h3>
            {/* Apply conditional text color */}
            <p className={`mb-4 ${
              isEmailChangeSuccess === true
                ? 'text-black'
                : isEmailChangeSuccess === false
                ? 'text-red-600'
                : 'text-gray-600' 
            }`}>
              {emailPostMsg || "Processing..."}
            </p>
            <button
              onClick={() => {
                setIsEmailPostMsgModalOpen(false);
                setIsEmailChangeSuccess(null); // Reset status on close
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* otp status modal */}
      {isOTPMsgModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            {/* <h3 className="text-lg font-semibold mb-4">Email Change Status</h3> */}
            <p className="mb-4">{OTPMsg || "Processing 23..."}</p>
            <button
              onClick={() => setIsOTPMsgModalOpen(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* otp resend modal */}
      {isOTPResendMsgModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            {/* <h3 className="text-lg font-semibold mb-4">Email Change Status</h3> */}
            <p className="mb-4">{OTPResendMsg || "Processing 3..."}</p>
            <button
              onClick={() => setIsOTPResendMsgModalOpen(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeEmail;
