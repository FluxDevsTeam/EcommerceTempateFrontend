import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";

const PasswordChange = () => {
  const baseURL = `https://api.kidsdesigncompany.com`;

  const [passwordChangeFormData, setPasswordChangeFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [otpFormData, setOtpFormData] = useState({
    otp: "",
  });

  const [passwordPostMsg, setPasswordPostMsg] = useState<string | null>(null);
  const [isPasswordPostMsgModalOpen, setIsPasswordPostMsgModalOpen] =
    useState(false);
  const [passwordPostResponseStatus, setPasswordPostResponseStatus] =
    useState<number | null>(null);

  const [OTPMsg, setOTPMsg] = useState<string | null>(null);
  const [isOTPMsgModalOpen, setIsOTPMsgModalOpen] = useState(false);

  const [OTPResendMsg, setOTPResendMsg] = useState<string | null>(null);
  const [isOTPResendMsgModalOpen, setIsOTPResendMsgModalOpen] = useState(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(0); // Time in seconds
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [isRequestingPasswordChange, setIsRequestingPasswordChange] = useState<boolean>(false);

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordChangeFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const passwordChangePost = async (e: React.FormEvent) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Access token not found");
      setPasswordPostMsg("Authentication error. Please log in again.");
      setIsPasswordPostMsgModalOpen(true);
      return;
    }

    // if (passwordChangeFormData.new_password !== passwordChangeFormData.confirm_password) {
    //   setPasswordPostMsg("New password and confirm password do not match.");
    //   setIsPasswordPostMsgModalOpen(true);
    //   return;
    // }

    setIsRequestingPasswordChange(true);

    try {
      const payLoad = {
        old_password: passwordChangeFormData.old_password,
        new_password: passwordChangeFormData.new_password,
        confirm_password: passwordChangeFormData.confirm_password,
      };

      const response = await fetch(
        `${baseURL}/auth/password-change/request-password-change/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${accessToken}`,
          },
          body: JSON.stringify(payLoad),
        }
      );

      setPasswordPostResponseStatus(response.status);

      const logData = await response.json();
      

      const otpForm = document?.querySelector(".passwordChangeOtpForm");

      const message =
        logData?.data ||
        logData?.message ||
        logData?.detail ||
        (response.ok ? "Request successful. Please enter the OTP sent to your email." : "An error occurred.");

      setPasswordPostMsg(message);
      setIsPasswordPostMsgModalOpen(true);
      setIsRequestingPasswordChange(false);

      if (response.ok) {
        otpForm?.classList.remove("hidden");
        setTimeLeft(60);
        setIsTimerActive(true);
      } else {
        console.error("Password change request failed", logData);
        otpForm?.classList.add("hidden");
      }

    } catch (error) {
      console.error(`error during password change post ${error}`);
      setPasswordPostMsg("Failed to send request. Please try again.");
      setIsPasswordPostMsgModalOpen(true);
      setIsRequestingPasswordChange(false);
    }
  };

  const otpPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Access token not found");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}/auth/password-change/verify-password-change/`,
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

      const logData = await response.json();
      

      const otpForm = document?.querySelector(".passwordChangeOtpForm");


      setOTPMsg(logData.data);
      setIsOTPMsgModalOpen(true);

      setPasswordChangeFormData({
        new_password: "",
        old_password: "",
        confirm_password: "",
      });

      setOtpFormData({
        otp: "",
      });

      if (!response.ok) {
        console.error("OTP verification failed:", logData);
      } else {
        otpForm?.classList.add("hidden");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setOTPMsg("Failed to send request. Please try again.");
      setIsOTPMsgModalOpen(true);
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
        `${baseURL}/auth/password-change/resend-otp/`,
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
      setResendDisabled(false);
    }
  };

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
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-md">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-14 w-14 bg-green-50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Password Settings</h2>
            <p className="text-gray-500 text-sm">Update your security preferences</p>
          </div>
        </div>

        <form onSubmit={passwordChangePost} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="old_password"
              value={passwordChangeFormData.old_password}
              onChange={handlePasswordInput}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="new_password"
                value={passwordChangeFormData.new_password}
                onChange={handlePasswordInput}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirm_password"
                value={passwordChangeFormData.confirm_password}
                onChange={handlePasswordInput}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            disabled={isRequestingPasswordChange || !passwordChangeFormData.old_password || !passwordChangeFormData.new_password || !passwordChangeFormData.confirm_password}
            type="submit"
            className={`
              px-6 py-3 rounded-lg text-white font-medium transition-all
              ${isRequestingPasswordChange || !passwordChangeFormData.old_password || !passwordChangeFormData.new_password || !passwordChangeFormData.confirm_password
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-100"
              }
            `}
          >
            {isRequestingPasswordChange ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Requesting...
              </div>
            ) : (
              "Change Password"
            )}
          </button>
        </form>

        {/* OTP Form */}
        <form onSubmit={otpPost} className="passwordChangeOtpForm hidden mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Verify Password Change</h3>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Enter Verification Code
            </label>
            <div className="flex items-center gap-4">
              <OtpInput
                value={otpFormData.otp}
                onChange={(otpValue: string) => setOtpFormData({ otp: otpValue })}
                numInputs={6}
                renderSeparator={<span className="mx-1"></span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    className="w-12 h-12 text-center text-lg font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={!resendDisabled ? resendOTP : undefined}
                disabled={resendDisabled}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${resendDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-green-600 hover:bg-green-50"
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
      {isPasswordPostMsgModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Password Change Status</h3>
            <p className={`${passwordPostResponseStatus !== 200 ? "text-red-500" : ""} mb-4 `}>{passwordPostMsg || "Processing..."}</p>
            <button
              onClick={() => {
                setIsPasswordPostMsgModalOpen(false);
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
              className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition-colors"
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

export default PasswordChange;
