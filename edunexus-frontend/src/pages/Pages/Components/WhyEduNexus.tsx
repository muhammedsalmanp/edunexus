import { motion } from 'framer-motion';
import tutor from '../../../assets/tutor.png';
import recorded from '../../../assets/recorded.png';
import doubt from '../../../assets/doubt.png';
import assignment from '../../../assets/assignment.png';
import boards from '../../../assets/boards.png';

export default function WhyEduNexus() {
  const fadeInVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 },
    }),
  };

  const features = [
    {
      title: 'Experienced Tutors',
      description:
        'Our handpicked faculty brings years of classroom and online teaching experience, ensuring high-quality education that adapts to every learner’s pace.',
      image: tutor,
    },
    {
      title: 'Live & Recorded Class',
      description:
        'Join interactive live sessions or revisit any topic with access to recorded classes. Learn anytime, anywhere.',
      image: recorded,
    },
    {
      title: 'Doubt-Clearing Sessions',
      description:
        'Dedicated sessions to resolve student queries quickly, ensuring clarity and confidence before moving ahead.',
      image: doubt,
    },
    {
      title: 'Tests & Assignments',
      description:
        'Regular assessments, quizzes, and assignments designed to strengthen understanding and improve exam readiness.',
      image: assignment,
    },
    {
      title: 'Covers All Boards (CBSE, ICSE, State)',
      description:
        'We provide comprehensive learning modules that align with multiple educational boards for classes 1 to 12.',
      image: boards,
    },
  ];

  return (
    <div className="bg-black text-white py-20 px-5">
      <h2 className="text-4xl md:text-5xl font-bold text-center text-yellow-400 mb-14">
        Why EDU NEXUS
      </h2>

      <div className="flex flex-col gap-16">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={`flex flex-col md:flex-row ${
              index % 2 !== 0 ? 'md:flex-row-reverse' : ''
            } items-center justify-center gap-8`}
            variants={fadeInVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={index}
          >
            {/* Image */}
            <img
              src={feature.image}
              alt={feature.title}
              className="w-40 md:w-56 h-auto object-contain"
            />

            {/* Text */}
            <div className="max-w-xl text-center md:text-left">
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
