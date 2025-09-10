export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
}

export interface Teacher extends User {
  approvedByAdmin: boolean;
}

