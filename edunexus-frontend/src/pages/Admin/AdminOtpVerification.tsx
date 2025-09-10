
// import { useLocation } from 'react-router-dom';
// import OtpVerification from '../../Components/auth/OtpVerification';

// const AdminOtpVerification = () => {
//   const location = useLocation();
//   const { context = 'registration' } = location.state || {}; 
//   return <OtpVerification context={context} userType="admin" />;
// };

// export default AdminOtpVerification;

import { useLocation } from 'react-router-dom';
import OtpVerification from '../../Components/auth/OtpVerification';

const AdminOtpVerification = () => {
  const location = useLocation();
  const { context } = location.state || {}; // No default value to force state check
  if (!context) {
    console.warn('No context provided in state, defaulting to registration');
  }
  return <OtpVerification context={context as 'registration' | 'forgot-password'} userType="admin" />;
};

export default AdminOtpVerification;