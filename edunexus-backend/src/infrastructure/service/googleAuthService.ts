import bcrypt from "bcrypt";
import { TokenService } from "./TokenService";
import { userRepository } from "../../infrastructure/repositories/UserRepository";
import { StudentEntity, BaseUserEntity } from "../../domain/entities/UserEntity";
import { Email } from "../../domain/valueObjects/Email";
import { Password } from "../../domain/valueObjects/Password";
import { Phone } from "../../domain/valueObjects/Phone";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  constructor(
    private readonly _userRepository: userRepository,
    private readonly _tokenService: TokenService
  ) {}

  // 🔹 Normal Login
  async login(email: string, password: string) {
    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    if (!user.password) throw new Error("Password not set (Google account)");

    const isMatch = await bcrypt.compare(password, user.password.value);
    if (!isMatch) throw new Error("Invalid credentials");

    return this.generateTokens(user);
  }

  // 🔹 Google Login
  async googleLogin(idToken: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) throw new Error("Invalid Google token");

    const email = payload.email;
    const name = payload.name || "Google User";

    let user = await this._userRepository.findByEmail(email);

    if (!user) {
      // New Google user → create StudentEntity by default
      user = new StudentEntity(
        crypto.randomUUID(),
        name,
        Email.create(email),
        null, // no password for Google login
        null, // no phone initially
        true, // isVerified
        false, // isBlocked
        "approved",
        false, // isApplied
        true,  // isActive
      );

      await this._userRepository.save(user, "student");
    }

    return this.generateTokens(user);
  }

  // 🔹 Helper: Generate JWT tokens
  private generateTokens(user: BaseUserEntity) {
    const accessToken = this._tokenService.generateAccessToken(user.id, user.role);
    const refreshToken = this._tokenService.generateRefreshToken(user.id, user.role);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email.value,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
      },
    };
  }
}
