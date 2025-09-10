import { FaUser, FaChalkboardTeacher, FaBook, FaDollarSign } from 'react-icons/fa';

const StatsCards = () => {
  const stats = [
    { icon: <FaUser />, label: 'Users', value: 1200, color: 'bg-blue-50 text-blue-700' },
    { icon: <FaChalkboardTeacher />, label: 'Teachers', value: 200, color: 'bg-green-50 text-green-700' },
    { icon: <FaBook />, label: 'Courses', value: 80, color: 'bg-yellow-50 text-yellow-700' },
    { icon: <FaDollarSign />, label: 'Revenue', value: '$45,000', color: 'bg-pink-50 text-pink-700' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`p-6 rounded-xl shadow-lg ${stat.color} flex items-center gap-4 transform hover:scale-105 transition-transform duration-200`}
        >
          <div className="text-3xl">{stat.icon}</div>
          <div>
            <p className="text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};


export default StatsCards;
