export interface RegisterUserDTO {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'student' | 'teacher' | 'admin';
}