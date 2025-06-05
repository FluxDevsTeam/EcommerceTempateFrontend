import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const LoginWithGoogle = () => {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send the Google credential to your backend
      const response = await axios.post(
        'https://ecommercetemplate.pythonanywhere.com/auth/login/',
        {
          googleToken: credentialResponse.credential, // Send Google's ID token
        }
      );
      console.log('Login successful:', response.data);
      // Handle successful login (e.g., store token, redirect)
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
  };

  return (
    <div>
      {/* <h2>Login</h2> */}
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap
      />
    </div>
  );
};

export default LoginWithGoogle;