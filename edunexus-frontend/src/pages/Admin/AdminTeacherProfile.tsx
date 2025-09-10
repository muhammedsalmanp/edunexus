import { useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getTeacherProfile } from '../../API/adminApi';
import ProfileHeader from "../../Components/Profile/ProfileHeader";
import ProfileAbout from "../../Components/Profile/ProfileAbout";
import ProfileContact from "../../Components/Profile/ProfileContact";
import ProfileSpecializations from "../../Components/Profile/ProfileSpecializations";
import ProfileEducation from "../../Components/Profile/ProfileEducation";
import ProfileAwards from "../../Components/Profile/ProfileAwards";
import ProfileQualifications from "../../Components/Profile/ProfileQualifications";
import ProfileCertificates from "../../Components/Profile/ProfileCertificates";
import type { TeacherProfile, ProfileConfig } from "../../types/TeacherTypes";

export default function AdminTeacherProfile() {
  const { teacherId } = useParams<{ teacherId: string }>();
  const [user, setUser] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config ,setConfig] = useState<ProfileConfig>({} as ProfileConfig);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!teacherId) {
        setError("Teacher ID not provided");
        setLoading(false);
        return;
      }
      try {
        const data = await getTeacherProfile(teacherId);
        setUser(data);
      } catch {
        setError("Failed to fetch teacher profile");
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [teacherId]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No teacher data found</div>;

  const {
    showSpecializations = true,
    showEducation = true,
    showAwards = true,
    showQualifications = true,
    showCertificates = true,
    showEditButton=false,
    showupdateButton=true,
    customSections = [],
  } = config;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <ProfileHeader user={user} config={{showEditButton:false, showupdateButton:true}} />
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
