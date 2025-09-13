import { CourseRepository } from '../../repositories/CourseRepository';
import { CourseEntity } from '../../../domain/entities/CourseEntity';
import { UserModel } from '../../../infrastructure/database/models/UserModel';

export class GetTeacherCoursesUseCase {
  constructor(private _courseRepository: CourseRepository) {}

  async execute(teacherId: string, requestingUserId: string): Promise<CourseEntity[]> {
    const user = await UserModel.findById(requestingUserId).exec();
    if (!user) {
      throw new Error('Requesting user not found');
    } 
   console.log("in use Case",teacherId);
   
    const teacher = await UserModel.findById(teacherId).exec();
    if (!teacher || teacher.role !== 'teacher') {
      throw new Error('Invalid teacher ID or user is not a teacher');
    }
    const courses = await this._courseRepository.findByTeacherId(teacherId);
    if (user.role === 'student') {
      return courses.filter(course => course.courseStatus === 'published');
    }
    if (user.role === 'teacher' && requestingUserId !== teacherId) {
      throw new Error('Access denied: Teachers can only view their own courses');
    }

    return courses;
  }
}