import { motion } from 'framer-motion';
import teacherImg from '../../../assets/teacher.png';
import { Link } from 'react-router-dom';

export default function TeachEarnSection() {
  return (
    <motion.div
      className="bg-black text-white py-20 px-5 flex flex-col md:flex-row items-center justify-center gap-12"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Left Text Section */}
      <div className="max-w-xl text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">
          Teach. Earn. Inspire.
        </h2>
        <p className="text-gray-300 mb-6">
          <span className="font-bold text-white">Turn your skills into impact.</span> <br />
          At EDU NEXUS, we’re not just building a learning platform — we’re building a teaching community.
          Whether you’re a student with a passion for explaining concepts or a seasoned educator, you can start
          your teaching journey right here. Set your schedule, connect with eager learners, and get rewarded for doing what you love.
        </p>

        <Link
          to="/join"
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold transition"
        >
          Join now
        </Link>
      </div>

      {/* Right Image */}
      <motion.img
        src={teacherImg}
        alt="Teach Earn Inspire"
        className="w-64 md:w-80 h-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </motion.div>
  );
}
