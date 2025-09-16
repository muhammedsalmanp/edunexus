import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ReusableTable from '../../Components/Table';
import type { TableColumn, TableAction, Student } from '../../Components/Table';
import { getAllStudents } from '../../API/auth.api';
import { toggleUserBlockStatus } from '../../API/adminApi';
import { showNotification } from '../../store/slices/notificationSlice';

const StudentsTable = () => {
  const dispatch = useDispatch();

  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLocalLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [actionType, setActionType] = useState<'block' | 'unblock' | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<
    'all' | 'blocked' | 'unblocked' | 'verified' | 'unverified'
  >('all');

  // ✅ Load students
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLocalLoading(true);
        const { students, total } = await getAllStudents(
          currentPage,
          itemsPerPage,
          filterType,
          searchQuery
        );
        setStudents(students);
        setTotal(total);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load students';
        setError(errorMessage);
        dispatch(showNotification({ message: errorMessage, type: 'error' }));
      } finally {
        setLocalLoading(false);
      }
    };

    loadStudents();
  }, [dispatch, currentPage, filterType, searchQuery]);


  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchQuery]);

  const totalPages = Math.ceil(total / itemsPerPage);
  const displayedStudents = students.map((student, index) => ({
    ...student,
    serialNo: (currentPage - 1) * itemsPerPage + (index + 1),
  }));

  const studentColumns: TableColumn<Student & { serialNo: number }>[] = [
    { key: 'serialNo', header: 'No.' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'isVerified',
      header: 'Verified',
      render: (value: any) => (
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
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  const handleAction = (student: Student) => {
    setSelectedStudent(student);
    setActionType(student.isBlocked ? 'unblock' : 'block');
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedStudent || !actionType) return;
    try {
      const updatedStudent = await toggleUserBlockStatus(selectedStudent.id!);
      if (updatedStudent) {
        const { students } = await getAllStudents(
          currentPage,
          itemsPerPage,
          filterType,
          searchQuery
        );
        setStudents(students);
      }
      dispatch(
        showNotification({
          message: `${selectedStudent.name} has been ${
            actionType === 'block' ? 'blocked' : 'unblocked'
          }`,
          type: 'success',
        })
      );
      setModalOpen(false);
      setSelectedStudent(null);
      setActionType(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update student';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    }
  };

  const studentActions = (student: Student): TableAction<Student>[] => [
    {
      label: student.isBlocked ? 'Unblock' : 'Block',
      icon: student.isBlocked ? <span>🔓</span> : <span>🚫</span>,
      className: student.isBlocked
        ? 'bg-green-500 text-white hover:bg-green-600'
        : 'bg-red-500 text-white hover:bg-red-600',
      onClick: () => handleAction(student),
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
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10 bg-white border  border-t-0 rounded-b-md">
          <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></span>
          <span className="ml-3 text-gray-600 font-semibold">Loading students...</span>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center bg-white text-gray-500  border-t-0 rounded-b-md py-6">
          No users found
        </div>
      ) : (
        <ReusableTable
          columns={studentColumns}
          data={displayedStudents}
          tableTitle="Student List"
          actions={studentActions}
        />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg border bg-blue-600 shadow-sm  disabled:opacity-50"
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
            className="px-3 py-1.5 rounded-lg border bg-blue-600 shadow-sm  disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {modalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {actionType === 'block' ? 'Block Student' : 'Unblock Student'}
            </h2>
            <p className="mb-6">
              Do you want to {actionType}{' '}
              <strong>{selectedStudent.name}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setSelectedStudent(null);
                  setActionType(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded text-white ${
                  actionType === 'block'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
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

export default StudentsTable;
