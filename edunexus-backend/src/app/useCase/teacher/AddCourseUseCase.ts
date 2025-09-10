import { CourseRepository } from '../../../app/repositories/CourseRepository';
import { CourseEntity } from '../../../domain/entities/CourseEntity';

interface AddCourseDTO {
  name: string;
  description: string;
  price: number;
  thumbnailImage: string;
  coveringTopics: string[];
  chapters: { name: string; description: string; videoUrl: string }[];
  createdBy: string;
}

export class AddCourseUseCase {
  constructor(private courseRepository: CourseRepository) {}

  async execute(dto: AddCourseDTO): Promise<CourseEntity> {
    const course: CourseEntity = {
      id: '',
      name: dto.name,
      description: dto.description,
      price: dto.price,
      thumbnailImage: dto.thumbnailImage,
      coveringTopics: dto.coveringTopics,
      chapters: dto.chapters.map(chapter => ({
        name: chapter.name,
        description: chapter.description,
        video: chapter.videoUrl,
      })),
      createdBy: dto.createdBy,
      courseStatus: 'pending',
      createdAt: new Date(),
    };

    return await this.courseRepository.save(course);
  }
}