import { Request, Response } from 'express';
import { HttpResponse } from '../http/HttpResponse';


export function adaptRegisterRoute(useCase: any) {
  return async (req: Request, res: Response) => {
    try {
      const user = await useCase.execute(req.body); // Execute the use case

      // Return the created user response
      return HttpResponse.created(res, {
        id: user.id,
        name: user.name,
        email: user.email.value,
        phone: user.phone.value,
        createdAt: user.createdAt,
      });
    } catch (error: any) {
      console.log('Error in adaptRegisterRoute:', {
        message: error.message,
        stack: error.stack,
        requestBody: req.body,
      });

      // Handle specific error messages for each case
      const errorMessage = error.message?.toLowerCase?.() || '';
      if (
        errorMessage.includes('user with this email already exists') ||
        errorMessage.includes('invalid email') ||
        errorMessage.includes('password too short') ||
        errorMessage.includes('phone number must be 10 digits')
      ) {
        return HttpResponse.badRequest(res, error.message);
      }

      // Return a generic server error if the issue is not specific
      return HttpResponse.serverError(res, error);
    }
  };
}
