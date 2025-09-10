import { Request, Response } from 'express';
import { ApplyTeacherUseCase } from '../../../app/useCase/teacher/ApplyTeacherUseCase';


export const adaptApplyTeacher = (useCase: ApplyTeacherUseCase) => {
  return async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id; 
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const result = await useCase.execute(userId);
      console.log(result);
      
      return res.status(200).json({
        message: result.hasApplied ? 'Application submitted successfully' : 'Application cancelled successfully',
        hasApplied: result.hasApplied,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Failed to toggle application status' });
    }
  };
};