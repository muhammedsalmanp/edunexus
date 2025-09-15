import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { TokenService } from "../../infrastructure/service/TokenService";
import { userRepository } from "../../infrastructure/repositories/UserRepository";
import { StudentEntity } from "../../domain/entities/UserEntity";
import { Email } from "../../domain/valueObjects/Email";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class googleAuthController {
  constructor(
    private readonly _userRepository: userRepository,
    private readonly _tokenService: TokenService
  ) {}

  async googleLogin(req: Request, res: Response) {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).json({ message: "Google ID Token is required" });
      }

      // 1. Verify with Google
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.status(400).json({ message: "Invalid Google Token" });
      }

      const email = payload.email;
      const name = payload.name || "Google User";

      // 2. Check if user exists
      let user = await this._userRepository.findByEmail(email);

      if (!user) {
        // Create default StudentEntity (no password, no phone yet)
        user = new StudentEntity(
          crypto.randomUUID(),
          name,
          Email.create(email),
          null, // password not needed
          null, // phone not provided by Google
          true, // isVerified
          false, // isBlocked
          "approved",
          false, // isApplied
          true,  // isActive
        );

        await this._userRepository.save(user, "student");
      }

      // 3. Generate JWT tokens
      const accessToken = this._tokenService.generateAccessToken(user.id, user.role);
      const refreshToken = this._tokenService.generateRefreshToken(user.id, user.role);

      return res.json({
        message: "Google login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email.value,
          role: user.role,
        },
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      console.error("Google login error:", error);
      res.status(500).json({ message: "Google login failed" });
    }
  }
}
