import { FaUserGraduate, FaBook, FaMoneyBillWave } from 'react-icons/fa';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import image from '../../assets/avatar-placeholder.png'

const data = [
  { month: 'January', Course: 10, Revenue: 5, Students: 8 },
  { month: 'February', Course: 20, Revenue: 25, Students: 15 },
  { month: 'March', Course: 25, Revenue: 30, Students: 30 },
  { month: 'April', Course: 30, Revenue: 40, Students: 35 },
  { month: 'May', Course: 35, Revenue: 65, Students: 45 },
];

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="p-4 md:p-6 bg-[#eaf2de] min-h-screen">
      {/* Title */}
      <h2 className="text-xl text-black  md:text-2xl font-bold mb-4">Dashboard</h2>

      {/* Welcome Banner */}
      <div className="relative bg-indigo-600 text-white rounded-2xl p-11 mt-20 overflow-visible">
        <div className="max-w-md z-10 relative">
          <h3 className="text-2xl font-bold">
            Welcome Back, {user?.name || 'Teacher'}!
          </h3>
          <p className="text-sm mt-2">
            We've missed your presence. Explore updates designed to boost your teaching journey!
          </p>
        </div>

        {/* Image that overflows to the right */}
        <img
          src={image} // replace with your actual image path
          alt="Banner"
          className="absolute  right-25 bottom-0 w-66  translate-x-1/4"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard icon={<FaUserGraduate />} label="Students" value="32" />
        <StatCard icon={<FaBook />} label="Course" value="100" />
        <StatCard icon={<FaBook />} label="Course" value="100" />
        <StatCard icon={<FaMoneyBillWave />} label="Earnings" value="$12,000" />
      </div>

      {/* Chart */}
      <div className="mt-8 bg-white p-4 rounded shadow">
        <h4 className="text-lg font-semibold mb-4">Growth Overview</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Course" stroke="#82ca9d" strokeWidth={2} />
            <Line type="monotone" dataKey="Revenue" stroke="#ff7300" strokeWidth={2} />
            <Line type="monotone" dataKey="Students" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-4 bg-white p-4 rounded shadow hover:scale-105 transition">
    <div className="text-3xl text-indigo-600">{icon}</div>
    <div>
      <h5 className="text-sm text-gray-500">{label}</h5>
      <p className="text-xl font-semibold text-black">{value}</p>
    </div>
  </div>
);

export default Dashboard;
