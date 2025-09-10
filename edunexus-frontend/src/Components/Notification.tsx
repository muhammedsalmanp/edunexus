// import { useSelector, useDispatch } from 'react-redux';
// import type { RootState } from '../store';
// import { hideNotification } from '../store/slices/notificationSlice';
// import { useEffect } from 'react';

// export default function Notification() {
//   const { message, type, show } = useSelector((state: RootState) => state.notification);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (show) {
//       const timer = setTimeout(() => {
//         dispatch(hideNotification());
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [show]);

//   if (!show) return null;

//   return (
//     <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white z-50 ${
//       type === 'success' ? 'bg-green-500' :
//       type === 'error' ? 'bg-red-500' :
//       type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
//     }`}>
//       {message}
//     </div>
//   );
// }

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { hideNotification } from '../store/slices/notificationSlice';
import { useEffect } from 'react';
import { X } from 'lucide-react';



export default function Notification() {
  const { message, type, show } = useSelector((state: RootState) => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [show, dispatch]);

  if (!show) return null;

  const notificationStyles = {
    success: 'bg-emerald-500 border-emerald-400',
    error: 'bg-red-500 border-red-400',
    warning: 'bg-amber-500 border-amber-400',
    info: 'bg-blue-500 border-blue-400',
  };

  const handleClose = () => {
    dispatch(hideNotification());
  };

  return (
    <div
      className={`fixed right-4 top-4 z-50 transform transition-all duration-500 ease-out
        ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      style={{ top: `16px` }}
    >
      <div
        className={`${
          notificationStyles[type]
        } text-white px-4 py-3 rounded-lg shadow-lg border-2 flex items-center gap-3 min-w-[280px] max-w-[320px]`}
      >
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={handleClose}
          className="h-6 w-6 p-0 hover:bg-white/20 text-white ml-auto"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
