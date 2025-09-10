export function generateOtp(length: number = 6): string {
  const max = Math.pow(10, length);
  const otp = Math.floor(Math.random() * max).toString().padStart(length, "0");
  return otp;
}
