import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const Loading = () => {
  const { isLoading } = useSelector((state: RootState) => state.loading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
    </div>
  );
};

export default Loading;