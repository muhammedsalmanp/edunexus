import StatsCards from './components/StatsCards';
import EnrollmentsChart from './components/EnrollmentsChart';
import RecentUsersTable from './components/RecentUsersTable';
import LatestMessages from './components/LatestMessages';

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnrollmentsChart />
        <LatestMessages />
      </div>
      <RecentUsersTable />
    </div>
  );
};

export default AdminDashboard;
