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


const _useRepo = new userRepository();
const _OtpRepo = new otpRepository();
const _emailService = new EmailService();
const _tokenService = new TokenService();

const _registerTeacherUseCase = new RegisterTeacherUseCase(_useRepo);
const _registerUserUseCase = new RegisterUserUseCase(_useRepo);
const _registerAdminUseCase = new RegisterAdminUseCase(_useRepo);
const _authController = new AuthController(_registerTeacherUseCase, _registerUserUseCase, _registerAdminUseCase);
const _LoginUseCase = new  LoginUseCase(_useRepo , _tokenService);
const _SendOtpUseCase = new SendOtpUseCase(_OtpRepo,_emailService);
const _VerifyOtpUseCase = new VerifyOtpUseCase(_OtpRepo, _useRepo);
const _ForgotPasswordUseCase = new ForgotPasswordUseCase(_OtpRepo,_emailService);
const _ResetPasswordUseCase = new ResetPasswordUseCase(_useRepo, _OtpRepo);

route.post('/register/student', adaptRegisterRoute(_authController, 'student'));
route.post('/register/teacher', adaptRegisterRoute(_authController, 'teacher'));
route.post('/register/admin', adaptRegisterRoute(_authController, 'admin'));
route.post('/login', adaptRoute(_LoginUseCase));
route.post('/send-otp', adaptRoute(_SendOtpUseCase));
route.post('/verify-otp', adaptRoute(_VerifyOtpUseCase));
route.post('/forgot-password', adaptRoute(_ForgotPasswordUseCase));
route.post('/reset-password', adaptRoute(_ResetPasswordUseCase));

export default route;