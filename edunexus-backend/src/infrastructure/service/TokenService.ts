import jwt, { SignOptions } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export class TokenService {
  private readonly _secret: string = process.env.JWT_SECRET || 'default-secret';
  private readonly _refreshSecret: string = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
  private readonly _accessTokenExpiry: string = '15m'; 
  private readonly _refreshTokenExpiry: string = '7d'; 

  generateAccessToken(userId: string, role: string): string {
    const payload = { userId, role };
    const options: SignOptions = { expiresIn: '15m' };
    return jwt.sign(payload, this._secret, options);
  }

  generateRefreshToken(userId: string, role: string): string {
    const payload = { userId, role };
    const options: SignOptions = { expiresIn:'7d'};
    return jwt.sign(payload, this._refreshSecret, options);
  }

  verifyAccessToken(token: string): { userId: string; role: string } | null {
    try {
      return jwt.verify(token, this._secret) as { userId: string; role: string };
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): { userId: string; role: string } | null {
    try {
      return jwt.verify(token, this._refreshSecret) as { userId: string; role: string };
    } catch (error) {
      return null;
    }
  }
}