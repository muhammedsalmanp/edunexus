import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { sendOtp } from '../../API/auth.api';
import { showNotification } from '../../store/slices/notificationSlice';
import { setLoading } from '../../store/slices/loadingSlice';
import type { RootState } from '../../store';

interface ForgotPasswordProps {
  userType: 'student' | 'teacher' | 'admin';
}

const ForgotPasswordPage = ({ userType }: ForgotPasswordProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): string => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Please enter a valid email';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      dispatch(setLoading(true));
      await sendOtp(email, userType);
      localStorage.setItem('emailForOtp', email);
      dispatch(showNotification({ message: 'OTP sent to your email!', type: 'success' }));
      navigate(`/verify-otp/${userType.toLowerCase()}`, { state: { context: 'forgot-password' } });
    } catch (err: any) {
      dispatch(showNotification({
        message: err?.response?.data?.message || 'Failed to send OTP.',
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
            <h2 className="text-3xl font-bold text-yellow-400">Forgot Password</h2>
            <p className="text-gray-400 text-sm mt-1">Enter your email to reset your password for {userType}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(validateEmail(e.target.value));
                }}
                className={`mt-1 w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  error ? 'border-red-500' : email ? 'border-green-500' : 'border-gray-600'
                }`}
                disabled={isLoading}
                placeholder="e.g., user@example.com"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 disabled:opacity-50"
              disabled={isLoading || !email || !!error}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
            <div className="text-center text-sm text-gray-400">
              Remember your password?{' '}
              <Link to={`/login/${userType.toLowerCase()}`} className="text-yellow-500 hover:underline">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
