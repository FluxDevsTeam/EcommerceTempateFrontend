import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send the Google ID token to your backend
      const response = await axios.post(
        'https://ecommercetemplate.pythonanywhere.com/auth/google-auth/',
        {
          id_token: credentialResponse.credential, // Google ID token
        }
      );
      console.log('Google login successful:', response.data);
      // Store token or user data (e.g., JWT from backend)
      localStorage.setItem('token', response.data.token); // Adjust based on your backend response
      navigate('/dashboard'); // Redirect to a protected route
    } catch (error) {
      console.error('Google login failed:', error.response?.data || error.message);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap // Optional: Enables Google's One Tap prompt
      />
    </div>
  );
};

export default GoogleLoginButton;