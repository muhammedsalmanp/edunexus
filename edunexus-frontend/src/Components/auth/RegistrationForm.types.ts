
import type { RegistrationService } from '../../services/auth/RegistrationService';

export interface RegistrationFormProps {
  userType: string; 
  registrationService: RegistrationService;
}