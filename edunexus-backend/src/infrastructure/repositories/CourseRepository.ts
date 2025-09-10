import { CourseRepository } from '../../app/repositories/CourseRepository';
import { CourseModel } from '../database/models/CourseModel';
import { CourseEntity } from '../../domain/entities/CourseEntity';
import { AddCourseDTO, UpdateCourseDTO } from '../../domain/entities/CourseEntity';
import { UserModel } from '../database/models/UserModel';

export class courseRepository implements CourseRepository {
  async save(course: AddCourseDTO): Promise<CourseEntity> {
    const user = await UserModel.findById(course.createdBy).exec();
    if (!user) {
      throw new Error('Invalid createdBy: User does not exist');
    }
    if (user.role !== 'teacher') {
      throw new Error('Only users with role "teacher" can create courses');
    }

    const newCourse = new CourseModel({
      id: require('crypto').randomBytes(16).toString('hex'),
      name: course.name,
      description: course.description,
      price: course.price,
      thumbnailImage: course.thumbnailImage,
      coveringTopics: course.coveringTopics,
      chapters: course.chapters,
      createdBy: course.createdBy,
      courseStatus: course.courseStatus
    });

    await newCourse.save();
    return new CourseEntity(
      newCourse.id,
      newCourse.name,
      newCourse.description,
      newCourse.price,
      newCourse.thumbnailImage,
      newCourse.coveringTopics,
      newCourse.chapters,
      newCourse.createdBy.toString(),
      newCourse.courseStatus,
      newCourse.createdAt
    );
  }

  async findById(id: string): Promise<CourseEntity | null> {
    const courseDoc = await CourseModel.findOne({ id })
      .populate('createdBy', 'name email role')
      .exec();
    if (!courseDoc) return null;

    return new CourseEntity(
      courseDoc.id,
      courseDoc.name,
      courseDoc.description,
      courseDoc.price,
      courseDoc.thumbnailImage,
      courseDoc.coveringTopics,
      courseDoc.chapters,
      courseDoc.createdBy.toString(),
      courseDoc.courseStatus,
      courseDoc.createdAt
    );
  }

  async findByTeacherId(teacherId: string): Promise<CourseEntity[]> {
    const user = await UserModel.findById(teacherId).exec();
    if (!user || user.role !== 'teacher') {
      throw new Error('Invalid teacher ID or user is not a teacher');
    }

    const courseDocs = await CourseModel.find({ createdBy: teacherId })
      .populate('createdBy', 'name email role')
      .exec();

    return courseDocs.map(courseDoc => new CourseEntity(
      courseDoc.id,
      courseDoc.name,
      courseDoc.description,
      courseDoc.price,
      courseDoc.thumbnailImage,
      courseDoc.coveringTopics,
      courseDoc.chapters,
      courseDoc.createdBy.toString(),
      courseDoc.courseStatus,
      courseDoc.createdAt
    ));
  }

  async update(id: string, updates: UpdateCourseDTO): Promise<CourseEntity | null> {
    if (updates.createdBy) {
      const user = await UserModel.findById(updates.createdBy).exec();
      if (!user) {
        throw new Error('Invalid createdBy: User does not exist');
      }
      if (user.role !== 'teacher') {
        throw new Error('Only users with role "teacher" can be set as course creator');
      }
    }

    const updateData: any = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.description) updateData.description = updates.description;
    if (updates.price) updateData.price = updates.price;
    if (updates.thumbnailImage) updateData.thumbnailImage = updates.thumbnailImage;
    if (updates.coveringTopics) updateData.coveringTopics = updates.coveringTopics;
    if (updates.chapters) updateData.chapters = updates.chapters;
    if (updates.createdBy) updateData.createdBy = updates.createdBy;
    if (updates.courseStatus) updateData.courseStatus = updates.courseStatus;

    const updatedCourse = await CourseModel.findOneAndUpdate({ id }, updateData, { new: true })
      .populate('createdBy', 'name email role')
      .exec();
    if (!updatedCourse) return null;

    return new CourseEntity(
      updatedCourse.id,
      updatedCourse.name,
      updatedCourse.description,
      updatedCourse.price,
      updatedCourse.thumbnailImage,
      updatedCourse.coveringTopics,
      updatedCourse.chapters,
      updatedCourse.createdBy.toString(),
      updatedCourse.courseStatus,
      updatedCourse.createdAt
    );
  }
}