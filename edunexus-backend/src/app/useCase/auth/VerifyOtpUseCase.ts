import { OtpRepository } from '../../repositories/OtpRepository';
import { IUserRepository } from '../../repositories/IUserRepository';
export class VerifyOtpUseCase {
    constructor(
        private otpRepository: OtpRepository,
        private userepository: IUserRepository,
    ) {}

    async execute({ email, otp }: { email: string; otp: string }): Promise<boolean> {
        try {

            console.log(otp);
            if (!email || !otp) {
                throw new Error('Email and OTP are required');
            }

            const otpEntity = await this.otpRepository.findOtp(email);
            if (!otpEntity) {
                throw new Error('No OTP found for this email');
            }

            if (otpEntity.otp !== otp) {
                throw new Error('Invalid OTP');
            }

            if (new Date() > otpEntity.expiresAt) {
                await this.otpRepository.deleteOtp(email);
                throw new Error('OTP has expired');
            }

            await this.otpRepository.deleteOtp(email);
            await this.userepository.verifyUser(email);
            
            return true;
        } catch (error) {
            throw error;
        }
    }
}