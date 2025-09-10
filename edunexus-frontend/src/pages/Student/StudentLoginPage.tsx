
import LoginForm from '../../Components/auth/LoginPage';
import { LoginServiceImpl } from '../../services/auth/LoginService';
const StudentLoginPage = () => {
  const loginService = new LoginServiceImpl();
     
  return (
    <>
    <LoginForm userType="student" loginService={loginService} />
    </>
  )
};

export default StudentLoginPage;