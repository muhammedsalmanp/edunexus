import Sidebar from '../Components/layout/Sidebar';
import { Outlet } from 'react-router-dom';

const TeacherLayout = () => {
  return (
    <div className="flex h-screen bg-[#eaf2de]">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;
