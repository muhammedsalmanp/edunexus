import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { resetPassword } from '../../API/auth.api';
import { showNotification } from '../../store/slices/notificationSlice';
import { setLoading } from '../../store/slices/loadingSlice';
import type { RootState } from '../../store';

interface ResetPasswordProps {
  userType: 'student' | 'teacher' | 'admin';
}

const ResetPassword = ({ userType }: ResetPasswordProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const location = useLocation();
  const { email, otp } = location.state || { email: undefined, otp: undefined }; 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validatePassword = (password: string, confirmPassword: string): string => {
    if (!password || !confirmPassword) return 'Both password fields are required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Debug - Email:', email, 'OTP:', otp, 'UserType:', userType); // Enhanced debug
    if (!userType || !email || !otp) {
      setError('Missing required data. Please try again from the forgot password page.');
      return;
    }
    const parsedUserType = userType.toLowerCase() as 'student' | 'teacher' | 'admin'; // Type assertion
    const validationError = validatePassword(newPassword, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      dispatch(setLoading(true));
      await resetPassword(email, otp, newPassword);
      dispatch(showNotification({ message: 'Password reset successfully!', type: 'success' }));
      navigate(`/login/${parsedUserType}`);
    } catch (err: any) {
      dispatch(showNotification({
        message: err?.response?.data?.message || 'Failed to reset password.',
        type: 'error',
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4 py-12">
        <div className="bg-gray-800 text-white p-8 rounded-lg shadow-2xl w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-yellow-400">Reset Password</h2>
            <p className="text-gray-400 text-sm mt-1">Set a new password for {userType}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError(validatePassword(e.target.value, confirmPassword));
                }}
                className={`mt-1 w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  error ? 'border-red-500' : newPassword ? 'border-green-500' : 'border-gray-600'
                }`}
                disabled={isLoading}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError(validatePassword(newPassword, e.target.value));
                }}
                className={`mt-1 w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  error ? 'border-red-500' : confirmPassword ? 'border-green-500' : 'border-gray-600'
                }`}
                disabled={isLoading}
                placeholder="Confirm new password"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 disabled:opacity-50"
              disabled={isLoading || !!error || !newPassword || !confirmPassword}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;