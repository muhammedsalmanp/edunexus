// src/types/auth.ts
export interface LoginForm {
  email: string;
  password: string;
  role?: 'student' | 'admin' | 'teacher';
  [key: string]: string | undefined; // Allow dynamic fields
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email?: string;
    role: 'student' | 'admin' | 'teacher';
  };
}

export interface LoginFieldConfig {
  name: string; // Changed from keyof LoginForm to string for flexibility
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
}

export interface UserTypeConfig {
  type: 'student' | 'admin' | 'teacher';
  fields: LoginFieldConfig[];
}

export interface LoginService {
  login(form: LoginForm, userType: string, dispatch: any, navigate: any): Promise<void>;
}