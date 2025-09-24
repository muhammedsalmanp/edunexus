
import { useNavigate } from "react-router-dom";
import type { TeacherProfile, ProfileConfig } from "../../types/TeacherTypes";
import { toggleApprovalStatus } from "../../API/adminApi";
import { applyTeacher, getTeacherProfile } from "../../API/teacherApi";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../store/slices/loadingSlice';

interface ProfileHeaderProps {
  user: TeacherProfile;
  config: ProfileConfig;
  setUser?: (user: TeacherProfile) => void;
}

export default function ProfileHeader({ user, config, setUser }: ProfileHeaderProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.loading.isLoading); 

  const {
    showApprovalStatus = true,
    showVerificationBadge = true,
    showExperience = true,
    showEditButton = true,
    editButtonText = "Update Profile",
    showupdateButton = true,
    theme = {},
  } = config;

  const { primaryColor = "blue", gradientFrom = "blue-600", gradientTo = "indigo-700" } = theme;

  const handleAdminAction = async (action: 'approved' | 'rejected') => {
    let rejectionMessage: string | undefined;

    if (action === "rejected") {
      const result = await Swal.fire({
        title: "Reject Teacher",
        text: `Please provide a reason for rejecting ${user.name}.`,
        input: "textarea",
        inputPlaceholder: "Enter rejection reason...",
        inputAttributes: {
          "aria-label": "Rejection reason",
        },
        showCancelButton: true,
        confirmButtonText: "Reject",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value) {
            return "You must provide a rejection reason";
          }
          return undefined;
        },
      });

      if (!result.isConfirmed) return;
      rejectionMessage = result.value;
    }

    const result = await Swal.fire({
      title: `Are you sure you want to ${action}?`,
      text: `This will ${action} the teacher ${user.name}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: action === "approved" ? "Yes, Approve" : "Yes, Reject",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        dispatch(setLoading(true));
        // Pass rejectionMessage to toggleApprovalStatus if rejecting
        await toggleApprovalStatus(user._id, action, rejectionMessage);
        Swal.fire({
          title: "Success!",
          text: `Teacher has been ${action === "approved" ? "approved" : "rejected"}.`,
          icon: "success",
        });
        navigate("/admin/teachers");
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Failed to update teacher status.",
          icon: "error",
        });
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const handleApply = async () => {
    const isCancel = user.hasApplied;
    const result = await Swal.fire({
      title: isCancel ? "Cancel Application" : "Submit Application",
      text: isCancel
        ? "Are you sure you want to cancel your application?"
        : "Are you sure you want to submit your application?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: isCancel ? "Yes, Cancel" : "Yes, Apply",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        dispatch(setLoading(true));
        if (setUser) {
          setUser({ ...user, hasApplied: !user.hasApplied });
        }
        const { hasApplied } = await applyTeacher();
        Swal.fire({
          title: "Success!",
          text: hasApplied ? "Your application has been submitted." : "Your application has been cancelled.",
          icon: "success",
        });
        if (setUser) {
          const updatedProfile = await getTeacherProfile();
          setUser(updatedProfile);
        }
      } catch (err: any) {
        if (setUser) {
          setUser({ ...user, hasApplied: user.hasApplied });
        }
        Swal.fire({
          title: "Error!",
          text: err.message || `Failed to ${isCancel ? 'cancel' : 'submit'} application.`,
          icon: "error",
        });
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const getApprovalStatus = () => {
    switch (user?.approvedByAdmin) {
      case "approved":
        return { text: "Approved", color: "bg-green-100 text-green-800", icon: "✓" };
      case "rejected":
        return { text: "Rejected", color: "bg-red-100 text-red-800", icon: "✗" };
      default:
        return { text: "Pending", color: "bg-yellow-100 text-yellow-800", icon: "⏳" };
    }
  };

  const handleEditProfile = () => {
    navigate('/teacher/profile/edit');
  };

  const handleCancel = () => {
    navigate('/admin/teachers');
  };

  const approvalStatus = getApprovalStatus();

  return (
    <div className="bg-blue-500 rounded-2xl shadow-xl overflow-hidden mb-8 border">
      <div
        className={`bg-gradient-to-r from-${gradientFrom} via-${primaryColor}-700 to-${gradientTo} px-8 py-16 text-white relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-white/30 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
              <img
                src={user.profilePic || "/placeholder.svg?height=140&width=140&query=professional portrait"}
                alt={user.name}
                className="relative w-36 h-36 rounded-full border-4 border-white shadow-2xl object-cover"
              />
              {showVerificationBadge && user.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-3 shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="text-center lg:text-left flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-3 tracking-tight">{user.name}</h1>
              <p className="text-blue-100 text-xl mb-4 capitalize font-medium">{user.role || "Teacher"}</p>
              <p className="text-blue-50 mb-6 max-w-2xl leading-relaxed">
                {showExperience && (user.experience ? `${user.experience} years of experience` : "No experience listed") + " • "}
                Member since {user.createdAt ? new Date(user.createdAt).getFullYear() : "Unknown"}
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {showApprovalStatus && (
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${approvalStatus.color} shadow-sm`}>
                    {approvalStatus.icon} {approvalStatus.text}
                  </span>
                )}
              {showupdateButton && user.rejectionMessage &&(
                  <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                    Reason: {user.rejectionMessage}
                  </span>
                )}

                {showVerificationBadge && user.isVerified && (
                  <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                    <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </span>
                )}
                {user.isBlocked && (
                  <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                    Blocked
                  </span>
                )}
                {user.hasApplied && (
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                    Applied
                  </span>
                )}
              </div>
            </div>

            {showEditButton && (
              <div className="flex gap-3">
                <button
                  onClick={handleEditProfile}
                  className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  {editButtonText}
                </button>

                <button
                  onClick={handleApply}
                  disabled={isLoading}
                  aria-busy={isLoading}
                  className={`relative bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-blue-700"
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
                    user.hasApplied ? 'Cancel' : 'Apply'
                  )}
                </button>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start z-10 relative">
              {showupdateButton && (
                <>
                  <button
                    onClick={() => handleAdminAction("approved")}
                    className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 shadow-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAdminAction("rejected")}
                    className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 shadow-lg"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-400 shadow-lg"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}