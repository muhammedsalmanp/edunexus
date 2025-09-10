
import { Request, Response } from 'express';
import { GetTeacherProfileUseCase } from '../../../app/useCase/teacher/GetTeacherUserCase';

export const adaptGetTeacherProfile = (useCase: GetTeacherProfileUseCase) => {
  return async (req: Request, res: Response) => {
    try {
      const id = req.params?.id;
      if (!id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const profile = await useCase.execute(id);
      console.log(profile);
      
      if (!profile) {
        return res.status(404).json({ error: 'Teacher profile not found' });
      }

      res.json(profile);
    } catch (error) {
      res.status(400).json({ error });
    }
  };
};
