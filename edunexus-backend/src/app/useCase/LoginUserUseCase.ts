import { BaseUserEntity } from '../../domain/entities/UserEntity';
import { LoginUserDTO } from '../../domain/dtos/LoginUserDTO';
import { IUserRepository } from '../repositories/IUserRepository';
import * as jwt from 'jsonwebtoken';

export class LoginUserUseCase {
    constructor(private _userRepository: IUserRepository) {}

    async execute(dto: LoginUserDTO): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            if (!dto.email || !dto.password) {
                throw new Error('Email and password are required');
            }

            const user = await this._userRepository.findByCredentials(dto.email, dto.password);
            if (!user) {
                throw new Error('Invalid email or password');
            }

            const accessToken = jwt.sign(
                { id: user.id, role: 'user' },
                process.env.JWT_SECRET || 'default-secret',
                { expiresIn: '15m' }
            );
            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.REFRESH_TOKEN_SECRET || 'default-refresh-secret',
                { expiresIn: '7d' }
            );

            return { accessToken, refreshToken };
        } catch (error) {
            throw error;
        }
    }
}