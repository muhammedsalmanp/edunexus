import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyOtp, sendOtp } from '../../API/auth.api';
import { showNotification } from '../../store/slices/notificationSlice';
import { setLoading } from '../../store/slices/loadingSlice';
import type { RootState } from '../../store';

interface OtpVerificationProps {
  context: 'registration' | 'forgot-password';
  userType: 'student' | 'teacher' | 'admin';
  onSuccess?: () => void;
}

const OtpVerification = ({ context, userType, onSuccess }: OtpVerificationProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const OTP_LENGTH = 6;
  const TIMER_DURATION = 45;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [timer, setTimer] = useState<number>(TIMER_DURATION);
  const [isResendVisible, setIsResendVisible] = useState(false);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  useEffect(() => {
    setTimer(TIMER_DURATION);
    const start = Date.now();
    localStorage.setItem('otp_timer', String(start));

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = TIMER_DURATION - elapsed;

      if (remaining <= 0) {
        clearInterval(interval);
        setTimer(0);
        setIsResendVisible(true);
      } else {
        setTimer(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    const email = localStorage.getItem('emailForOtp');
    if (!email) {
      dispatch(showNotification({ message: 'Email not found in localStorage.', type: 'error' }));
      return;
    }

    try {
      dispatch(setLoading(true));
      await sendOtp(email, userType);
      dispatch(showNotification({ message: 'OTP resent successfully!', type: 'success' }));
      setOtp(Array(OTP_LENGTH).fill(''));
      setIsResendVisible(false);
      setTimer(TIMER_DURATION);
      localStorage.setItem('otp_timer', String(Date.now()));
    } catch (err: any) {
      dispatch(showNotification({
        message: err?.response?.data?.message || 'Failed to resend OTP.',
        type: 'error',
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const enteredOtp = otp.join('');
  const email = localStorage.getItem('emailForOtp');

  if (!email) {
    dispatch(showNotification({ message: 'Email not found in localStorage.', type: 'error' }));
    return;
  }

  try {
    dispatch(setLoading(true));
    const response = await verifyOtp(email, enteredOtp, userType);
    dispatch(showNotification({
      message: 'OTP Verified! Account activated.',
      type: 'success',
    }));

    if (context === 'registration') {
      if (userType === 'teacher' && !response.approvedByAdmin) {
        dispatch(showNotification({
          message: 'Your account is pending admin approval.',
          type: 'info',
        }));
        navigate(`/login/${userType}`);
      } else {
        navigate(`/login/${userType}`);
      }
    } else if (context === 'forgot-password') {
      navigate(`/reset-password/${userType.toLowerCase()}`, {
        state: { email, otp: enteredOtp },
      });
    } else {
      console.error('Unexpected context value:', context);
      dispatch(showNotification({ message: 'Invalid context for OTP verification.', type: 'error' }));
    }

    if (onSuccess) onSuccess();
  } catch (err: any) {
    dispatch(showNotification({
      message: err?.response?.data?.message || 'Invalid OTP.',
      type: 'error',
    }));
  } finally {
    dispatch(setLoading(false));
  }
};

  return (
    <div className="flex items-center justify-center bg-gray-900 text-white px-4 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 border border-gray-700 p-8 rounded-lg w-full max-w-md space-y-6 shadow-lg"
      >
        <h2 className="text-4xl font-bold text-yellow-400 text-center pb-3">Verify OTP</h2>
        <p className="text-center text-sm text-gray-400">
          Enter the {OTP_LENGTH}-digit OTP sent to your email for {userType}.
        </p>

        <div className="flex justify-center gap-3">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputsRef.current[idx] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-12 h-12 text-center text-xl rounded-md border-2 bg-gray-700 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 border-gray-600"
              disabled={isLoading}
            />
          ))}
        </div>

        <div className="text-center text-sm mt-2">
          {!isResendVisible ? (
            <span className="text-gray-400">
              Waiting for OTP... <span className="font-semibold text-white">{timer}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-blue-400 hover:underline"
              disabled={isLoading}
            >
              {isLoading ? 'Resending...' : 'Resend OTP'}
            </button>
          )}
        </div>

        <button
          type="submit"
          className={`w-full ${otp.includes('') || isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
            } text-black py-2 rounded font-semibold transition flex items-center justify-center`}
          disabled={otp.includes('') || isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-black" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : null}
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default OtpVerification;