import { IOtpRepository } from '../../repositories/IOtpRepository';
import { IUserRepository } from '../../repositories/IUserRepository';
export class VerifyOtpUseCase {
    constructor(
        private _otpRepository: IOtpRepository,
        private _userepository: IUserRepository,
    ) {}

    async execute({ email, otp }: { email: string; otp: string }): Promise<boolean> {
        try {

            console.log(otp);
            if (!email || !otp) {
                throw new Error('Email and OTP are required');
            }

            const otpEntity = await this._otpRepository.findOtp(email);
            if (!otpEntity) {
                throw new Error('No OTP found for this email');
            }

            if (otpEntity.otp !== otp) {
                throw new Error('Invalid OTP');
            }

            if (new Date() > otpEntity.expiresAt) {
                await this._otpRepository.deleteOtp(email);
                throw new Error('OTP has expired');
            }

            await this._otpRepository.deleteOtp(email);
            await this._userepository.verifyUser(email);
            
            return true;
        } catch (error) {
            throw error;
        }
    }
}