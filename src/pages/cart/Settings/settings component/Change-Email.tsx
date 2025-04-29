import { useState, useEffect } from "react";
import validator from "validator";
import OtpInput from "react-otp-input";

const ChangeEmail = () => {
  const baseURL = `https://ecommercetemplate.pythonanywhere.com`;

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
      console.log(response.ok ? logData.data : logData);
      console.log(response.status);
      

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
        console.log(response.status);
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
      console.log(logData);

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
      console.log(logData);

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
    <div className="mb-16 shadow-xl px-6 py-10 rounded-3xl md:rounded-md">
      <form onSubmit={emailchange} className="mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-12">Change Email</h2>
          <div className="space-y-7">
            <div>
              <label className="block mb-2 text-sm">
                Current Email Address
              </label>
              <input
                type="email"
                value={userProfileDeets?.email ?? ""}
                readOnly
                placeholder="e.g jonesdexter@xyz.com"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            <div className="grid">
              <label className="block mb-2 text-sm">New Email Address</label>
              <input
                type="email"
                name="new_email"
                value={emailChangeFormData.new_email}
                onChange={handleEmailChange}
                placeholder="e.g jonesdexter@xyz.com"
                className="w-full p-3 border border-gray-300 rounded-lg"
                aria-describedby="email-error"
              />
              {emailChangeFormData.new_email &&
                !isValidEmail(emailChangeFormData.new_email) && (
                  <p id="email-error" className="text-red-500 text-sm mt-1">
                    Please enter a valid email address (e.g.,
                    jonesdexter@xyz.com).
                  </p>
                )}

              <label className="block mb-2 text-sm mt-4">Verify password</label>
              <input
                type="password"
                name="password"
                value={emailChangeFormData.password}
                onChange={handleEmailChange}
            //     placeholder="********"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <button
                // The disabled logic remains the same, checking for input values
                disabled={
                  isButtonDisabled || // Keep this check
                  !emailChangeFormData.new_email ||
                  !emailChangeFormData.password ||
                  !isValidEmail(emailChangeFormData.new_email) // Also disable if email is invalid
                }
                type="submit"
                className={`${
                  // Style adjustments based on input validity and button disabled state
                  !emailChangeFormData.new_email ||
                  !emailChangeFormData.password ||
                  !isValidEmail(emailChangeFormData.new_email) ||
                  isButtonDisabled // Add isButtonDisabled here for styling consistency
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-black hover:bg-blue-600 transition-colors" // Use bg-black for default enabled state
                } w-fit text-xs mt-3 px-3 py-2 text-white rounded-lg mb-1`}
              >
                {/* Text changes based ONLY on isButtonDisabled */}
                {isButtonDisabled ? "Please Wait..." : "Request Change"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* OTP */}
      <form onSubmit={otpPost} className="emailOtpForm hidden">
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
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-500 cursor-pointer'
              }`}
            >
              Resend <br />
              {isTimerActive && (
                <span className={`text-gray-900`}>({formatTime(timeLeft)})</span>
              )}
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-8 ">
          <button
            type="submit"
            disabled={isSavingOTP || !otpFormData.otp || otpFormData.otp.length !== 6}
            className={`${
              isSavingOTP || !otpFormData.otp || otpFormData.otp.length !== 6
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-black hover:bg-gray-700 transition-colors" 
            } px-6 py-3 text-white rounded-full`}
          >
            {/* Change text based on loading state */}
            {isSavingOTP ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

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

export default ChangeEmail;
