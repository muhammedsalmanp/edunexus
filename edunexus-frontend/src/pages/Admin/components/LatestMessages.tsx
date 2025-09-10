const messages = [
  { sender: 'Student A', text: 'Issue with course access', time: '10 min ago' },
  { sender: 'Student B', text: 'Payment not going through', time: '30 min ago' },
];

const LatestMessages = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Latest Messages</h3>
      <ul className="space-y-4">
        {messages.map((msg, idx) => (
          <li key={idx} className="border-b border-gray-200 pb-3 hover:bg-gray-50 transition-colors rounded-lg p-2">
            <p className="font-medium text-gray-800">{msg.sender}</p>
            <p className="text-sm text-gray-600">{msg.text}</p>
            <p className="text-xs text-gray-400">{msg.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LatestMessages;
