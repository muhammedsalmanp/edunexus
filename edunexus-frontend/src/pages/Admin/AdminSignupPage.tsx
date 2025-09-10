import RegistrationForm from '../../Components/auth/RegisterComponent';
import { RegistrationServiceImpl } from '../../services/auth/RegistrationService';

const AdminSignupPage = () => {
  const registrationService = new RegistrationServiceImpl();
  return <RegistrationForm userType="admin" registrationService={registrationService} />;
};

export default AdminSignupPage;