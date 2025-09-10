import { FaSearch } from 'react-icons/fa';

const courses = [
  {
    id: 1,
    title: 'SSLC Geography | Chapter -1 | Season and Time',
    price: '$500',
    image: '../assets/geography.jpeg',
    category: 'SSLC Geography | Chapter',
  },
  {
    id: 2,
    title: 'SSLC Physics | Chapter -2 | Motion',
    price: '$600',
    image: '../assets/geography.jpeg',
    category: 'SSLC Physics | Chapter',
  },
  {
    id: 3,
    title: 'SSLC Chemistry | Chapter -3 | Matter',
    price: '$550',
    image: '../assets/geography.jpeg',
    category: 'SSLC Chemistry | Chapter',
  },
];

export default function Coureses() {
  return (
    <div className="bg-black text-white px-6 md:px-20 py-20">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-yellow-400 mb-4">
        Explore Our Courses
      </h2>
      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-10">
        Choose from a range of live and recorded courses tailored for Classes 1 to 12.
        Learn at your pace, anytime, anywhere.
      </p>

      {/* Filter/Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-10">
        <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200">
          All Courses
        </button>
        <div className="flex items-center bg-white rounded-full px-4 py-2 w-full md:w-96">
          <input
            type="text"
            placeholder="Search here..."
            className="flex-grow outline-none text-black bg-transparent placeholder-gray-500"
          />
          <FaSearch className="text-black" />
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white text-black rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <img src={course.image} alt={course.title} className="w-full h-52 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{course.category}</h3>
              <p className="text-sm text-gray-600 mb-2">{course.title}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">{course.price}</span>
                <button className="bg-yellow-400 text-black px-4 py-1 rounded-full hover:bg-yellow-500">
                  Enroll
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
