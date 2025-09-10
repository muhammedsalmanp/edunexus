import { useState } from 'react';
import { FaBars, FaUser, FaChalkboardTeacher, FaBook, FaShoppingCart, FaTags, FaChartLine, FaCommentDots, FaTachometerAlt, FaSignOutAlt, } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// AdminSidebar Component
const AdminSidebar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menu = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/admin/dashboard' },
    { name: 'Users', icon: <FaUser />, path: '/admin/users' },
    { name: 'Teachers', icon: <FaChalkboardTeacher />, path: '/admin/teachers' },
    { name: 'Courses', icon: <FaBook />, path: '/admin/courses' },
    { name: 'Orders', icon: <FaShoppingCart />, path: '/admin/orders' },
    { name: 'Coupon', icon: <FaTags />, path: '/admin/coupons' },
    { name: 'Report', icon: <FaChartLine />, path: '/admin/reports' },
    { name: 'Message', icon: <FaCommentDots />, path: '/admin/messages' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="text-white bg-blue-600 p-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          <FaBars size={20} />
        </button>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        />
      )}

      <div
        className={`fixed z-40 top-0 left-0 w-64 bg-gray-900 text-white shadow-lg border-r border-gray-800 transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:flex md:flex-col min-h-screen`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <img src="/logo.png" alt="logo" className="w-10 h-10 rounded-full" />
          <h1 className="font-bold text-xl">
            <span className="text-yellow-400">EDU</span>NEXUS
          </h1>
        </div>

        <ul className="mt-6 space-y-2 px-3 flex-grow">
          {menu.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-base">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="px-4 py-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-900/50 rounded-lg transition"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="text-base">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
