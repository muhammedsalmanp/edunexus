import type { UserTypeConfig } from '../types/auth';

export const userTypeConfigs: UserTypeConfig[] = [
  {
    type: 'student',
    fields: [
      { name: 'name', label: 'Name', placeholder: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', placeholder: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', placeholder: '+91XXXXXXXXXX', type: 'tel', required: true },
      { name: 'password', label: 'Password', placeholder: '********', type: 'password', required: true },
    ],
  },
  {
    type: 'teacher',
    fields: [
      { name: 'name', label: 'Name', placeholder: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', placeholder: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', placeholder: '+91XXXXXXXXXX', type: 'tel', required: true },
      { name: 'qualifications', label: 'Qualifications', placeholder: 'e.g., M.Ed', type: 'text', required: true },
      { name: 'experience', label: 'Experience', placeholder: 'e.g., 5 years', type: 'text', required: true },
      { name: 'password', label: 'Password', placeholder: '********', type: 'password', required: true },
    ],
  },
  {
    type: 'admin',
    fields: [
      { name: 'name', label: 'Name', placeholder: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', placeholder: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', placeholder: '+91XXXXXXXXXX', type: 'tel', required: true },
      { name: 'password', label: 'Password', placeholder: '********', type: 'password', required: true },
    ],
  },
];