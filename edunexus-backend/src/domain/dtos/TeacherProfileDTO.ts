export interface TeacherProfileDTO {
    _id?:string;
    name?: string;
    email?: string; 
    role?:string;
    phone?: string;
    qualifications?: string[];
    experience?: number;
    certificates?: { name: string; year?: number; image?: string }[];
    bio?: string;
    profilePic?: string;
    educationHistory?: { degree: string; institution: string; year?: number }[];
    specializations?: string[];
    approvedByAdmin?: 'pending' | 'approved' | 'rejected';
    awards?: { title: string; year?: number; issuer?: string }[];
    isBlocked?: boolean;  
    isVerified?: boolean;
    hasApplied?: boolean;
    createdAt?:Date;
}