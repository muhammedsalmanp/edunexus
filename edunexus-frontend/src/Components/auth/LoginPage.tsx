import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import type { LoginForm } from '../../types/authLoging';
import { userTypeConfigs } from '../../config/LoginuserTypes';
import { showNotification } from '../../store/slices/notificationSlice';
import type { RootState } from '../../store';
import { LoginServiceImpl } from '../../services/auth/LoginService';
import { GoogleAuthService } from '../../services/auth/RegistrationServiceImpl';
import { GoogleLogin } from '@react-oauth/google';
import { setLoading } from '../../store/slices/loadingSlice';
interface LoginProps {
  userType: 'student' | 'admin' | 'teacher';
  loginService: LoginServiceImpl;
}

const LoginPage = ({ userType }: LoginProps) => {
  const googleService = new GoogleAuthService();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  const config = userTypeConfigs.find((c) => c.type === userType);
  if (!config) throw new Error(`Unsupported user type: ${userType}`);

  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
    role: userType,
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setForm({ email: '', password: '', role: userType });
    setErrors({});
  }, [userType]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email';
      case 'password':
        return value.length >= 6 ? '' : 'Password must be at least 6 characters';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend validation first
    const newErrors = config.fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: validateField(field.name, form[field.name] || ''),
    }), {} as Partial<Record<string, string>>);

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== '')) {
      dispatch(showNotification({ message: 'Please fix the errors.', type: 'error' }));
      return;
    }

    try {
      const loginService = new LoginServiceImpl();
      await loginService.login(form, userType, dispatch, navigate);
    } catch (err: any) {
      // If backend returns validation errors
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        setErrors(backendErrors); // assuming errors are in { fieldName: message } format
      }

      // If backend returns a general message
      if (err.response?.data?.message) {
        dispatch(showNotification({ message: err.response.data.message, type: 'error' }));
      } else if (err.message) {
        dispatch(showNotification({ message: err.message, type: 'error' }));
      }
    }
  };


  const getRoleHint = () => {
    switch (userType) {
      case 'admin':
        return 'Admin login for platform management.';
      case 'teacher':
        return 'Teacher login for course management.';
      case 'student':
        return 'Student login to access courses.';
      default:
        return 'Login to access your account.';
    }
  };


  const isFormInvalid = !!(!form.email || !form.password || errors.email || errors.password);

  return (

    <>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4 py-12">
        <div className="bg-gray-800 text-white p-8 rounded-lg shadow-2xl w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-yellow-400">{userType.charAt(0).toUpperCase() + userType.slice(1)} Login</h2>
            <p className="text-gray-400 text-sm mt-1">{getRoleHint()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {config.fields.map((field) => (
              <div key={field.name} className="relative">
                <label className="block text-sm font-medium text-gray-300">{field.label}</label>
                <input
                  name={field.name}
                  type={field.name === 'password' ? (showPassword ? 'text' : 'password') : field.type}
                  placeholder={field.placeholder}
                  value={form[field.name] || ''}
                  onChange={handleChange}
                  className={`mt-1 w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${errors[field.name] ? 'border-red-500' : form[field.name] ? 'border-green-500' : 'border-gray-600'
                    }`}
                  disabled={isLoading}
                />
                {field.name === 'password' && (
                  <div
                    className="absolute right-3 top-10 text-xl text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </div>
                )}
                {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
              </div>
            ))}

            <div className="text-right">
              <Link to={`/forgot-password/${userType} `} className="text-sm text-pink-500 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 disabled:opacity-50"
              disabled={isLoading || isFormInvalid}
            >
              {isLoading ? 'Logging In...' : 'Sign In'}
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-600" />
              <span className="mx-3 text-sm text-gray-400">or</span>
              <hr className="flex-grow border-gray-600" />
            </div>

            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const token = credentialResponse.credential;
                if (!token) return;

                try {
                  dispatch(setLoading(true));
                  await googleService.registerOrLoginWithGoogle(
                    token,
                    userType as 'student' | 'teacher' | 'admin',
                    dispatch,
                    navigate
                  );
                  console.log('Google credential:', credentialResponse.credential);
                } catch (err: any) {
                  dispatch(
                    showNotification({
                      message: err?.message || 'Google login failed',
                      type: 'error',
                    })
                  );
                } finally {
                  dispatch(setLoading(false));
                }
              }}
              onError={() => {
                dispatch(showNotification({ message: 'Google login failed', type: 'error' }));
              }}
            />

          <div className="text-center text-sm text-gray-400">
            Don’t have an account?{' '}
            <Link to={`/register/${userType}`} className="text-yellow-500 hover:underline">
              Sign up
            </Link>
          </div>
          <div className="text-center text-sm text-gray-400 mt-4">
            {userType === "student" && (
              <>
                Already have an account?{' '}
                <Link to="/login/teacher" className="text-yellow-500 hover:underline">
                  Teacher Login
                </Link>
              </>
            )}

            {userType === "teacher" && (
              <>
                Already have an account?{' '}
                <Link to="/login/student" className="text-yellow-500 hover:underline">
                  Student Login
                </Link>
              </>
            )}

            {userType === "admin" && (
              <>
                Already have an account?{' '}
                <Link to="/login/admin" className="text-yellow-500 hover:underline">
                  Admin Login
                </Link>
              </>
            )}
          </div>

        </form>
      </div>
    </div >
    </>
  );
};

export default LoginPage;