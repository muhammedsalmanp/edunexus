import { IUserRepository } from "../../repositories/IUserRepository";
import { UpdateTeacherProfileDTO } from "../../../domain/dtos/UpdateTeacherProfileDTO";
import { TeacherProfileDTO } from "../../../domain/dtos/TeacherProfileDTO";

export class UpdateTeacherProfileUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(
    id: string,
    updates: UpdateTeacherProfileDTO,
    profilePicUrl?: string,
    certificateUrls?: { name: string; year?: number; image: string }[]
  ): Promise<TeacherProfileDTO | null> {
    if (!id) {
      console.error("UpdateTeacherProfileUseCase: Teacher ID is required");
      throw new Error("Teacher ID is required");
    }
    console.log("Entered use case");

    if (!updates || Object.keys(updates).length === 0) {
      console.error("UpdateTeacherProfileUseCase: No updates provided");
      throw new Error("No updates provided");
    }

    try {
      if (updates.experience !== undefined && updates.experience < 0) {
        console.error("UpdateTeacherProfileUseCase: Experience cannot be negative");
        throw new Error("Experience cannot be negative");
      }

      if (updates.qualifications !== undefined && !Array.isArray(updates.qualifications)) {
        console.error("UpdateTeacherProfileUseCase: Qualifications must be an array");
        throw new Error("Qualifications must be an array");
      }

      if (certificateUrls !== undefined && !Array.isArray(certificateUrls)) {
        console.error("UpdateTeacherProfileUseCase: Certificates must be an array of objects");
        throw new Error("Certificates must be an array of objects");
      }

      const updatedData: UpdateTeacherProfileDTO = { ...updates };
      if (profilePicUrl) updatedData.profilePic = profilePicUrl;
      if (certificateUrls) updatedData.certificates = certificateUrls;

      const updatedProfile = await this._userRepository.updateTeacherProfile(id, updatedData);
      if (!updatedProfile) {
        console.warn(`UpdateTeacherProfileUseCase: Failed to update profile for ID ${id}`);
        throw new Error(`Failed to update teacher profile for ID ${id}`);
      }

      console.info(`UpdateTeacherProfileUseCase: Successfully updated profile for ID ${id}`);
      return updatedProfile;
    } catch (error) {
      console.error(`UpdateTeacherProfileUseCase: Error updating profile for ID ${id}:`, error);
      throw error instanceof Error ? error : new Error(`Unexpected error updating profile for ID ${id}: ${error}`);
    }
  }
}