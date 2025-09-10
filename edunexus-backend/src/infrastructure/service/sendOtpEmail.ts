import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export class EmailService {
    async sendOtpEmail(to: string, otp: string): Promise<void> {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to,
            subject: 'Your OTP Code from - EDUNEXUS',
            html: `
                <div style="font-family: sans-serif; line-height: 1.5;">
                    <h2>EduNexus OTP Verification</h2>
                    <p>Your OTP is:</p>
                    <h1 style="letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP is valid for 5 minutes.</p>
                    <p>If you did not request this, please ignore.</p>
                </div>
            `,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('OTP Email sent:', info.response);
        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }
}