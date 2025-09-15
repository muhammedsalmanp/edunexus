import { Request, Response } from 'express';
import { RefreshTokenUseCase } from '../../app/useCase/RefreshTokenUseCase';

export class RefreshTokenController {
  constructor(private _refreshTokenUseCase: RefreshTokenUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not found in request' });
      }

      const result = await this._refreshTokenUseCase.execute(req.user);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in RefreshTokenController:', error.message);

      return res.status(400).json({
        message: error.message || 'An error occurred during token refresh',
      });
    }
  }
}
