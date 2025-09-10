import { OtpRepository } from '../../app/repositories/OtpRepository';
import { OtpEntity } from '../../domain/entities/OtpEntity';
import { Schema, model } from 'mongoose';

const otpSchema = new Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

const OtpModel = model('Otp', otpSchema);

export class otpRepository implements OtpRepository {

    async createOtp(email: string, otp: string, expiresAt: Date): Promise<void> {
        await OtpModel.create({ email, otp, expiresAt });
    }

    async deleteOtp(email: string): Promise<void> {
        await OtpModel.deleteOne({ email });
    }

    async findOtp(email: string): Promise<OtpEntity | null> {
        const otpDoc = await OtpModel.findOne({ email }).exec();
        if (!otpDoc) return null;
        return new OtpEntity(otpDoc.email, otpDoc.otp, otpDoc.expiresAt);
    }
}

