import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const DeleteAccount = () => {
  const navigate = useNavigate();
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmationWord, setConfirmationWord] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const CONFIRMATION_WORD = 'DELETE FOREVER';

  const handleInitialConfirm = () => {
    setShowInitialModal(false);
    setShowPasswordModal(true);
  };

  const handlePasswordConfirm = () => {
    setShowPasswordModal(false);
    setShowFinalModal(true);
  };

  const handleDeleteAccount = async () => {
    if (confirmationWord !== CONFIRMATION_WORD) {
      setError('Please type the confirmation word exactly as shown');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(
        'https://api.kidsdesigncompany.com/auth/profile/delete-account/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShowFinalModal(false);
        setShowSuccessModal(true);
        setTimeout(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/');
          window.location.reload();
        }, 2000);
      } else {
        setError(data.data || 'Failed to delete account');
        setShowFinalModal(false);
        setPassword('');
        setConfirmationWord('');
      }
    } catch (err) {
      setError('An error occurred while trying to delete your account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="bg-white rounded-2xl p-8 shadow-md">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-14 w-14 bg-red-50 rounded-full flex items-center justify-center">
            <FiAlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Delete Account</h2>
            <p className="text-gray-500 text-sm">Permanently remove your account and all associated data</p>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          <p className="text-gray-600">Before proceeding, please understand that:</p>
          <ul className="list-disc pl-5 text-gray-600">
            <li>All your data will be permanently deleted</li>
            <li>This action cannot be undone</li>
            <li>You'll lose access to your order history</li>
            <li>Your account cannot be recovered</li>
          </ul>
        </div>

        <button
          onClick={() => setShowInitialModal(true)}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete My Account
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Initial Confirmation Modal */}
        {showInitialModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
              <p className="text-gray-600 mb-6">
                This will permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowInitialModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInitialConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Yes, Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Confirmation Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Confirm your password</h3>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded mb-6"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordConfirm}
                  disabled={!password}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Final Confirmation Modal */}
        {showFinalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Final Confirmation</h3>
              <p className="text-gray-600 mb-4">
                This action is permanent and irreversible. To confirm, please type:
              </p>
              <p className="font-mono bg-gray-100 p-2 rounded mb-4 text-center">
                {CONFIRMATION_WORD}
              </p>
              <input
                type="text"
                value={confirmationWord}
                onChange={(e) => setConfirmationWord(e.target.value)}
                placeholder="Type the confirmation word"
                className="w-full px-4 py-2 border rounded mb-6"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowFinalModal(false);
                    setConfirmationWord('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || confirmationWord !== CONFIRMATION_WORD}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="text-lg font-semibold mb-2">Account Deleted Successfully</h3>
              <p className="text-gray-600">
                Your account has been deleted. You will be redirected to the homepage.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccount;
