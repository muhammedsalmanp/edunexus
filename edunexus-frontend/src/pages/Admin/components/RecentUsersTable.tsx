const users = [
  { name: 'Jane Doe', email: 'jane@example.com', joined: '2024-07-01' },
  { name: 'John Smith', email: 'john@example.com', joined: '2024-07-05' },
];

const RecentUsersTable = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg overflow-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Users</h3>
      <table className="min-w-full text-sm text-gray-700">
        <thead>
          <tr className="text-left border-b border-gray-200 bg-gray-50">
            <th className="py-3 px-4 font-semibold">Name</th>
            <th className="py-3 px-4 font-semibold">Email</th>
            <th className="py-3 px-4 font-semibold">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={i} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
              <td className="py-3 px-4">{user.name}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">{user.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default RecentUsersTable;
