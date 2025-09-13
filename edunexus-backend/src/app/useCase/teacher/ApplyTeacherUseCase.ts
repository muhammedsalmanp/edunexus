import { IUserRepository } from '../../repositories/IUserRepository';

export class ApplyTeacherUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<{ hasApplied: boolean }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role !== 'teacher') {
      throw new Error('Only teachers can apply');
    }
    await this.userRepository.apply(userId);
    const updatedUser = await this.userRepository.findById(userId);
    if (!updatedUser) {
      throw new Error('Failed to retrieve updated user');
    }
    return { hasApplied: updatedUser.isApplied || false };
  }
}