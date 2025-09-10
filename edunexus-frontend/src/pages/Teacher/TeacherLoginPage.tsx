import LoginForm from '../../Components/auth/LoginPage';
import { LoginServiceImpl } from '../../services/auth/LoginService';

const TeacherLoginPage = () => {
  const loginService = new LoginServiceImpl();
  return (
    <>
    <LoginForm userType="teacher" loginService={loginService} />
    </>
  );
};

export default TeacherLoginPage;