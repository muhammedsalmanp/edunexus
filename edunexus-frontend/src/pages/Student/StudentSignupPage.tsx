import RegistrationForm from '../../Components/auth/RegisterComponent';
import { RegistrationServiceImpl } from '../../services/auth/RegistrationService';

const StudentSignupPage = () => {
  const registrationService = new RegistrationServiceImpl();
  return <RegistrationForm userType="student" registrationService={registrationService} />;
};

export default StudentSignupPage;