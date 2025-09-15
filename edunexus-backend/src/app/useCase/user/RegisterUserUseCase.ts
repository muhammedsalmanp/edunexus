import { StudentEntity } from '../../../domain/entities/UserEntity';
import { RegisterUserDTO } from '../../../domain/dtos/RegisterUserDTO';
import { IUserRepository } from '../../repositories/IUserRepository';
import { Email } from '../../../domain/valueObjects/Email';
import { Password } from '../../../domain/valueObjects/Password';
import { Phone } from '../../../domain/valueObjects/Phone';
import { v4 as uuidv4 } from 'uuid';

export class RegisterUserUseCase {
    constructor(private _userRepository: IUserRepository) { }

   async execute(dto: RegisterUserDTO): Promise<StudentEntity> {
    try {
        if (!dto || !dto.email || !dto.name || !dto.password || !dto.phone || !dto.role) {
            throw new Error('Missing required fields');
        }

        
        const validRoles = ['student', 'teacher', 'admin'] as const;
        if (!validRoles.includes(dto.role)) {
            throw new Error('Invalid role. Must be "student", "teacher", or "admin"');
        }

        const existingUser = await this._userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const email = Email.create(dto.email);
        const password = Password.create(dto.password);
        const phone = Phone.create(dto.phone);
        const user = new StudentEntity(
            uuidv4(),
            dto.name,
            email,
            password,
            phone,
        );

        const savedUser = await this._userRepository.save(user,'student');
        if (!savedUser) {
            throw new Error('Failed to save user');
        }

        return savedUser;

    } catch (error) {
        throw error;
    }
}
}