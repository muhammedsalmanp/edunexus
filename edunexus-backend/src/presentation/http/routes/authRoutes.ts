import { Router } from "express";
import { adaptRoute } from "../../adapters/express-route-adapter";
import { adaptRegisterRoute } from "../../adapters/expressRouteAdapter";
import { adaptGoogleLoginRoute } from "../../adapters/adaptLoginRoute";
import { userRepository } from "../../../infrastructure/repositories/UserRepository";
import { otpRepository } from "../../../infrastructure/repositories/OtpRepository";
import { RegisterTeacherUseCase } from "../../../app/useCase/teacher/RegisterTeacherUseCase";
import { RegisterUserUseCase } from "../../../app/useCase/user/RegisterUserUseCase";
import { RegisterAdminUseCase } from "../../../app/useCase/admin/RegisterAdminUseCase";
import { SendOtpUseCase } from "../../../app/useCase/auth/SendOtpUseCase";
import { VerifyOtpUseCase } from "../../../app/useCase/auth/VerifyOtpUseCase";
import { ForgotPasswordUseCase } from "../../../app/useCase/auth/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "../../../app/useCase/auth/ResetPasswordUseCase";
import { LoginUseCase } from "../../../app/useCase/auth/LoginUseCase";
import { EmailService } from "../../../infrastructure/service/sendOtpEmail";
import { TokenService } from "../../../infrastructure/service/TokenService";
import { AuthController } from "../../Controller/AuthController";
import { RefreshTokenUseCase } from "../../../app/useCase/RefreshTokenUseCase";
import { refreshTokenMiddleware } from "../../../infrastructure/middleware/refreshTokenMiddleware";
import { RefreshTokenController } from "../../Controller/RefreshTokenController ";
import { RefreshTokenAdapter } from "../../adapters/RefreshTokenAdapter";
import { GoogleLoginUseCase } from "../../../app/useCase/auth/GoogleLoginUseCase";
import { AuthService } from "../../../infrastructure/service/googleAuthService";


const router = Router();


const useRepo = new userRepository();
const OtpRepo = new otpRepository();
const emailService = new EmailService();
const tokenService = new TokenService();
const authService = new AuthService( useRepo , tokenService);

const registerTeacherUseCase = new RegisterTeacherUseCase(useRepo);
const registerUserUseCase = new RegisterUserUseCase(useRepo);
const registerAdminUseCase = new RegisterAdminUseCase(useRepo);
const authController = new AuthController(registerTeacherUseCase, registerUserUseCase, registerAdminUseCase);
const loginUseCase = new  LoginUseCase(useRepo , tokenService);
const sendOtpUseCase = new SendOtpUseCase(OtpRepo,emailService);
const verifyOtpUseCase = new VerifyOtpUseCase(OtpRepo, useRepo);
const forgotPasswordUseCase = new ForgotPasswordUseCase(OtpRepo,emailService);
const resetPasswordUseCase = new ResetPasswordUseCase(useRepo, OtpRepo);
const refreshTokenUseCase = new RefreshTokenUseCase(tokenService);
const refreshTokenAdapter = new RefreshTokenAdapter(refreshTokenUseCase);
const googleLoginUseCase = new GoogleLoginUseCase(useRepo);

router.post('/register/student', adaptRegisterRoute(authController, 'student'));
router.post('/register/teacher', adaptRegisterRoute(authController, 'teacher'));
router.post('/register/admin', adaptRegisterRoute(authController, 'admin'));
router.post('/login', adaptRoute(loginUseCase));
router.post('/send-otp', adaptRoute(sendOtpUseCase));
router.post('/verify-otp', adaptRoute(verifyOtpUseCase));
router.post('/forgot-password', adaptRoute(forgotPasswordUseCase));
router.post('/reset-password', adaptRoute(resetPasswordUseCase));
router.post('/refresh-token', refreshTokenMiddleware,  refreshTokenAdapter.execute.bind(refreshTokenAdapter))
router.post('/google', adaptGoogleLoginRoute(googleLoginUseCase));


export default router;