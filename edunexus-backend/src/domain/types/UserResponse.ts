import { Email } from "../valueObjects/Email";
import { Password } from "../valueObjects/Password";
import { Phone } from "../valueObjects/Phone";

// If in UserEntity.ts, append this; otherwise, create a new file
export interface UserResponse {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  email: Email;
  isBlocked?:boolean;
  approvedByAdmin?: 'pending' | 'approved' | 'rejected';
}

export interface BaseUserEntity {
  id: string;
  name: string;
  email: Email;
  password?: Password;
  phone?: Phone;
  qualifications: string[];
  experience: number;
  certificates?: string[];
  createdAt: Date;
}