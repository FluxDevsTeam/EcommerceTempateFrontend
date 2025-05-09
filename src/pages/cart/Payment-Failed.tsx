import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = new URLSearchParams(location.search).get('data') || 'Payment Failed';
  
  // Format the error message by replacing hyphens with spaces and capitalizing
  const formattedError = errorMessage
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-16 font-poppins">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-center mb-4">Payment Failed</h2>
        <p className="text-gray-600 text-center mb-8">{formattedError}</p>

        <div className="flex flex-col gap-4">
          <Link to="/confirm-order">
          <button
            className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiArrowLeft /> Return to Payment
          </button></Link>
          
          <Link to="/" className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FiRefreshCw /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
