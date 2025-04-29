import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";

const PasswordChange = () => {
  const baseURL = `https://ecommercetemplate.pythonanywhere.com`;

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
      console.log(logData);

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
      console.log(logData);

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
      console.log("Resend is currently disabled.");
      return;
    }

    console.log("resend otp btn clicked");
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
      console.log(logData);

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
    <div className="shadow-2xl px-6 py-10 rounded-3xl mb-12 md:rounded-md">
      <form onSubmit={passwordChangePost}>
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm">Old Password</label>
            <input
              type="password"
              required
              name="old_password"
              value={passwordChangeFormData.old_password}
              onChange={handlePasswordInput}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm">New Password</label>
            <input
              type="password"
              required
              name="new_password"
              value={passwordChangeFormData.new_password}
              onChange={handlePasswordInput}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm">Confirm New Password</label>
            <input
              type="password"
              required
              name="confirm_password"
              value={passwordChangeFormData.confirm_password}
              onChange={handlePasswordInput}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-start mt-4">
          <button
            disabled={
              isRequestingPasswordChange ||
              !passwordChangeFormData.old_password ||
              !passwordChangeFormData.new_password ||
              !passwordChangeFormData.confirm_password
            }
            type="submit"
            className={`w-fit text-xs px-3 py-2 text-white rounded-lg mb-1 transition-colors
            ${
              isRequestingPasswordChange ||
              !passwordChangeFormData.old_password ||
              !passwordChangeFormData.new_password ||
              !passwordChangeFormData.confirm_password
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-blue-600"
            }`}
          >
            {/* Change text based on loading state */}
            {isRequestingPasswordChange ? "Requesting..." : "Request change"}
          </button>
        </div>
      </form>

      {/* OTP */}
      <form onSubmit={otpPost} className="passwordChangeOtpForm hidden mt-4">
        <div>
          <label className="block mb-2 text-sm">
            Enter the OTP sent to you
          </label>
          <div className="md:flex md:items-center">
            {/* Replace the single input with OtpInput */}
            <OtpInput
              value={otpFormData.otp}
              onChange={(otpValue: string) => setOtpFormData({ otp: otpValue })}
              numInputs={6}
              renderSeparator={<span className="mx-1"></span>}
              renderInput={(props) => (
                <input
                  {...props}
                  // Apply Tailwind classes for styling each box
                  className="!w-10 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    width: "2.5rem", // Equivalent to w-10
                  }}
                />
              )}
            />

            {/* Resend button */}
            <span
              onClick={!resendDisabled ? resendOTP : undefined}
              className={`text-sm inline-block mt-2 md:mt-0 md:ml-4 ${
                resendDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-500 cursor-pointer"
              }`}
            >
              Resend <br />
              {isTimerActive && (
                <span className={`text-gray-900`}>
                  ({formatTime(timeLeft)})
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-8 ">
          <button
            type="submit"
            disabled={!otpFormData.otp || otpFormData.otp.length !== 6}
            className={`${
              !otpFormData.otp || otpFormData.otp.length !== 6
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-700 transition-colors"
            } px-6 py-3 text-white rounded-full`}
          >
            Save
          </button>
        </div>
      </form>

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
              className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition-colors"
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
