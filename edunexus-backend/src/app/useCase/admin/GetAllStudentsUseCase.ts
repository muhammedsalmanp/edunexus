import { UserRepository } from '../../repositories/UserRepository';
import { UserResponse } from '../../../domain/entities/UserEntity';

export class GetAllStudentsUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<UserResponse[]> {
    try {
      const users = await this.userRepository.findAllByRole('student');
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