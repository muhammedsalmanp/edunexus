import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { FaRegCommentDots, FaRegUserCircle } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const  Navbar =()=> {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [showMiniNav, setShowMiniNav] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowMiniNav(true);
      } else {
        setShowMiniNav(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-black text-white px-20 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-20 w-auto" />
        </div>

        <ul className="flex gap-8 text-xl font-semibold">
          <li><Link to="/" className="hover:text-yellow-600">Home</Link></li>
          <li><Link to="/courses" className="hover:text-yellow-600">Courses</Link></li>
          <li><Link to="/updates" className="hover:text-yellow-600">Updates</Link></li>
          {isAuthenticated && (
            <li><Link to="/enrolled" className="hover:text-yellow-600">Enrolled Courses</Link></li>
          )}
          <li><Link to="/contact" className="hover:text-yellow-600">Contact Us</Link></li>
        </ul>

        <div className="flex items-center gap-5">
          {isAuthenticated ? (
            <>
              <Link to="/messages" className="hover:text-gray-300">
                <FaRegCommentDots size={22} />
              </Link>
              <Link to="/profile" className="hover:text-gray-300">
                <FaRegUserCircle size={24} />
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white text-black px-4 py-1 rounded-full hover:bg-gray-200 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login/student"
              className="bg-white text-black px-6 py-1 text-lg font-semibold rounded-full hover:bg-gray-200 transition"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* ✅ Mini Navbar: Visible while scrolling */}
      {showMiniNav && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white text-black  px-10 py-3 rounded-full shadow-lg flex gap-13 z-50 transition-all">
          <Link to="/" className="hover:text-yellow-600 text-xl font-medium">
            Home
          </Link>
          <Link to="/courses" className="hover:text-yellow-600 text-xl font-medium">
            Courses
          </Link>
          <Link to="/updates" className="hover:text-yellow-600 text-xl font-medium">
            Updates
          </Link>
          {isAuthenticated && (
            <Link to="/enrolled" className="hover:text-yellow-600 text-xl font-medium">Enrolled Courses</Link>
          )}
          <Link to="/contact" className="hover:text-yellow-600 text-xl font-medium">
            Contact Us
          </Link>
        </div>
      )}
    </>
  );
}


export default Navbar;