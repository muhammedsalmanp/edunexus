import { IUserRepository } from "../../repositories/IUserRepository";
import { TeacherProfileDTO } from "../../../domain/dtos/TeacherProfileDTO";

export class GetTeacherProfileUseCase {
    constructor(private userRepository: IUserRepository) { };

    async execute(id: string): Promise<TeacherProfileDTO | null> {
        if (!id) {
            throw new Error('Techer ID is requires');
        }

        try {
            const profile = await this.userRepository.getTeacherProfileById(id);
             console.log(profile?._id);
             
            if (!profile) {
                throw new Error('Teacher Profile not fount');
            }
            return profile;
        } catch (error) {
            throw error;
        }
    }
}