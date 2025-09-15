import { IOtpRepository } from "../../repositories/IOtpRepository";
import { EmailService } from "../../../infrastructure/service/sendOtpEmail";
import { SendOtpUseCase } from "./SendOtpUseCase";


export class ForgotPasswordUseCase {
    constructor(
        private _otpRepository: IOtpRepository,
        private _emailService: EmailService,
    ) { };

    async execute(email: string): Promise<{ otp: string }> {
        try {

            if (!email) {
                throw new Error('Email is required');
            }

            const setOtpUseCase = new SendOtpUseCase(this._otpRepository, this._emailService);
            return await setOtpUseCase.execute(email);
            
        } catch (error) {
            throw error;
        }
    }
    
}