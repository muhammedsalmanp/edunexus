import OtpVerification from '../../Components/auth/OtpVerification';
import { useLocation } from 'react-router-dom';

const TeacherOtpVerification = () => {
  const location = useLocation();
  const { context = 'registration' } = location.state || {};
  return <OtpVerification context={context} userType="teacher" />;
};

export default TeacherOtpVerification;