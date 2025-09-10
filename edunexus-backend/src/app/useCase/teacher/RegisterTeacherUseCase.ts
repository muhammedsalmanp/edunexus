import { TeacherEntity } from "../../../domain/entities/UserEntity";
import { RegisterTeacherDTO } from "../../../domain/dtos/RegisterTeacherDTO";
import { UserRepository } from "../../repositories/UserRepository";

import { Email } from "../../../domain/valueObjects/Email";
import { Phone } from "../../../domain/valueObjects/Phone";
import { Password } from "../../../domain/valueObjects/Password";

import { v4 as uuidv4 } from 'uuid'

export class RegisterTeacherUseCase {
    constructor(private userRepository: UserRepository) { };

    async execute(dto: RegisterTeacherDTO): Promise<TeacherEntity> {

        try {
            if (!dto.name || !dto.email || !dto.password || !dto.phone|| !dto.qualifications || !dto.experience) {
                throw new Error('Missing required fileds');
            };

            const existingUser = await this.userRepository.findByEmail(dto.email)
            if (existingUser) {
                throw new Error('User with this email already exists');
            };

            const email = Email.create(dto.email);
            const phone = Phone.create(dto.phone);
            const password = Password.create(dto.password);

            const user = new TeacherEntity(
                uuidv4(),
                dto.name,
                email,
                password,
                phone,
                dto.qualifications,
                dto.experience,
            );

            const savedUser = await this.userRepository.save(user, 'teacher');

            if (!savedUser) {
                throw new Error('Failed to save user');
            }

            return savedUser;

        } catch (error) {

            throw error;
        }

    }
}