import { handleResponse, handleError } from '../utils/responseUtils';
import axiosInstance from './axiosInstance';
import instance from './axiosInstance';
import type { LoginForm, LoginResponse } from '../types/authLoging';
import type { Student,Teacher } from '..//Components/Table';

const normalizeData = <T extends Student | Teacher>(
  data: Array<Record<string, { value: any } | any>>,
  isTeacher: boolean = false
): T[] => {
  return data.map((item) =>
    Object.keys(item).reduce(
      (acc, key) => ({
        ...acc,
        [key]:
          item[key] && typeof item[key] === 'object' && 'value' in item[key]
            ? item[key].value
            : item[key],
        isVerified: item.isVerified !== undefined ? item.isVerified : false,
        ...(isTeacher ? { approvedByAdmin: item.approvedByAdmin !== undefined ? item.approvedByAdmin : false } : {}),
      }),
      {} as T
    )
  );
};

// export const registerUser = async (formData: any, userType: string): Promise<any> => {
//   try {
//     let endpoint = '';
//     switch (userType.toLowerCase()) {
//       case 'student':
//         endpoint = '/auth/register/student';
//         break;
//       case 'teacher':
//         endpoint = '/auth/register/teacher';
//         break;
//       case 'admin':
//         endpoint = '/auth/register/admin';
//         break;
//       default:
//         throw new Error('Unsupported user type');
//     }

//     const response = await axiosInstance.post(endpoint, formData);
//     return handleResponse(response);
//   } catch (error) {
//     handleError(error);
//   }
// };

export const registerUser = async (formData: any, userType: string): Promise<any> => {
  try {
    let endpoint = '';
    switch (userType.toLowerCase()) {
      case 'student':
        endpoint = '/auth/register/student';
        break;
      case 'teacher':
        endpoint = '/auth/register/teacher';
        break;
      case 'admin':
        endpoint = '/auth/register/admin';
        break;
      default:
        throw new Error('Unsupported user type');
    }

    const response = await axiosInstance.post(endpoint, formData);
    return handleResponse(response);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Registration failed';
    throw new Error(errorMessage); // Propagate error for UI to display
  }
};

export const sendOtp = async (email: string, userType?: 'student' | 'teacher' | 'admin'): Promise<any> => {
  try {
    const response = await axiosInstance.post('/auth/send-otp', { email, userType });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const resendOtp = async (email: string): Promise<any> => {
  try {
    const response = await axiosInstance.post('/auth/send-otp', { email });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const verifyOtp = async (email: string, otp: string, userType?: 'student' | 'teacher' | 'admin'): Promise<any> => {
  try {
    const response = await axiosInstance.post('/auth/verify-otp', { email, otp, userType });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const login = async (credentials: LoginForm): Promise<LoginResponse> => {
  const response = await instance.post('/auth/login', credentials);
  const { token } = response.data;
  localStorage.setItem('token', token);
  return response.data;
};

export const resetPassword = async (email: string, otp: string, newPassword: string): Promise<void> => {
  await instance.post('/auth/reset-password', { email, otp, newPassword });
};

export const getAllTeachers = async (): Promise<Teacher[]> => {
  try {
    const response = await instance.get('/admin/get-all-teachers');
    const data = handleResponse(response);
    return Array.isArray(data) ? normalizeData<Teacher>(data, true) : [];
  } catch (error) {
    handleError(error);
    return [];
  }
};

export const getAllStudents = async (
  page: number = 1,
  limit: number = 8,
  filter: 'all' | 'blocked' | 'unblocked' | 'verified' | 'unverified' = 'all',
  search: string = ''
): Promise<{ students: Student[]; total: number }> => {
  try {
    const response = await instance.get(
      `/admin/get-all-students?page=${page}&limit=${limit}&filter=${filter}&search=${search}`
    );
    const { data, total } = handleResponse(response);

    const students = Array.isArray(data) ? normalizeData<Student>(data) : [];

    return { students, total };
  } catch (error) {
    handleError(error);
    return { students: [], total: 0 };
  }
};
