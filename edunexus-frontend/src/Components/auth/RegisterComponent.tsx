import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import type { FormData } from '../../types/auth';
import type { RegistrationFormProps } from './RegistrationForm.types';
import { userTypeConfigs } from '../../config/userTypes';
import { showNotification } from '../../store/slices/notificationSlice';
import { setLoading } from '../../store/slices/loadingSlice';
import type { RootState } from '../../store';

const RegistrationForm = ({ userType, registrationService }: RegistrationFormProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  const config = userTypeConfigs.find(c => c.type === userType);
  if (!config) throw new Error(`Unsupported user type: ${userType}`);

  const [form, setForm] = useState<FormData>({
    email: '',
    phone: '',
    password: '',
    name: '',
    confirmPassword: '',
    role: userType,
    ...Object.fromEntries(config.fields.map(field => [field.name, ''])),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setForm({
      email: '',
      phone: '',
      password: '',
      name: '',
      confirmPassword: '',
      role: userType,
      ...Object.fromEntries(config.fields.map(field => [field.name, ''])),
    });
    setErrors({});
  }, [userType]);

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case 'name':
        return /^[A-Za-z ]{2,15}$/.test(value) ? '' : 'Name must be 2–15 letters only';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email';
      case 'phone':
        return /^\+91\d{10}$/.test(value) ? '' : 'Phone must be +91 followed by 10 digits';
      case 'password':
        return value.length >= 6 ? '' : 'Password must be at least 6 characters';
      case 'confirmPassword':
        return value === form.password ? '' : 'Passwords do not match';
      case 'qualifications':
      case 'experience':
        return value ? '' : 'This field is required';
      case 'certificates':
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let updatedValue = value;

     if (name === 'phone') {
    if (!value.startsWith('+91')) {
      updatedValue = '+91' + value.replace(/[^0-9]/g, '').slice(0, 10); 
    } else {
      updatedValue = '+91' + value.slice(3).replace(/[^0-9]/g, '').slice(0, 10);
    }
  }


    setForm(prev => ({ ...prev, [name]: updatedValue }));
    setErrors(prev => ({ ...prev, [name]: validateField(name as keyof FormData, updatedValue) }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const newErrors = Object.fromEntries(
    config.fields
      .filter(field => field.required)
      .map(field => [field.name, validateField(field.name as keyof FormData, form[field.name] || '')])
  ) as Partial<Record<keyof FormData, string>>;
  newErrors.confirmPassword = validateField('confirmPassword', form.confirmPassword || '');

  setErrors(newErrors);

  if (Object.values(newErrors).some(err => err !== '')) {
    dispatch(showNotification({ message: 'Please fill all required fields correctly.', type: 'error' }));
    return;
  }

  dispatch(setLoading(true));
  try {
    await registrationService.register(form, userType, dispatch, navigate);
    localStorage.setItem('emailForOtp', form.email); // Store email for OTP
    dispatch(showNotification({ message: 'OTP sent to your email!', type: 'success' }));
    navigate(`/verify-otp/${userType.toLowerCase()}`, { state: { context: 'registration' } }); // Use 'registration' context
  } catch (err: any) {
    dispatch(showNotification({
      message: err?.response?.data?.message || 'Registration failed.',
      type: 'error',
    }));
  } finally {
    dispatch(setLoading(false));
  }
};
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-yellow-400 text-center">
          {userType.charAt(0).toUpperCase() + userType.slice(1)} Registration
        </h2>
        {config.fields.map((field, index) => (
          <div key={index} className="relative">
            <label className="block text-sm font-medium text-gray-300">{field.label}</label>
            <input
              name={field.name}
              type={
                field.name === 'password'
                  ? showPassword
                    ? 'text'
                    : 'password'
                  : field.type
              }
              placeholder={field.placeholder}
              value={form[field.name] || ''}
              onChange={handleChange}
              onFocus={field.name === 'phone' && !form.phone.startsWith('+91') ? () => setForm(prev => ({ ...prev, phone: '+91' })) : undefined}
              className={`mt-1 w-full p-2 bg-gray-700 text-white border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                errors[field.name] ? 'border-red-500' : form[field.name] ? 'border-green-500' : 'border-gray-600'
              }`}
              disabled={isLoading}
            />
            {field.name === 'password' && (
              <div
                className="absolute right-3 top-9 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </div>
            )}
            {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
          </div>
        ))}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
          <input
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            placeholder="********"
            value={form.confirmPassword || ''}
            onChange={handleChange}
            className={`mt-1 w-full p-2 bg-gray-700 text-white border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.confirmPassword ? 'border-red-500' : form.confirmPassword ? 'border-green-500' : 'border-gray-600'
            }`}
            disabled={isLoading}
          />
          <div
            className="absolute right-3 top-9 text-gray-400 cursor-pointer"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <AiFillEyeInvisible /> : <AiFillEye />}
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-yellow-500 text-black font-semibold py-2 rounded hover:bg-yellow-600 transition flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-black" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : null}
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-3 text-sm text-gray-400">OR REGISTER WITH</span>
          <hr className="flex-grow border-gray-600" />
        </div>
        <div className="flex justify-center gap-4">
          <FaFacebookF className="text-blue-600 bg-white rounded-full w-8 h-8 p-2 cursor-pointer hover:scale-110 transition" />
          <FaGoogle className="text-red-500 bg-white rounded-full w-8 h-8 p-2 cursor-pointer hover:scale-110 transition" />
        </div>
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link to={`/login/${userType}`} className="text-yellow-400 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;