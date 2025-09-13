import { Router } from "express";
import { adaptRoute } from "../../adapters/express-route-adapter";
import { adaptRegisterRoute } from "../../adapters/expressRouteAdapter";
import { adaptLoginRoute } from "../../adapters/adaptLoginRoute";
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

const route = Router();

// DI Container for registration routes (use _ prefix)
const _useRepo = new userRepository();
const _registerTeacherUseCase = new RegisterTeacherUseCase(_useRepo);
const _registerUserUseCase = new RegisterUserUseCase(_useRepo);
const _registerAdminUseCase = new RegisterAdminUseCase(_useRepo);
const _authController = new AuthController(_registerTeacherUseCase, _registerUserUseCase, _registerAdminUseCase);

// Resource-based register routes
route.post('/register/student', adaptRegisterRoute(_authController, 'student'));
route.post('/register/teacher', adaptRegisterRoute(_authController, 'teacher'));
route.post('/register/admin', adaptRegisterRoute(_authController, 'admin'));

// Non-registration routes (unchanged)
const OtpRepo = new otpRepository();
const emailService = new EmailService();
const tokenService = new TokenService();

route.post('/login', adaptRoute(new LoginUseCase(_useRepo, tokenService)));
route.post('/send-otp', adaptRoute(new SendOtpUseCase(OtpRepo, emailService)));
route.post('/verify-otp', adaptRoute(new VerifyOtpUseCase(OtpRepo, _useRepo)));
route.post('/forgot-password', adaptRoute(new ForgotPasswordUseCase(OtpRepo, emailService)));
route.post('/reset-password', adaptRoute(new ResetPasswordUseCase(_useRepo, OtpRepo)));

export default route;