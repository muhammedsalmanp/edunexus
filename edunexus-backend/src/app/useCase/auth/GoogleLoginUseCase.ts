import { IUserRepository } from '../../repositories/IUserRepository';
import { BaseUserEntity } from '../../../domain/entities/UserEntity';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { Email } from '../../../domain/valueObjects/Email';
import { v4 as uuidv4 } from 'uuid';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface GoogleLoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    googleId?: string; 
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
  };
}


export class GoogleLoginUseCase {
    constructor(private _userRepository: IUserRepository) { }

 
    async execute({
        token,
        role,
    }: {
        token: string;
        role: 'student' | 'teacher' | 'admin';
    }): Promise<GoogleLoginResult> {
        if (!token || !role) {
            throw new Error('Token and role are required');
        }
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload?.sub || !payload?.email || !payload?.name) {
            throw new Error('Invalid Google token');
        }
        let user: BaseUserEntity | null = await this._userRepository.findByGoogleId(payload.sub);
        if (!user) {
            user = await this._userRepository.createFromGoogle({
                id: uuidv4(),
                googleId: payload.sub,  
                email: payload.email,    
                name: payload.name,      
                picture: payload.picture,
                role,
            });

        }

        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'default-secret',
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET || 'default-refresh-secret',
            { expiresIn: '7d' }
        );
        return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name || 'Unknown',
          role: user.role,
          email: user.email.value,
        },
        };
    }
}
