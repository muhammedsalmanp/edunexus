import { Request, Response } from 'express';
import { HttpResponse } from '../http/HttpResponse'; 

export interface UseCase<T> {
  execute(): Promise<T>;
}

export function adaptRoute<T extends UseCase<any>>(useCase: T) {
  return async (req: Request, res: Response) => {
    try {
       const id = req.user?.id;
      if (!id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      const result = await useCase.execute(); 
       
        return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      HttpResponse.serverError(res, error); 
    }
  };
}
