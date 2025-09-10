import type { Dispatch } from 'redux';
import { showNotification } from '../../store/slices/notificationSlice';
import { setLoading } from '../../store/slices/loadingSlice';
import { registerUser, sendOtp } from '../../API/auth.api';
import type { FormData } from '../../types/auth';
import { useNavigate } from 'react-router-dom';

export interface RegistrationService {
  register(form: FormData, userType: string, dispatch: Dispatch, navigate: any): Promise<void>;
}

export class RegistrationServiceImpl implements RegistrationService {
  async register(form: FormData, userType: string, dispatch: Dispatch, navigate: any): Promise<void> {
    try {
      // Basic validation for common fields
      if (!form.name || !form.email || !form.phone || !form.password) {
        throw new Error('Missing required fields');
      }
      if (form.password !== form.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Type-specific validation
      if (userType === 'teacher') {
        if (!form.qualifications || !form.experience) {
          throw new Error('Missing required fields for teacher');
        }
      }

      // Ensure role is set
      if (!form.role) {
        throw new Error('Role is missing');
      }

      await registerUser(form, userType);
      await sendOtp(form.email);

      dispatch(showNotification({
        message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} registration successful! Check your email for OTP.`,
        type: 'success',
      }));
      localStorage.setItem('emailForOtp', form.email);
      navigate(`/verify-otp/${userType.toLowerCase()}`, { state: { context: 'forgot-password' } })
    } catch (err: any) {
      dispatch(showNotification({
        message: err?.message || 'Registration failed.',
        type: 'error',
      }));
      throw err; 
    } finally {
      dispatch(setLoading(false)); // Reset loading state
    }
  }
}