import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';

interface UseCase<T extends object> {
  execute(...args: any[]): Promise<T>;
}

export function adaptLoginRoute<T extends object>(useCase: UseCase<T>) {
  return async (req: Request, res: Response): Promise<Response> => {
    try {
      console.log('Request body:', req.body);


      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const input = {
        email: req.body.email,
        password: req.body.password,
      };

      console.log('Prepared input:', input);

      const result = await useCase.execute(input);

      const loginResult = result as { token: string; refreshToken: string; user: { id: string; name: string; role: string; email: string } };

      console.log(loginResult);

      const { token, refreshToken, user } = loginResult;

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });

      return res.status(200).json({
        accessToken: token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
        },
      });

    } catch (error: any) {
      console.log('Error in adaptLoginRoute:', {
        message: error.message,
        stack: error.stack,
      });

      return res.status(400).json({
        message: error.message || 'An error occurred during login',
      });
    }
  };
}

