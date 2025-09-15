import { IUserRepository } from '../../repositories/IUserRepository';
import { IOtpRepository } from '../../repositories/IOtpRepository';
import bcrypt from 'bcrypt';

export class ResetPasswordUseCase {
  constructor(
    private _userRepository: IUserRepository, 
    private _otpRepository: IOtpRepository
  ) {}

  async execute({ email, otp, newPassword }: { email: string; otp: string; newPassword: string }): Promise<void> {
    try {
      console.log('Received input:', { email, otp, newPassword }); 
      if (!email || !otp || !newPassword) {
        throw new Error('Email, OTP, and new password are required');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this._userRepository.updatePassword(email, hashedPassword);
      await this._otpRepository.deleteOtp(email);
    } catch (error) {
      throw error;
    }
  }
}