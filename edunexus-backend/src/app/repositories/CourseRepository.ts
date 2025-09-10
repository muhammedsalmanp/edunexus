import { CourseEntity } from '../../domain/entities/CourseEntity';
import { AddCourseDTO, UpdateCourseDTO } from '../../domain/entities/CourseEntity';

export interface CourseRepository {
  save(course: AddCourseDTO): Promise<CourseEntity>;
  findById(id: string): Promise<CourseEntity | null>;
  findByTeacherId(teacherId: string): Promise<CourseEntity[]>;
  update(id: string, updates: UpdateCourseDTO): Promise<CourseEntity | null>;
}