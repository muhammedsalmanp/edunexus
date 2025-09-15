import { Request, Response } from "express";

interface UseCase<T> {
  execute(...args: any[]): Promise<T>;
}

export function adaptGoogleLoginRoute<T extends object>(useCase: UseCase<T>) {
  return async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await useCase.execute(req.body);      
      const loginResult = result as {
        accessToken: string;
        refreshToken: string;
        user: {
          id: string;
          name: string;
          role: string;
          email: string;
        };
      };

      const { accessToken, refreshToken, user } = loginResult;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });


      return res.status(200).json({
        accessToken,
        user,
      });
    } catch (error: any) {
      console.error("Error in adaptGoogleLoginRoute:", {
        message: error.message,
        stack: error.stack,
      });

      return res.status(400).json({
        message: error.message || "An error occurred during Google login",
      });
    }
  };
}
