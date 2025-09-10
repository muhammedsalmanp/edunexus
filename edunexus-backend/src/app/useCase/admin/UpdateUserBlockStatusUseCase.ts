import { UserRepository } from "../../repositories/UserRepository";
import { BaseUserEntity } from "../../../domain/entities/UserEntity";

export class UpdateUserBlockStatusUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, currentUserRole?: string): Promise<BaseUserEntity | null> {

    if (!userId) {
      console.error("UpdateUserBlockStatusUseCase: User ID is required");
      throw new Error("User ID is required");
    }

    if (currentUserRole !== 'admin') {
      console.error("UpdateUserBlockStatusUseCase: Only admins can block/unblock users");
      throw new Error("Unauthorized: Admin access required");
    }

    try {

      const currentUser = await this.userRepository.findById(userId);
      if (!currentUser) {
        console.warn(`UpdateUserBlockStatusUseCase: User not found for ID ${userId}`);
        throw new Error(`User not found for ID ${userId}`);
      }


      const newIsBlocked = !currentUser.isBlocked;

      const updatedUser = await this.userRepository.updateUserBlockStatus(userId, newIsBlocked);
      if (!updatedUser) {
        console.warn(`UpdateUserBlockStatusUseCase: Failed to update block status for user ID ${userId}`);
        throw new Error(`Failed to update block status for user ID ${userId}`);
      }

      console.info(`UpdateUserBlockStatusUseCase: Successfully updated block status for user ID ${userId} to ${newIsBlocked}`);
      return updatedUser;
    } catch (error) {
      console.error(`UpdateUserBlockStatusUseCase: Error updating block status for user ID ${userId}:`, error);
      throw error instanceof Error ? error : new Error(`Unexpected error: ${error}`);
    }
  }

}

 