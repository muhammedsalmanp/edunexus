import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SignUpCTA() {
  return (
    <motion.div
      className="bg-black text-center py-16 px-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">
        Sign up today.
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto mb-8">
        Interactive classes, flexible schedules, expert support — all at your fingertips.
      </p>

      <div className="flex gap-5 justify-center">
        <Link
          to="/learn-more"
          className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition"
        >
          Learn More
        </Link>
        <Link
          to="/signup"
          className="bg-gray-900 text-white px-6 py-2 rounded-full border border-white hover:bg-gray-700 transition"
        >
          Get Started
        </Link>
      </div>
    </motion.div>
  );
}
