import { Link } from 'react-router-dom';
import heroImage from '../../../assets/hero.png'; 

export default function Hero() {
  return (
    <div className="bg-black text-white relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Learning Illustration"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      {/* Content */}
      <div className="z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-4">
          Unlock Your Child’s Potential with <br className="hidden md:block"/> Expert Tuition
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          From Grade 1 to 12 – Personalized Online Classes.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            to="/SingUp"
            className="bg-yellow-400 text-black px-6 py-3 rounded-full text-lg font-semibold hover:bg-yellow-500 transition"
          >
            Get Started
          </Link>
          <Link
            to="/courses"
            className="bg-white text-black px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
