
import type { UserTypeConfig } from '../types/authLoging';

export const userTypeConfigs: UserTypeConfig[] = [
  {
    type: 'student',
    fields: [
      { name: 'email', label: 'Email Address', placeholder: 'e.g., student@example.com', type: 'email', required: true },
      { name: 'password', label: 'Password', placeholder: '********', type: 'password', required: true },
    ],
  },
  {
    type: 'teacher',
    fields: [
      { name: 'email', label: 'Email Address', placeholder: 'e.g., teacher@example.com', type: 'email', required: true },
      { name: 'password', label: 'Password', placeholder: '********', type: 'password', required: true },
    ],
  },
  {
    type: 'admin',
    fields: [
      { name: 'email', label: 'Email Address', placeholder: 'e.g., admin@example.com', type: 'email', required: true },
      { name: 'password', label: 'Password', placeholder: '********', type: 'password', required: true },
    ],
  },
];