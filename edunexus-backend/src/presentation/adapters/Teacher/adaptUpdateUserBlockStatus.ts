import { Request, Response, NextFunction } from 'express';
import { UpdateUserBlockStatusUseCase } from '../../../app/useCase/admin/UpdateUserBlockStatusUseCase';

export const adaptUpdateUserBlockStatus = (useCase: UpdateUserBlockStatusUseCase) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const currentUserRole = req.user?.role;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const updatedUser = await useCase.execute(userId, currentUserRole);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
        
      res.json({ message: `User ${userId} block status updated to ${updatedUser.isBlocked}`, user: updatedUser });
    } catch (error) {
      next(error);
    }
  };
};