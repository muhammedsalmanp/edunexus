import { useEffect, useState } from 'react';

export default function StatsSection() {
  const Counter = ({ target, duration = 2000 }: { target: number; duration?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const increment = target / (duration / 50);

      const counter = setInterval(() => {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(counter);
        }
        setCount(Math.floor(start));
      }, 50);

      return () => clearInterval(counter);
    }, [target, duration]);

    return <span>{count}</span>;
  };

  return (
    <div className="bg-black text-white py-20 px-5 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6">
        Your Smart Learning Partner
      </h2>
      <p className="text-gray-300 max-w-2xl mx-auto mb-12">
        At EDU NEXUS, we blend technology with expert teaching to support students from
        Classes 1 to 12. Our platform offers <strong>live & recorded classes</strong>,
        experienced tutors, and <strong>custom study plans</strong> across CBSE, ICSE, and State Boards.
        With <strong>interactive tools, progress tracking,</strong> and <strong>doubt-clearing sessions</strong>,
        we make learning easy, engaging, and effective — all from home.
      </p>

      {/* ✅ Stats Boxes */}
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        <div className="border border-gray-600 rounded-lg px-10 py-6">
          <h3 className="text-5xl font-bold text-yellow-400">
            <Counter target={100} />k+
          </h3>
          <p className="text-lg mt-2">Active Users</p>
        </div>
        <div className="border border-gray-600 rounded-lg px-10 py-6">
          <h3 className="text-5xl font-bold text-yellow-400">
            <Counter target={500} />+
          </h3>
          <p className="text-lg mt-2">Tutors</p>
        </div>
        <div className="border border-gray-600 rounded-lg px-10 py-6">
          <h3 className="text-5xl font-bold text-yellow-400">
            <Counter target={100} />+
          </h3>
          <p className="text-lg mt-2">Premium Courses</p>
        </div>
      </div>
    </div>
  );
}
