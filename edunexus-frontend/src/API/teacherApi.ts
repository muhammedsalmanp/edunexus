// // src/api/teacherApi.ts
// import { handleResponse, handleError } from '../utils/responseUtils';
// import instance from './axiosInstance';
// import type {TeacherProfile} from '../types/TeacherTypes';
// import type { Course } from '../types/CourseType';





// export const getTeacherProfile = async (): Promise<TeacherProfile> => {
//   try {
//     const response = await instance.get('teacher/profile/');
//     const data = handleResponse(response);
    
//     return {
//       ...data,
//       id: data._id || data.id,
//       isVerified: data.isVerified ?? false,
//       approvedByAdmin: data.approvedByAdmin ?? 'pending',
//       createdAt: data.createdAt || new Date().toISOString(),
//       updatedAt: data.updatedAt || new Date().toISOString(),
//       specializations: data.specializations || [],
//       educationHistory: data.educationHistory || [],
//       awards: data.awards || [],
//       qualifications: data.qualifications || [],
//       certificates: data.certificates || [],
//       projectsCompleted: data.projectsCompleted || 0,
//       clientsServed: data.clientsServed || 0
//     };
//   } catch (error) {
//     handleError(error);
//     throw error;
//   }
// };


// export const updateTeacherProfile = async (data: FormData) => {
//   try {
//     const response = await instance.put('/teacher/profile', data, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       timeout: 30000, // 30 seconds
//     });
//     return response.data;
//   } catch (error) {
//     console.error('API Error updating teacher profile:', error);
//     throw new Error('Failed to update teacher profile');
//   }
// };

// export const  getTeacherCourse = async (): Promise<Course>=>{
//   const response =await instance.get('/teacher/courses');

//   return response.data;
// }
import { handleResponse, handleError } from '../utils/responseUtils';
import instance from './axiosInstance';
import type { TeacherProfile } from '../types/TeacherTypes';
import type { Course } from '../types/CourseType';

export const getTeacherProfile = async (): Promise<TeacherProfile> => {
  try {
    const response = await instance.get('teacher/profile');
    const data = handleResponse(response);
    
    return {
      ...data,
      id: data._id || data.id,
      isVerified: data.isVerified ?? false,
      approvedByAdmin: data.approvedByAdmin ?? 'pending',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      specializations: data.specializations || [],
      educationHistory: data.educationHistory || [],
      awards: data.awards || [],
      qualifications: data.qualifications || [],
      certificates: data.certificates || [],
      projectsCompleted: data.projectsCompleted || 0,
      clientsServed: data.clientsServed || 0
    };
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const updateTeacherProfile = async (data: FormData) => {
  try {
    const response = await instance.put('/teacher/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    console.error('API Error updating teacher profile:', error);
    throw new Error('Failed to update teacher profile');
  }
};

export const getTeacherCourse = async (): Promise<Course[]> => {
  try {
    const response = await instance.get('/teacher/courses');
    const data = handleResponse(response);
    return data.map((course: any) => ({
      id: course._id || course.id,
      name: course.name,
      description: course.description,
      price: course.price || 0,
      thumbnailImage: course.thumbnailImage || '',
      coveringTopics: course.coveringTopics || [],
      chapters: course.chapters || [],
      createdBy: course.createdBy || '',
      courseStatus: course.courseStatus || 'pending',
      createdAt: course.createdAt || new Date().toISOString(),
    }));
  } catch (error) {
    handleError(error);
    throw new Error('Failed to fetch teacher courses');
  }
};

// export const getCourse = async (courseId: string): Promise<Course> => {
//   try {
//     const response = await instance.get(`/courses/${courseId}`);
//     const data = response.data;
//     return {
//       id: data._id || data.id,
//       name: data.name,
//       description: data.description,
//       price: data.price || 0,
//       thumbnailImage: data.thumbnailImage || '',
//       coveringTopics: data.coveringTopics || [],
//       chapters: data.chapters || [],
//       createdBy: data.createdBy || '',
//       courseStatus: data.courseStatus || 'pending',
//       createdAt: data.createdAt || new Date().toISOString(),
//       instructor: data.instructor || { name: '', avatar: '', bio: '', rating: 0, totalStudents: 0 },
//       stats: data.stats || {
//         duration: '',
//         enrolledStudents: 0,
//         rating: 0,
//         reviews: 0,
//         lastUpdated: '',
//         totalRevenue: 0,
//         monthlyRevenue: 0,
//         completionRate: 0,
//         averageWatchTime: '',
//       },
//     };
//   } catch (error: any) {
//     throw new Error(error.response?.data?.error || 'Failed to fetch course');
//   }
// };


export const addTeacherCourse = async (formData: FormData): Promise<Course> => {
  try {
    const response = await instance.post('/teacher/courses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    const data = handleResponse(response);
    return {
      id: data._id || data.id,
      name: data.name,
      description: data.description,
      price: data.price || 0,
      thumbnailImage: data.thumbnailImage || '',
      coveringTopics: data.coveringTopics || [],
      chapters: data.chapters || [],
      createdBy: data.createdBy || '',
      courseStatus: data.courseStatus || 'pending',
      createdAt: data.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    handleError(error);
    throw new Error('Failed to create course');
  }
};

export const applyTeacher = async (): Promise<{ hasApplied: boolean }> => {
  try {
    const response = await instance.post('/teacher/apply', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data; // Returns { message, hasApplied }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to toggle application status');
  }
};