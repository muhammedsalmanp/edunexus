import { TokenService } from '../../infrastructure/service/TokenService';
import { UserResponse } from '../../domain/types/UserResponse';

export class RefreshTokenUseCase {
  private _tokenService: TokenService;

  constructor(tokenService: TokenService) {
    this._tokenService = tokenService;
  }

  async execute(user: any): Promise<{
    token: string;
    user: UserResponse;
  }> {
    const token = this._tokenService.generateAccessToken(user.id, user.role);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    };
  }
}
