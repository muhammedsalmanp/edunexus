import { IUserRepository } from '../../repositories/IUserRepository';
import { TokenService } from '../../../infrastructure/service/TokenService';
import { UserResponse } from '../../../domain/types/UserResponse'; 

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: TokenService
  ) {}

  async execute({ email, password }: { email: string; password: string }): Promise<{
    token: string;
    refreshToken: string;
    user: UserResponse;
  }> {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const user = await this.userRepository.findByCredentials(email, password);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const token = this.tokenService.generateAccessToken(user.id, user.role);
      const refreshToken = this.tokenService.generateRefreshToken(user.id, user.role);

      return {
        token,
        refreshToken,
        user: {
          id: user.id,
          name: user.name || 'Unknown',
          role: user.role,
          email: user.email,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}