import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { useState } from "react";

// Define backend response types
interface GoogleAuthResponse {
  message: string;
  is_new_user: boolean;
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
  user?: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

interface SetPasswordResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

interface AxiosErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
}

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [authData, setAuthData] = useState<GoogleAuthResponse | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [names, setNames] = useState("")
  const [isGoogleCallback, setIsGoogleCallback] = useState(false);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "https://api.fluxdevs.com";

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      setIsLoading(true);
      setIsGoogleCallback(true);
      const decodedToken = credentialResponse.credential
        ? JSON.parse(atob(credentialResponse.credential.split(".")[1]))
        : null;

      const requestData = {
        id_token: credentialResponse.credential,
      };

      const response = await axios.post<GoogleAuthResponse>(
        `${backendUrl}/auth/google-auth/`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setNames(response?.data?.first_name + " " + response?.data?.last_name)

      if (response.data.is_new_user) {
        setAuthData(response.data);
        setShowPasswordModal(true);
      } else if (response.data.access_token && response.data.refresh_token) {
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);
        await refreshUserData();
        toast.success("Successfully logged in with Google!");
        navigate("/dashboard");
      } else {
        throw new Error("Missing access_token or refresh_token in backend response");
      }
    } catch (error: AxiosError<AxiosErrorResponse> | Error) {
      toast.error(
        (error as AxiosError).response?.data?.message ||
        (error as AxiosError).response?.data?.detail ||
        (error as AxiosError).response?.data?.error ||
        error.message ||
        "Failed to login with Google"
      );
    } finally {
      setIsLoading(false);
      setIsGoogleCallback(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authData?.id_token) {
      toast.error("Missing authentication data. Please try logging in again.");
      setShowPasswordModal(false);
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setIsLoading(true);
      setPasswordError(null);

      const requestData = {
        id_token: authData.id_token,
        password,
      };

      const response = await axios.post<SetPasswordResponse>(
        `${backendUrl}/auth/set-google-auth-password/`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      if (response.data.access_token && response.data.refresh_token) {
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);
        await refreshUserData();
        toast.success("Account setup successful!");
        setShowPasswordModal(false);
        navigate("/dashboard");
      } else {
        throw new Error("Missing access_token or refresh_token in response");
      }
    } catch (error: AxiosError<AxiosErrorResponse> | Error) {
      const errorMessage =
        (error as AxiosError).response?.data?.message ||
        (error as AxiosError).response?.data?.detail ||
        (error as AxiosError).response?.data?.error ||
        error.message ||
        "Failed to set password";
      setPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-xl">
      {isGoogleCallback ? (
        <div className="text-center space-y-2">
          <div className="text-sm text-gray-600">Setting up your account...</div>
          <div className="w-6 h-6 border-2 border-t-blue-500 border-r-blue-500 rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.error("Google Login Failed");
            toast.error("Google login failed");
          }}
          useOneTap
          disabled={isLoading}
        />
      )}

      {showPasswordModal && authData && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md transform transition-all">
            <div className="px-6 py-8 border-b border-gray-100">
              <h1 className="font-medium text-gray-800" style={{fontSize: "clamp(13px, 3vw, 22px)"}}>
                Welcome to SHOP
              </h1>
              <p className="mt-2 text-sm text-gray-500" style={{fontSize: "clamp(10px, 3vw, 14px)"}}>
                Hi {names || "there"}, please set a password
                for your account to access exclusive features.
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-gray-500 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={authData?.email || ""}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-500 text-sm"
                  disabled
                />
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm text-gray-500 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="Min. 8 characters"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-colors placeholder:text-sm"
                  />
                  {passwordError && (
                    <p className="mt-2 text-sm text-red-500 font-medium">
                      {passwordError}
                    </p>
                  )}
                </div>
                <div className="flex justify-center gap-3">
                  {/* <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPassword("");
                      setPasswordError(null);
                    }}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button> */}
                  <button
                    type="submit"
                    disabled={isLoading || password.length < 8}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? "Setting Password..." : "Set Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
