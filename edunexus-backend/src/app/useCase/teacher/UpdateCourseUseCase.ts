
import { CourseRepository } from '../../../app/repositories/CourseRepository';
import { CourseEntity, UpdateCourseDTO } from '../../../domain/entities/CourseEntity';

export class UpdateCourseUseCase {
  constructor(private _courseRepository: CourseRepository) {}

  async execute(courseId: string, dto: UpdateCourseDTO): Promise<CourseEntity | null> {
    const course = await this._courseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const updatedCourse: UpdateCourseDTO = {
      name: dto.name || course.name,
      description: dto.description || course.description,
      price: dto.price !== undefined ? dto.price : course.price,
      thumbnailImage: dto.thumbnailImage || course.thumbnailImage,
      coveringTopics: dto.coveringTopics || course.coveringTopics,
      chapters: dto.chapters?.map(chapter => ({
        name: chapter.name,
        description: chapter.description,
        video: chapter.video,
      })) || course.chapters,
      createdBy: course.createdBy, // Retain original creator
      courseStatus: dto.courseStatus || course.courseStatus,
    };

    return await this._courseRepository.update(courseId, updatedCourse);
  }
}