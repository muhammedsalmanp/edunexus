import { Email } from "../valueObjects/Email";
import { Phone } from "../valueObjects/Phone";
import { Password } from "../valueObjects/Password";

export class BaseUserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: Email,
    public readonly password: Password | null,   
    public readonly phone: Phone|null,
    public readonly role: "student" | "teacher" | "admin",

    public readonly isVerified?: boolean,
    public readonly approvedByAdmin?: "pending" | "approved" | "rejected",
    public readonly rejectionMessage?: string | null,
    public readonly isBlocked?: boolean,
    public readonly isApplied?: boolean,
    public readonly isActive?: boolean,          
    public readonly googleId?: string,         
    public readonly createdAt: Date = new Date()
  ) {}
}

export class StudentEntity extends BaseUserEntity {
  constructor(
    id: string,
    name: string,
    email: Email,
    password: Password | null,
    phone: Phone | null,
    isVerified?: boolean,
    isBlocked?: boolean,
    approvedByAdmin?: "pending" | "approved" | "rejected",
    isApplied?: boolean,
    isActive: boolean = true,  
    googleId?: string,
    createdAt: Date = new Date()
  ) {
    super(
      id,
      name,
      email,
      password,
      phone,
      "student",
      isVerified,
      approvedByAdmin,
      null,
      isBlocked,
      isApplied,
      isActive,
      googleId,
      createdAt
    );
  }
}

export class TeacherEntity extends BaseUserEntity {
  constructor(
    id: string,
    name: string,
    email: Email,
    password: Password | null,
    phone: Phone| null,
    public readonly qualifications: string[],
    public readonly experience: number,
    public readonly certificates?: { name: string; year?: number; image?: string }[],
    public readonly bio?: string,
    public readonly profilePic?: string,
    public readonly educationHistory?: { degree: string; institution: string; year?: number }[],
    public readonly specializations?: string[],
    public readonly awards?: { title: string; year?: number; issuer?: string }[],
    rejectionMessage?: string | null,
    isVerified?: boolean,
    approvedByAdmin?: "pending" | "approved" | "rejected",
    isBlocked?: boolean,
    isApplied?: boolean,
    isActive: boolean = true,
    googleId?: string,
    createdAt: Date = new Date()
  ) {
    super(
      id,
      name,
      email,
      password,
      phone,
      "teacher",
      isVerified,
      approvedByAdmin,
      rejectionMessage,
      isBlocked,
      isApplied,
      isActive,
      googleId,
      createdAt
    );
  }
}

export class AdminEntity extends BaseUserEntity {
  constructor(
    id: string,
    name: string,
    email: Email,
    password: Password | null,
    phone: Phone|null,
    isVerified?: boolean,
    isBlocked?: boolean,
    approvedByAdmin?: "pending" | "approved" | "rejected",
    isApplied?: boolean,
    isActive: boolean = true,
    googleId?: string,
    createdAt: Date = new Date()
  ) {
    super(
      id,
      name,
      email,
      password,
      phone,
      "admin",
      isVerified,
      approvedByAdmin,
      null,
      isBlocked,
      isApplied,
      isActive,
      googleId,
      createdAt
    );
  }
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  isActive?: boolean;
  googleId?: string;   // ✅ added
  createdAt: Date;
  approvedByAdmin?: "pending" | "approved" | "rejected";
}
