import { IUserRepository } from '../../repositories/IUserRepository';
import { UserResponse } from '../../../domain/entities/UserEntity';

export class GetAllStudentsUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(): Promise<UserResponse[]> {
    try {
      const users = await this._userRepository.findAllByRole('student');
      return users.map(user => ({
        id:user.id,
        name: user.name,
        email: user.email.value, 
        phone:user.phone,
        isVerified: user.isVerified,
        isBlocked: user.isBlocked,
        createdAt: user.createdAt,
      }));
    } catch (error) {
      throw error;
    }
  }
  
}