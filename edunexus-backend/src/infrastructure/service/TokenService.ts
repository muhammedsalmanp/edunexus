import jwt, { SignOptions } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export class TokenService {
  private readonly secret: string = process.env.JWT_SECRET || 'default-secret';
  private readonly refreshSecret: string = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
  private readonly accessTokenExpiry: string = '15m'; 
  private readonly refreshTokenExpiry: string = '7d'; 

  generateAccessToken(userId: string, role: string): string {
    const payload = { userId, role };
    const options: SignOptions = { expiresIn: '15m' };
    return jwt.sign(payload, this.secret, options);
  }

  generateRefreshToken(userId: string, role: string): string {
    const payload = { userId, role };
    const options: SignOptions = { expiresIn:'7d'};
    return jwt.sign(payload, this.refreshSecret, options);
  }

  verifyAccessToken(token: string): { userId: string; role: string } | null {
    try {
      return jwt.verify(token, this.secret) as { userId: string; role: string };
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): { userId: string; role: string } | null {
    try {
      return jwt.verify(token, this.refreshSecret) as { userId: string; role: string };
    } catch (error) {
      return null;
    }
  }
}