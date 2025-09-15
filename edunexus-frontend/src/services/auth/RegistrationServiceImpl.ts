import type { Dispatch } from 'redux';
import { showNotification } from '../../store/slices/notificationSlice';
import { setLoading } from '../../store/slices/loadingSlice';
import axiosInstance from '../../API/axiosInstance';
import { loginSuccess } from '../../store/slices/authSlice';
export class GoogleAuthService {
  async registerOrLoginWithGoogle(
    googleToken: string,
    role: 'student' | 'teacher' | 'admin',
    dispatch: Dispatch,
    navigate: any
  ) {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post(`/auth/google`, { token: googleToken, role });

      const { accessToken, user } = response.data;

      if (!accessToken || !user) throw new Error('Invalid response from server');

      dispatch(loginSuccess({name:user.name , token:accessToken , role:user.role}))
      dispatch(showNotification({ message: 'Login successful!', type: 'success' }));

      const roleLower = user.role.toLowerCase();
      if (roleLower === 'admin') navigate('/admin/dashboard');
      else if (roleLower === 'teacher') navigate('/teacher/dashboard');
      else navigate('/');
    } catch (err: any) {
      dispatch(
        showNotification({
          message: err?.response?.data?.message || err.message || 'Google login failed',
          type: 'error',
        })
      );
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }
}
