import { IUserRepository } from '../../repositories/IUserRepository';
import { UserResponse } from '../../../domain/entities/UserEntity';

export class GetAllTeachersUseCase {
  constructor(private _userRepository: IUserRepository) {}

    async execute(): Promise<UserResponse[]> {

    try {
      const users = await this._userRepository.findAllByRole('teacher');
      return users.map(user => ({
        id:user.id,
        name: user.name,
        email: user.email.value, 
        phone: user.phone,
        isVerified: user.isVerified,
        isBlocked:user.isBlocked,
        approvedByAdmin: user.approvedByAdmin,
        createdAt: user.createdAt,
      }));
    } catch (error) {
      throw error;
    }

  }
  
}