import RegistrationForm from '../../Components/auth/RegisterComponent';
import { RegistrationServiceImpl } from '../../services/auth/RegistrationService';

const TeacherSignupPage = () => {
  const registrationService = new RegistrationServiceImpl();
  return <RegistrationForm userType="teacher" registrationService={registrationService} />;
};

export default TeacherSignupPage;