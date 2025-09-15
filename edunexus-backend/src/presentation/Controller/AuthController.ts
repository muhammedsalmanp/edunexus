import { RegisterTeacherUseCase } from '../../app/useCase/teacher/RegisterTeacherUseCase';
import { RegisterUserUseCase } from '../../app/useCase/user/RegisterUserUseCase';
import { RegisterAdminUseCase } from '../../app/useCase/admin/RegisterAdminUseCase';

export interface IAuthController {
  register(data: any, role: 'student' | 'teacher' | 'admin'): Promise<{ userId: string }>;
}

export class AuthController implements IAuthController {
  private readonly _registerTeacherUseCase: RegisterTeacherUseCase;
  private readonly _registerUserUseCase: RegisterUserUseCase;
  private readonly _registerAdminUseCase: RegisterAdminUseCase;

  constructor(
    registerTeacherUseCase: RegisterTeacherUseCase,
    registerUserUseCase: RegisterUserUseCase,
    registerAdminUseCase: RegisterAdminUseCase
  ) {
    this._registerTeacherUseCase = registerTeacherUseCase;
    this._registerUserUseCase = registerUserUseCase;
    this._registerAdminUseCase = registerAdminUseCase;
  }

  async register(data: any, role: 'student' | 'teacher' | 'admin'): Promise<{ userId: string }> {
    const { name, email, password, phone, qualifications, experience, certificates } = data;

    let user;

    if (role === 'teacher') {
      user = await this._registerTeacherUseCase.execute({
        name,
        email,
        password,
        phone,
        qualifications,
        experience,
        certificates,
      });
    } else if (role === 'student') {
      user = await this._registerUserUseCase.execute({ name, email, password, phone, role });
    } else if (role === 'admin') {
      user = await this._registerAdminUseCase.execute({ name, email, password, phone, role });
    } else {
      throw new Error('Invalid role specified');
    }

    return { userId: user.id };
  }
}