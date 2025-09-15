import { AdminEntity } from "../../../domain/entities/UserEntity";
import { RegisterUserDTO } from "../../../domain/dtos/RegisterUserDTO";
import { IUserRepository } from "../../repositories/IUserRepository";

import { Email } from "../../../domain/valueObjects/Email";
import { Password } from "../../../domain/valueObjects/Password";
import { Phone } from "../../../domain/valueObjects/Phone";

import { v4 as uuidv4 } from 'uuid';

export class RegisterAdminUseCase {

    constructor(private _userRepository: IUserRepository) {};

    async execute(dto: RegisterUserDTO): Promise<AdminEntity> {
        try {
            if (!dto.email || !dto.name || !dto.password || !dto.phone) {
                throw new Error('Missing required Fields');
            }

            const exists = await this._userRepository.findByEmail(dto.email);
            if (exists) {
                throw new Error('User with this email already exists');
            }

            const email = Email.create(dto.email);
            const password = Password.create(dto.password);
            const phone = Phone.create(dto.phone);

            const user = new AdminEntity(
                uuidv4(),
                dto.name,
                email,
                password,
                phone,
            )

            const savedUser = await this._userRepository.save(user, "admin");
            if (!savedUser) {
                throw new Error('Failed to save user');
            }

            return savedUser;

        } catch (error) {
            throw error
        }
    }
    
}