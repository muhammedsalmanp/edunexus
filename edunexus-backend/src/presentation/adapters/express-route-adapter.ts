import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';

interface UseCase<T> {
  execute(...args: any[]): Promise<T>;
}

export function adaptRoute<T>(useCase: UseCase<T>) {
  return async (req: Request, res: Response) => {
    try {
      console.log('Request body:', req.body);

      let input;

      if (req.body.email && req.body.otp && req.body.newPassword) {
        input = {
          newPassword: req.body.newPassword,
          email: req.body.email,
          otp: req.body.otp,
        };

      } else if (req.body.email && req.body.password) {
        input = {
          email: req.body.email,
          password: req.body.password,
        };

      } else if (req.body.email && req.body.otp) {
        input = { email: req.body.email, otp: req.body.otp };

      } else if (req.body.email) {
        input = req.body.email;

      } else {
        input = req.body;
      }

      console.log('Prepared input:', input);

      const result = await useCase.execute(input);
      
 console.log(result);
 
      if (req.body.email && req.body.password && 'accessToken' in (result as any)) {
        const loginResult = result as { accessToken: string; refreshToken: string };

        res.cookie('refreshToken', loginResult.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, 
        });
        console.log(loginResult.accessToken);

         console.log(loginResult.refreshToken);
        return res.status(200).json({ accessToken: loginResult.accessToken });
      }

      if (typeof result === 'boolean') {
        return res.status(result ? 200 : 400).json({
          message: result ? 'OTP verified' : 'Invalid OTP',
        });
      }

      return res.status(200).json(result);

    } catch (error: any) {
      console.log('Error in adaptRoute:', {
        message: error.message,
        stack: error.stack,
      });

      return res.status(400).json({
        message: error.message || 'An error occurred',
      });
    }
  };
}
