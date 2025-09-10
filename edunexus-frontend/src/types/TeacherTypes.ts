export interface ProfessionalUser {
  _id:string;
  name: string;
  email: string;
  phone?: string;
  qualifications?: string[];
  experience?: number;
  certificates?: Array<{
    name: string;
    year?: number; 
    image?: string;
  }>;
  bio?: string;
  profilePic?: string;
  educationHistory?: Array<{
    degree: string;
    institution: string;
    year?: number; // Changed to number
  }>;
  specializations?: string[];
  approvedByAdmin?: 'approved' | 'pending' | 'rejected';
  awards?: Array<{
    title: string;
    issuer?: string;
    year?: number; // Changed to number
  }>;
  isBlocked?: boolean;
  isVerified?: boolean;
  createdAt?: string; // Keep as string for frontend, convert to Date when needed
}

export interface TeacherProfile extends ProfessionalUser {
  role?: string;
  hasApplied?:boolean;
  rejectionMessage?: string;
  
}

export interface ProfileConfig {
  showSpecializations?: boolean;
  showEducation?: boolean;
  showAwards?: boolean;
  showQualifications?: boolean;
  showCertificates?: boolean;
  showApprovalStatus?: boolean;
  showVerificationBadge?: boolean;
  showExperience?: boolean;
  showEditButton?: boolean;
  showupdateButton:boolean;
  editButtonText?: string;
  theme?: {
    primaryColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
  };
  customSections?: React.ReactNode[];
}