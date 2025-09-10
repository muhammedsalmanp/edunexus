export interface RegisterTeacherDTO {
    name: string;
    email: string;
    password: string;
    phone: string;
    qualifications: string[];
    experience: number;
    certificates: string[];
}