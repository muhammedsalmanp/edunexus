export class OtpEntity {
    constructor (
        public readonly email: string,
        public readonly otp: string,
        public readonly expiresAt: Date
    ){}
}

