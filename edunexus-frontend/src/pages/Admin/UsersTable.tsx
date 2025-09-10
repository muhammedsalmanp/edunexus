// import { useState, useEffect } from 'react';
// import type { ReactNode } from 'react';
// import { useDispatch } from 'react-redux';
// import ReusableTable from '../../Components/Table';
// import type { TableColumn , TableAction } from '../../Components/Table';
// import type { Student } from '../../Components/Table'; // Update path if in ../Components/Table
// import { getAllStudents } from '../../API/auth.api';
// import { showNotification } from '../../store/slices/notificationSlice';
// import { setLoading } from '../../store/slices/loadingSlice';

// const StudentsTable = () => {
//   const dispatch = useDispatch();
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLocalLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadStudents = async () => {
//       try {
//         dispatch(setLoading(true));
//         const data = await getAllStudents();
//         if (!Array.isArray(data)) {
//           throw new Error('Received invalid data format for students');
//         }
//         setStudents(data);
//         dispatch(showNotification({ message: 'Students loaded successfully', type: 'success' }));
//       } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : 'Failed to load students';
//         setError(errorMessage);
//         dispatch(showNotification({ message: errorMessage, type: 'error' }));
//       } finally {
//         setLocalLoading(false);
//         dispatch(setLoading(false));
//       }
//     };

//     loadStudents();
//   }, [dispatch]);

//   const studentColumns: TableColumn<Student>[] = [
//     { key: 'name', header: 'Name' },
//     { key: 'email', header: 'Email' },
//     { key: 'phone', header: 'Phone' },
//     {
//       key: 'isVerified',
//       header: 'Verified',
//       render: (value: any, row: Student): ReactNode => {
//         if (typeof value !== 'boolean') {
//           return <span>Invalid</span>;
//         }
//         return (
//           <span
//             className={`px-2 py-1 rounded-full text-xs font-medium ${
//               value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//             }`}
//           >
//             {value ? 'Yes' : 'No'}
//           </span>
//         );
//       },
//     },
//   ];
//    const handilAction = (Student:Student)=>{
//     console.log(`this if from ${Student.email}`);
//     }
//  const studentActions = (student: Student): TableAction<Student>[] => {
//   if (student.isBlocked) {
//     return [
//       {
//         label: "Unblock",
//         icon: <span>🔓</span>,
//         className: "bg-green-500 text-white hover:bg-green-600",
//         onClick: handilAction,
//       },
//     ];
//   }
//   return [
//     {
//       label: "Block",
//       icon: <span>🚫</span>,
//       className: "bg-red-500 text-white hover:bg-red-600",
//       onClick: handilAction,
//     },
//   ];
// };


//   if (loading) {
//     return <div>Loading students...</div>;
//   }

//   if (error) {
//     return (
//       <div>
//         Error: {error}
//         <button
//           onClick={() => {
//             setLocalLoading(true);
//             setError(null);
//           }}
//           className="ml-4 p-2 bg-blue-500 text-white rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return <ReusableTable columns={studentColumns} data={students} tableTitle="Students" actions={studentActions} />;
// };

// export default StudentsTable;

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import ReusableTable from '../../Components/Table';
import type { TableColumn, TableAction } from '../../Components/Table';
import type { Student } from '../../Components/Table';
import { getAllStudents } from '../../API/auth.api';
import { toggleUserBlockStatus } from '../../API/adminApi';
import { showNotification } from '../../store/slices/notificationSlice';
import { setLoading } from '../../store/slices/loadingSlice';

const StudentsTable = () => {
  const dispatch = useDispatch();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLocalLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [actionType, setActionType] = useState<'block' | 'unblock' | null>(null);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        dispatch(setLoading(true));
        const data = await getAllStudents();
        if (!Array.isArray(data)) throw new Error('Invalid student data format');
        setStudents(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load students';
        setError(errorMessage);
        dispatch(showNotification({ message: errorMessage, type: 'error' }));
      } finally {
        setLocalLoading(false);
        dispatch(setLoading(false));
      }
    };
    loadStudents();
  }, [dispatch]);

  const studentColumns: TableColumn<Student>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'isVerified',
      header: 'Verified',
      render: (value: any, row: Student): ReactNode => (
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

  // Open modal for block/unblock
  const handleAction = (student: Student) => {
    setSelectedStudent(student);
    setActionType(student.isBlocked ? 'unblock' : 'block');
    setModalOpen(true);
  };

  // Confirm block/unblock and update DB
  const handleConfirm = async () => {
    if (!selectedStudent || !actionType) return;
    try {
      const updatedStudent = await toggleUserBlockStatus(selectedStudent.id!);
     if(updatedStudent){
       const data = await getAllStudents();
        if (!Array.isArray(data)) throw new Error('Invalid student data format');
        setStudents(data);
     }
      dispatch(
        showNotification({
          message: `${selectedStudent.name} has been ${actionType === 'block' ? 'blocked' : 'unblocked'}`,
          type: 'success',
        })
      );
      setModalOpen(false);
      dispatch(setLoading(true));
      setSelectedStudent(null);
      setActionType(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update student';
      dispatch(showNotification({ message: errorMessage, type: 'error' }));
    } finally {
      dispatch(setLoading(false));
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

  if (loading) return <div>Loading students...</div>;
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
        columns={studentColumns}
        data={students}
        tableTitle="Students"
        actions={studentActions}
      />

      {/* Confirmation Modal */}
      {modalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-amber-50">
              {actionType === 'block' ? 'Block Student' : 'Unblock Student'}
            </h2>
            <p className="mb-6 text-black">
              Do you want to {actionType} <strong>{selectedStudent.name}</strong>?
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
