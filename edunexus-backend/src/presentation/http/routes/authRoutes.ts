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

import { LoginUserUseCase } from "../../../app/useCase/LoginUserUseCase";
import { LoginUseCase } from "../../../app/useCase/auth/LoginUseCase";

import { EmailService } from "../../../infrastructure/service/sendOtpEmail";
import { userInfo } from "os";
import { TokenService } from "../../../infrastructure/service/TokenService";
const route = Router();

const useRepo = new userRepository();
const OtpRepo = new otpRepository();
const emailService = new EmailService();
const tokenService = new TokenService();

route.post('/register/student',adaptRegisterRoute( new RegisterUserUseCase(useRepo)));
route.post('/register/teacher', adaptRegisterRoute(new RegisterTeacherUseCase(useRepo)));
route.post('/register/admin', adaptRegisterRoute(new RegisterAdminUseCase(useRepo)));

route.post('/login',adaptRoute(new LoginUseCase(useRepo,tokenService)));

route.post('/send-otp', adaptRoute(new SendOtpUseCase(OtpRepo, emailService)));
route.post('/verify-otp', adaptRoute(new VerifyOtpUseCase(OtpRepo,useRepo)));

route.post('/forgot-password',adaptRoute(new ForgotPasswordUseCase(OtpRepo, emailService)));
route.post('/reset-password', adaptRoute(new ResetPasswordUseCase(useRepo, OtpRepo)));

export default route;  