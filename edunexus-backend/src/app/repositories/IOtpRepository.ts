import { OtpEntity } from "../../domain/entities/OtpEntity";

export interface IOtpRepository {
    createOtp(email: string, otp: string, expiresAt: Date): Promise<void>;
    deleteOtp(email: string): Promise<void>;
    findOtp(email: string): Promise<OtpEntity | null>;
}