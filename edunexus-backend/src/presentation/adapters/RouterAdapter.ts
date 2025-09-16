import { Request, Response } from 'express';
import { HttpResponse } from '../http/HttpResponse';

export interface UseCase<T, P = any> {
  execute(params?: P): Promise<T>;
}

export function adaptRoutewithFiltert<T extends UseCase<any, any>>(useCase: T) {
  return async (req: Request, res: Response) => {
    try {
      const id = req.user?.id;
      if (!id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;
      const search = req.query.search as string;
      const filter = req.query.filter as string;

      const result = await useCase.execute({ page, limit, search, filter });

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      HttpResponse.serverError(res, error);
    }
  };
}