import { Request, Response, NextFunction } from 'express';
import { GetTeacherCoursesUseCase } from '../../../app/useCase/teacher/GetTeacherCoursesUseCase';

export const adaptGetTeacherCourses = (useCase: GetTeacherCoursesUseCase) => {
  return [
    async (req: Request, res: Response, next: NextFunction) => {
      console.log("in ter get coures ");
      
      try {
        const userId = req.user?.id;
        if (!userId) {
          console.error('Adapter: User not authenticated');
          return res.status(401).json({ error: 'User not authenticated' });
        }
  console.log("in ter get coures ");
        const courses = await useCase.execute(userId, userId);
        console.log(courses);
          console.log("in ter get coures ");
        res.status(200).json(courses);
        console.log(`Retrieved ${courses.length} courses for teacher ${userId}`);
      } catch (error) {
        console.error('Adapter Error getting teacher courses:', error);
        next(error);
      }
    },
  ];
};