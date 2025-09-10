import { OtpRepository } from "../../repositories/OtpRepository";
import { EmailService } from "../../../infrastructure/service/sendOtpEmail";
import { SendOtpUseCase } from "./SendOtpUseCase";


export class ForgotPasswordUseCase {
    constructor(
        private otpRepository: OtpRepository,
        private emailService: EmailService,
    ) { };

    async execute(email: string): Promise<{ otp: string }> {
        try {

            if (!email) {
                throw new Error('Email is required');
            }

            const setOtpUseCase = new SendOtpUseCase(this.otpRepository, this.emailService);
            return await setOtpUseCase.execute(email);
            
        } catch (error) {
            throw error;
        }
    }
    
}