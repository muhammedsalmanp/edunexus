import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../service/TokenService';
import { userRepository } from '../repositories/UserRepository';

const tokenService = new TokenService();
const UserRepository = new userRepository();

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.log("in refressh token");
  
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }
  console.log("got refresh Token",refreshToken)
  const payload = tokenService.verifyRefreshToken(refreshToken);
  if (!payload) {
    console.log("invalid Refresh token:",payload);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const user = await UserRepository.findById(payload.userId);
  if (!user) {
    return res.status(403).json({ message: 'User not found' });
  }

  req.user = user; 
  next();
};