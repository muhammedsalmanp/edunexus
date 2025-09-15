// src/presentation/adapters/expressRouteAdapter.ts
import { Request, Response } from 'express';
import { HttpResponse } from '../http/HttpResponse';
import { IAuthController } from '../Controller/AuthController';

export const adaptRegisterRoute = (controller: IAuthController, role: 'student' | 'teacher' | 'admin') => {
  return async (req: Request, res: Response) => {
    try {
      const result = await controller.register(req.body, role);
      return HttpResponse.created(res, { userId: result.userId });
    } catch (error: any) {
      console.error(`Error in ${role} registration route:`, { message: error.message, stack: error.stack });
      const msg = error.message?.toLowerCase?.() || '';
      if (
        msg.includes('email already exists') ||
        msg.includes('invalid email') ||
        msg.includes('password too short')
      ) {
        return HttpResponse.badRequest(res, error.message);
      }
      return HttpResponse.serverError(res, error);
    }
  };
};