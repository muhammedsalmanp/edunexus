import OtpVerification from '../../Components/auth/OtpVerification';
import { useLocation } from 'react-router-dom';

const StudentOtpVerification = () => {
  const location = useLocation();
  const { context = 'registration' } = location.state || {}; 
  return <OtpVerification context={context} userType="student" />;
};

export default StudentOtpVerification;
