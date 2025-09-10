export interface FormData {
    name?: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword?: string;
    role?: string;
    certificates?: string;
    qualifications?: string;
    experience?: string;
}

export interface FieldConfig {
  name: keyof FormData;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
}

export interface UserTypeConfig {
  type: string;
  fields: FieldConfig[];
}