
// "use client"

// import { useNavigate, } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import ProfileHeader from "../../Components/Profile/ProfileHeader";
// import ProfileAbout from "../../Components/Profile/ProfileAbout";
// import ProfileContact from "../../Components/Profile/ProfileContact";
// import ProfileSpecializations from "../../Components/Profile/ProfileSpecializations";
// import ProfileEducation from "../../Components/Profile/ProfileEducation";
// import ProfileAwards from "../../Components/Profile/ProfileAwards";
// import ProfileQualifications from "../../Components/Profile/ProfileQualifications";
// import ProfileCertificates from "../../Components/Profile/ProfileCertificates";
// import type { TeacherProfile, ProfileConfig } from "../../types/TeacherTypes";
// import { getTeacherProfile } from '../../API/teacherApi';

// export default function Profile() {
//   const [user, setUser] = useState<TeacherProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [config, setConfig] = useState<ProfileConfig>({} as ProfileConfig);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         setLoading(true);
//         const profileData = await getTeacherProfile();
//         setUser(profileData);
//         setError(null);
//       } catch (err) {
//         setError("Failed to fetch profile data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileData();
//   }, []);

//   const handleRetry = () => {
//     setError(null);
//     setLoading(true);
//     // Retry loading demo data
//     setTimeout(() => {
//       setLoading(false);
//       setError("Demo mode: Cannot retry in demo version");
//     }, 500);
//   };

//   const {
//     showSpecializations = true,
//     showEducation = true,
//     showAwards = true,
//     showQualifications = true,
//     showCertificates = true,
//     customSections = [],
//   } = config;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
//           <div className="text-center">
//             <div className="text-red-500 text-5xl mb-4">⚠️</div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
//             <p className="text-gray-600 mb-4">{error}</p>
//             <button
//               onClick={handleRetry}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600">No profile data found</p>
//           <button
//             onClick={() => navigate('/teacher/dashboard')}
//             className="mt-4 text-blue-600 hover:underline"
//           >
//             Return to dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <div className="container mx-auto px-4 py-12 max-w-6xl">
//         <ProfileHeader user={user} config={{showEditButton:true,showupdateButton:false}} setUser={setUser} />

//         <div className="grid grid-cols-1 xl:grid-cols-4 ">
//           <div className="xl:col-span-5 space-y-8">
//             <ProfileAbout user={user} />

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               <ProfileContact user={user} />
//               {showSpecializations && <ProfileSpecializations user={user} />}
//             </div>
//             {showQualifications && <ProfileQualifications user={user} />}
//             {showEducation && <ProfileEducation user={user} />}
//             {showAwards && <ProfileAwards user={user} />}
//             {showCertificates && <ProfileCertificates user={user} />}
//             {customSections.map((section, index) => (
//               <div key={index}>{section}</div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProfileHeader from "../../Components/Profile/ProfileHeader";
import ProfileAbout from "../../Components/Profile/ProfileAbout";
import ProfileContact from "../../Components/Profile/ProfileContact";
import ProfileSpecializations from "../../Components/Profile/ProfileSpecializations";
import ProfileEducation from "../../Components/Profile/ProfileEducation";
import ProfileAwards from "../../Components/Profile/ProfileAwards";
import ProfileQualifications from "../../Components/Profile/ProfileQualifications";
import ProfileCertificates from "../../Components/Profile/ProfileCertificates";
import ProfileRejectionMessage from "../../Components/Profile/ProfileRejectionMessage";
import type { TeacherProfile, ProfileConfig } from "../../types/TeacherTypes";
import { getTeacherProfile } from '../../API/teacherApi';

export default function Profile() {
  const [user, setUser] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<ProfileConfig>({} as ProfileConfig);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profileData = await getTeacherProfile();
        setUser(profileData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setError("Demo mode: Cannot retry in demo version");
    }, 500);
  };

  const {
    showSpecializations = true,
    showEducation = true,
    showAwards = true,
    showQualifications = true,
    showCertificates = true,
    customSections = [],
  } = config;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No profile data found</p>
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Return to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <ProfileHeader user={user} config={{ showEditButton: true, showupdateButton: false }} setUser={setUser} />
        <ProfileRejectionMessage user={user} setUser={setUser} />
        <div className="grid grid-cols-1 xl:grid-cols-4">
          <div className="xl:col-span-5 space-y-8">
            <ProfileAbout user={user} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ProfileContact user={user} />
              {showSpecializations && <ProfileSpecializations user={user} />}
            </div>
            {showQualifications && <ProfileQualifications user={user} />}
            {showEducation && <ProfileEducation user={user} />}
            {showAwards && <ProfileAwards user={user} />}
            {showCertificates && <ProfileCertificates user={user} />}
            {customSections.map((section, index) => (
              <div key={index}>{section}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}