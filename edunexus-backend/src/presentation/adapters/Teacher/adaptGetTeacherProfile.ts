
import { Request, Response } from 'express';
import { GetTeacherProfileUseCase } from '../../../app/useCase/teacher/GetTeacherUserCase';

export const adaptGetTeacherProfile = (useCase: GetTeacherProfileUseCase) => {
  return async (req: Request, res: Response) => {
    try {
      const id = req.user?.id;
      if (!id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      console.log(' in get profile');
      
      const profile = await useCase.execute(id);
      if (!profile) {
        return res.status(404).json({ error: 'Teacher profile not found' });
      }
      console.log(profile);
      
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error });
    }
  };
};
