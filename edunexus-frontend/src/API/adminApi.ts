import { handleError } from '../utils/responseUtils';
import instance from './axiosInstance'
import type { TeacherProfile } from '../types/TeacherTypes';


export const toggleUserBlockStatus = async (teacherId: string) => {
 try {
    const response = await instance.put(`/admin/block/${teacherId}`);
    return response.data;
  } catch (error) {
    handleError(error);
    console.error('API Error updating teacher profile:', error);
    throw new Error('Failed to update teacher profile');
  }
}

export const getTeacherProfile = async (teacherId: string): Promise<TeacherProfile> => {
  try {
    const response = await instance.get<TeacherProfile>(
      `/admin/teachers/profile/${teacherId}`,
      { withCredentials: true } 
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    throw new Error('Failed to fetch teacher profile');
  }
};

export const toggleApprovalStatus = async (teacherId: string, action: 'approved'| 'rejected', rejectionMessage?: string) => {
  try { 
    const response = await instance.post(`/admin/teachers-approval/${teacherId}`, { action,  rejectionMessage  });
    return response.data; // { message, teacher }
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to update approval");
  }
};
