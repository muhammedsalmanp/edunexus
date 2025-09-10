// useCases/UpdateTeacherApprovalUseCase.ts
import { UserRepository } from "../../repositories/UserRepository";
import type { BaseUserEntity } from "../../../domain/entities/UserEntity";

export class UpdateTeacherApprovalUseCase {
  constructor(private teacherRepository: UserRepository) { }

  async execute(teacherId: string, action: "approved" | "rejected", currentUserRole?: string, rejectionMessage?: string): Promise<BaseUserEntity> {
    if (!teacherId) throw new Error("Teacher ID is required");
    if (currentUserRole !== "admin") throw new Error("Unauthorized: Admin access required");
    if (action === "rejected" && !rejectionMessage) {
      throw new Error("Rejection message is required when rejecting a teacher");
    }
    const teacher = await this.teacherRepository.findById(teacherId);
    if (!teacher) throw new Error(`Teacher not found for ID ${teacherId}`);

    const updatedTeacher = await this.teacherRepository.updateUserApprovalStatus(teacherId, action);
    if (!updatedTeacher) throw new Error("Failed to update approval status");

    return updatedTeacher;
  }
}
