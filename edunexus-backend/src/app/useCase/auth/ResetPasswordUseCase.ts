import { IUserRepository } from '../../repositories/IUserRepository';
import { OtpRepository } from '../../repositories/OtpRepository';
import bcrypt from 'bcrypt';

export class ResetPasswordUseCase {
  constructor(private userRepository: IUserRepository, private otpRepository: OtpRepository) {}

  async execute({ email, otp, newPassword }: { email: string; otp: string; newPassword: string }): Promise<void> {
    try {
      console.log('Received input:', { email, otp, newPassword }); 
      if (!email || !otp || !newPassword) {
        throw new Error('Email, OTP, and new password are required');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepository.updatePassword(email, hashedPassword);
      await this.otpRepository.deleteOtp(email);
    } catch (error) {
      throw error;
    }
  }
}