import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { applyTeacher, getTeacherProfile } from '../../API/teacherApi';
import { setLoading } from '../../store/slices/loadingSlice';
import type { TeacherProfile } from "../../types/TeacherTypes";
import type { Dispatch, SetStateAction } from 'react';

interface ProfileRejectionMessageProps {
  user: TeacherProfile;
  setUser: Dispatch<SetStateAction<TeacherProfile | null>>;
}

export default function ProfileRejectionMessage({ user, setUser }: ProfileRejectionMessageProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state: any) => state.loading.isLoading);

  if (user.approvedByAdmin !== "rejected" || !user.rejectionMessage) {
    return null;
  }

  const handleResubmit = async () => {
    const result = await Swal.fire({
      title: "Resubmit Application",
      text: "Are you sure you want to resubmit your application?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Resubmit",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        dispatch(setLoading(true));
        setUser({ ...user, hasApplied: true, approvedByAdmin: 'pending', rejectionMessage: null });
        const { hasApplied } = await applyTeacher();
        Swal.fire({
          title: "Success!",
          text: "Your application has been resubmitted.",
          icon: "success",
        });
        const updatedProfile = await getTeacherProfile();
        setUser(updatedProfile);
      } catch (err: any) {
        setUser({ ...user, hasApplied: user.hasApplied });
        Swal.fire({
          title: "Error!",
          text: err.message || "Failed to resubmit application.",
          icon: "error",
        });
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Application Rejected</h2>
      </div>
      <p className="text-slate-600 leading-relaxed text-lg mb-6">{user.rejectionMessage}</p>
      <div className="flex justify-end">
        <button
          onClick={handleResubmit}
          disabled={isLoading}
          className={`bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Resubmit Application'
          )}
        </button>
      </div>
    </div>
  );
}