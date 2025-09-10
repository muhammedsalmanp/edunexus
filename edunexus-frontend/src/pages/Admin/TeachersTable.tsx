import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import ReusableTable from '../../Components/Table';
import type { TableColumn, TableAction } from '../../Components/Table';
import type { Teacher } from '../../Components/Table';
import { getAllTeachers } from '../../API/auth.api';
import { toggleUserBlockStatus } from '../../API/adminApi';
import { showNotification } from '../../store/slices/notificationSlice';
import { setLoading } from '../../store/slices/loadingSlice';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeachersTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLocalLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [actionType, setActionType] = useState<'block' | 'unblock' | null>(null);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        dispatch(setLoading(true));
        const data = await getAllTeachers();
        if (!Array.isArray(data)) throw new Error('Invalid teacher data format');
        setTeachers(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load teachers';
        setError(errorMessage);
        dispatch(showNotification({ message: errorMessage, type: 'error' }));
      } finally {
        setLocalLoading(false);
        dispatch(setLoading(false));
      }
    };
    loadTeachers();
  }, [dispatch]);

  const teacherColumns: TableColumn<Teacher>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'isVerified',
      header: 'Verified',
      render: (value: Teacher[keyof Teacher]): ReactNode => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'approvedByAdmin',
      header: 'Admin Approval',
      render: (value: Teacher[keyof Teacher]): ReactNode => {
        switch (value) {
          case 'approved':
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Approved</span>;
          case 'rejected':
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Rejected</span>;
          case 'pending':
          default:
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Pending</span>;
        }
      },
    },
  ];

  // Open modal for block/unblock
  const handleAction = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setActionType(teacher.isBlocked ? 'unblock' : 'block');
    setModalOpen(true);
  };

  // Confirm block/unblock and update DB
  const handleConfirm = async () => {
    if (!selectedTeacher || !actionType) return;
    try {
      dispatch(setLoading(true));
      const updatedTeacher = await toggleUserBlockStatus(selectedTeacher.id!);
      if(updatedTeacher){
        const data = await getAllTeachers();
        if (!Array.isArray(data)) throw new Error('Invalid teacher data format');
        setTeachers(data);
      }

      dispatch(
        showNotification({
          message: `${selectedTeacher.name} has been ${actionType === 'block' ? 'blocked' : 'unblocked'}`,
          type: 'success',
        })
      );

      setModalOpen(false);
      setSelectedTeacher(null);
      setActionType(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update teacher';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Action buttons for table
  const teacherActions = (teacher: Teacher): TableAction<Teacher>[] => [
   {
  label: 'View Profile',
  icon: <Eye className="w-4 h-4" />,
  className: 'bg-blue-500 text-white hover:bg-blue-600',
  onClick: () => navigate(`/admin/teacher-profile/${teacher.id}`), // navigate with ID
},
    {
      label: teacher.isBlocked ? 'Unblock' : 'Block',
      icon: teacher.isBlocked ? <span>🔓</span> : <span>🚫</span>,
      className: teacher.isBlocked
        ? 'bg-green-500 text-white hover:bg-green-600'
        : 'bg-red-500 text-white hover:bg-red-600',
      onClick: () => handleAction(teacher),
    },
  ];

  if (loading) return <div>Loading teachers...</div>;
  if (error)
    return (
      <div>
        Error: {error}
        <button
          onClick={() => {
            setLocalLoading(true);
            setError(null);
          }}
          className="ml-4 p-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );

  return (
    <>
      <ReusableTable
        columns={teacherColumns}
        data={teachers}
        tableTitle="Teachers"
        actions={teacherActions}
      />

      {/* Confirmation Modal */}
      {modalOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {actionType === 'block' ? 'Block Teacher' : 'Unblock Teacher'}
            </h2>
            <p className="mb-6">
              Do you want to {actionType} <strong>{selectedTeacher.name}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setSelectedTeacher(null);
                  setActionType(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded text-white ${
                  actionType === 'block' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {actionType === 'block' ? 'Block' : 'Unblock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeachersTable;
