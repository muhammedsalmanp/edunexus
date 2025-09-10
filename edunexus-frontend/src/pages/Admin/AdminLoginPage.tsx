import LoginForm from '../../Components/auth/LoginPage';
import { LoginServiceImpl } from '../../services/auth/LoginService';

const AdminLoginPage = () => {
  const loginService = new LoginServiceImpl();
  return <LoginForm userType="admin" loginService={loginService} />;
};

export default AdminLoginPage;