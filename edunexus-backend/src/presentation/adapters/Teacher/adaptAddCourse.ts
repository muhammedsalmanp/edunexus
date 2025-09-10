import { Request, Response, NextFunction } from 'express';
import { AddCourseUseCase } from '../../../app/useCase/teacher/AddCourseUseCase';

export function adaptAddCourse(addCourseUseCase: AddCourseUseCase) {
  return [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user || !req.user.id) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const thumbnail = files?.['thumbnail']?.[0];
        const chapterFiles = files?.['chapters'] || [];

        if (!thumbnail || chapterFiles.length !== req.body.chapters.length) {
          return res.status(400).json({ error: 'Missing required files' });
        }

        const course = await addCourseUseCase.execute({
          name: req.body.name,
          description: req.body.description,
          price: parseFloat(req.body.price),
          thumbnailImage: req.body.thumbnailImage,
          coveringTopics: JSON.parse(req.body.coveringTopics),
          chapters: req.body.chapters.map((chapter: any, index: number) => ({
            name: chapter.name,
            description: chapter.description,
            videoUrl: req.body.chapterVideos[index],
          })),
          createdBy: req.user.id,
        });

        res.status(201).json(course);
      } catch (error) {
        next(error);
      }
    },
  ];
}
