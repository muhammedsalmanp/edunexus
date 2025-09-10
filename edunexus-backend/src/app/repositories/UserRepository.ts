import { BaseUserEntity, StudentEntity, TeacherEntity, AdminEntity } from "../../domain/entities/UserEntity";
import { Email } from "../../domain/valueObjects/Email";
import { TeacherProfileDTO } from "../../domain/dtos/TeacherProfileDTO";
import { UpdateTeacherProfileDTO } from "../../domain/dtos/UpdateTeacherProfileDTO";
import { promises } from "dns";

export interface UserRepository {
  findByEmail(email: string): Promise<BaseUserEntity | null>;
  save<T extends BaseUserEntity>(user: T, role: 'student' | 'teacher' | 'admin'): Promise<T>;
  findByCredentials(email: string, password: string): Promise<BaseUserEntity | null>;
  updatePassword(email: string, hashedPassword: string): Promise<void>;
  verifyUser(email: string): Promise<void>;
  findAllByRole(role: 'student' | 'teacher' | 'admin'): Promise<BaseUserEntity[]>;
  getTeacherProfileById(id: string): Promise<TeacherProfileDTO | null>;
  updateTeacherProfile(id: string, updates: UpdateTeacherProfileDTO): Promise<TeacherProfileDTO | null>;
  findById(id: string): Promise<BaseUserEntity | null>
  updateUserBlockStatus(userId: string, isBlocked: boolean): Promise<BaseUserEntity | null>;
  updateUserApprovalStatus(userId: string,action: "approved" | "rejected"): Promise<BaseUserEntity | null> 
  apply(userId :string ): Promise <void>;
}