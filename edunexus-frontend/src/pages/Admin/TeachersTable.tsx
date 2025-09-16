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
  const [total, setTotal] = useState(0); 
  const [loading, setLocalLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [actionType, setActionType] = useState<'block' | 'unblock' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<
    'all' | 'blocked' | 'unblocked' | 'pending' | 'approved' | 'rejected'
  >('all');

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setLocalLoading(true);
        const { teachers, total } = await getAllTeachers(
          currentPage,
          itemsPerPage,
          filterType,
          searchQuery
        );
        setTeachers(teachers);
        setTotal(total);
        setError(null);
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
  }, [dispatch, currentPage, filterType, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchQuery]);

  const totalPages = Math.ceil(total / itemsPerPage);
  const displayedTeachers = teachers.map((teacher, index) => ({
    ...teacher,
    serialNo: (currentPage - 1) * itemsPerPage + (index + 1),
  }));

  const teacherColumns: TableColumn<Teacher & { serialNo: number }>[] = [
    { key: 'serialNo', header: 'No.' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone', render: (value: string | null) => value || 'N/A' },
    {
      key: 'isVerified',
      header: 'Verified',
      render: (value: boolean): ReactNode => (
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
      key: 'isBlocked',
      header: 'Blocked',
      render: (value: boolean): ReactNode => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
  key: 'approvedByAdmin',
  header: 'Admin Approval',
  render: (value: "pending" | "approved" | "rejected" | null): React.ReactNode => {
    switch (value) {
      case 'approved':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            Pending
          </span>
        );
    }
  },
},
    {
      key: 'createdAt',
      header: 'Created At',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleAction = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setActionType(teacher.isBlocked ? 'unblock' : 'block');
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedTeacher || !actionType) return;
    try {
      setLocalLoading(true);
      const updatedTeacher = await toggleUserBlockStatus(selectedTeacher.id!);
      if (updatedTeacher) {
        const { teachers, total } = await getAllTeachers(
          currentPage,
          itemsPerPage,
          filterType,
          searchQuery
        );
        setTeachers(teachers);
        setTotal(total);
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
      setLocalLoading(false);
      dispatch(setLoading(false));
    }
  };

  const teacherActions = (teacher: Teacher): TableAction<Teacher>[] => [
    {
      label: 'View Profile',
      icon: <Eye className="w-4 h-4" />,
      className: 'bg-blue-500 text-white hover:bg-blue-600',
      onClick: () => navigate(`/admin/teacher-profile/${teacher.id}`),
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

  return (
    <>
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4
                   bg-white px-4 py-3 border-b-0 rounded-t-md"
      >
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-200 text-black font-semibold 
                       border border-gray-400 pl-10 pr-3 py-2 
                       rounded-md focus:ring-2 focus:ring-blue-500 
                       focus:outline-none"
          />
          <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
        </div>

        <div className="flex items-center">
          <label className="mr-2 text-black font-bold">Filter:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border border-gray-400 px-3 py-2 rounded-md 
                       font-bold text-black bg-white 
                       focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="blocked">Blocked</option>
            <option value="unblocked">Unblocked</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10 bg-white border border-t-0 rounded-b-md">
          <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></span>
          <span className="ml-3 text-gray-600 font-semibold">Loading teachers...</span>
        </div>
      ) : teachers.length === 0 ? (
        <div className="text-center bg-white text-gray-500 border-t-0 rounded-b-md py-6">
          No users found
        </div>
      ) : (
        <ReusableTable
          columns={teacherColumns}
          data={displayedTeachers}
          tableTitle="Teacher List"
          actions={teacherActions}
        />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg border bg-blue-600 shadow-sm disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg border shadow-sm ${
                currentPage === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg border bg-blue-600 shadow-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {modalOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg text-black font-semibold mb-4">
              {actionType === 'block' ? 'Block Teacher' : 'Unblock Teacher'}
            </h2>
            <p className="mb-6 text-amber-600">
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
}

export default TeachersTable;