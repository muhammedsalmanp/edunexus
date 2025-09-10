import { OtpRepository } from '../../repositories/OtpRepository';
import { EmailService } from '../../../infrastructure/service/sendOtpEmail';
import { generateOtp } from '../../../infrastructure/utils/generateOtp';

export class SendOtpUseCase {
    constructor(private otpRepository: OtpRepository, private emailService: EmailService) {}

    async execute(email: string): Promise<{otp: string}> {
        try {
            if (!email) {
                throw new Error('Email is required');
            }

            const otp = generateOtp();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
            await this.otpRepository.deleteOtp(email);
            await this.otpRepository.createOtp(email, otp, expiresAt);
            console.log(`OTP generated for email: ${email}, OTP: ${otp}`);
            await this.emailService.sendOtpEmail(email, otp);

            return {otp}; 
            
        } catch (error) {
            throw error;
        }
    }
}