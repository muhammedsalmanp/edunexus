import type { Dispatch } from 'redux';
import { showNotification } from '../../store/slices/notificationSlice';
import { loginSuccess } from '../../store/slices/authSlice';
import { setLoading } from '../../store/slices/loadingSlice';
import { login as loginAPI } from '../../API/auth.api';
import type { LoginForm, LoginResponse } from '../../types/authLoging';


export interface LoginService {
  login(form: LoginForm, userType: string, dispatch: Dispatch, navigate: any): Promise<void>;
}

export class LoginServiceImpl implements LoginService {
  async login(form: LoginForm, userType: string, dispatch: Dispatch, navigate: any): Promise<void> {
    try {
      dispatch(setLoading(true));

      if (!form.email || !form.password) {
        throw new Error('Email and password are required');
      }

      const response: LoginResponse = await loginAPI(form);
      const { token, user } = response;

      dispatch(loginSuccess({ name: user.name, token, role: user.role }));
      dispatch(showNotification({ message: 'Login Successful!', type: 'success' }));

      // Role-based redirection
      switch (user.role.toLowerCase()) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'teacher':
          navigate('/teacher/dashboard');
          break;
        case 'student':
          navigate('/');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      dispatch(showNotification({
        message: err?.message || 'Login failed. Please try again.',
        type: 'error',
      }));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }
}