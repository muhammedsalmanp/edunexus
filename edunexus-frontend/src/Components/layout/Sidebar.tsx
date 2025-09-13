import { useState } from 'react';
import {
  FaBars,
  FaUser,
  FaBook,
  FaUsers,
  FaClipboardList,
  FaPen,
  FaMoneyBillAlt,
  FaEnvelope,
  FaThLarge,
  FaSignOutAlt,
} from 'react-icons/fa';
import logo from '../../../public/logo.png'
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice'; 

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menu = [
    { name: 'Dashboard', icon: <FaThLarge />, path: '/teacher/dashboard' },
    { name: 'Profile', icon: <FaUser />, path: '/teacher/profile' },
    { name: 'Courses', icon: <FaBook />, path: '/teacher/courses' },
    { name: 'Students', icon: <FaUsers />, path: '/teacher/students' },
    { name: 'Assignment', icon: <FaClipboardList />, path: '/teacher/assignments' },
    { name: 'Exam', icon: <FaPen />, path: '/teacher/exams' },
    { name: 'Earnings', icon: <FaMoneyBillAlt />, path: '/teacher/earnings' },
    { name: 'Message', icon: <FaEnvelope />, path: '/teacher/messages' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Hamburger for Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="text-white bg-yellow-500 p-2 rounded-md shadow-md"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-40 top-0 left-0 h-full w-60 bg-white shadow-md border-r transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:flex md:flex-col`}
      >
        {/* Logo and Title */}
        <div className="flex items-center gap-2 px-6 py-5 border-b">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <h1 className="font-bold text-xl text-[#7A7900]">EDUNEXUS</h1>
        </div>

        {/* Menu */}
        <ul className="mt-4 space-y-4 px-2 flex-grow">
          {menu.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#eaf2de] text-black font-semibold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-base">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="px-4 py-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="text-base">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
