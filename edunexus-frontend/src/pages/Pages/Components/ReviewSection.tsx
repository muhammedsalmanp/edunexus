import { motion } from 'framer-motion';
import userImg from '../../../assets/vejay.jpg';

export default function ReviewSection() {
  return (
    <motion.div
      className="bg-black text-white py-20 px-5 flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-8">
        Reviews
      </h2>

      <p className="text-center text-xl max-w-xl mb-8 text-gray-200">
        "My son improved from C to A in math – thank you EDU NEXUS!"
      </p>

      <div className="flex items-center gap-4">
        <img
          src={userImg}
          alt="user"
          className="w-10 h-10 rounded-full border border-yellow-500"
        />
        <div>
          <p className="text-lg font-semibold text-blue-400">Vijay</p>
          <p className="text-sm text-gray-400">@vijay</p>
        </div>
      </div>
    </motion.div>
  );
}
