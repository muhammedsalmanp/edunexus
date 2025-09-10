

// import { useState } from "react"
// import {
//   Edit,
//   Phone,
//   Mail,
//   CheckCircle,
//   Star,
//   Award,
//   Users,
//   BookOpen,
//   Plus,
//   Settings,
//   Calendar,
//   Clock,
//   ChevronLeft,
//   ChevronRight,
//   MessageSquare,
//   ThumbsUp,
//   GraduationCap,
//   FileText,
//   Upload,
//   Key,
//   Bell,
//   Moon,
//   Sun,
//   Save,
//   X,
//   LogOut,
// } from "lucide-react"

// // Mock teacher data - in real app this would come from API
// const teacherData = {
//   name: "Dr. Sarah Johnson",
//   role: "Mathematics Instructor",
//   email: "sarah.johnson@school.edu",
//   phone: "+1 (555) 123-4567",
//   bio: "Passionate mathematics educator with over 10 years of experience in teaching advanced calculus and statistics. I believe in making complex mathematical concepts accessible and engaging for all students.",
//   profilePic: "/placeholder.svg?height=120&width=120",
//   isVerified: true,
//   rating: 4.8,
//   totalReviews: 127,
//   qualifications: ["Ph.D. in Mathematics", "M.Ed. in Curriculum and Instruction", "B.S. in Applied Mathematics"],
//   specializations: ["Calculus", "Statistics", "Linear Algebra", "Mathematical Modeling"],
//   awards: [
//     { title: "Excellence in Teaching Award", year: "2023" },
//     { title: "Outstanding Faculty Recognition", year: "2022" },
//   ],
//   courses: [
//     {
//       name: "Advanced Calculus I",
//       students: 45,
//       description: "Comprehensive introduction to differential and integral calculus",
//     },
//     {
//       name: "Statistics & Probability",
//       students: 38,
//       description: "Applied statistics for real-world problem solving",
//     },
//     { name: "Linear Algebra", students: 32, description: "Vector spaces, matrices, and linear transformations" },
//   ],
//   schedule: {
//     weeklyHours: 32,
//     availability: [
//       { day: "Monday", hours: "9:00 AM - 4:00 PM", status: "available" },
//       { day: "Tuesday", hours: "10:00 AM - 3:00 PM", status: "available" },
//       { day: "Wednesday", hours: "9:00 AM - 5:00 PM", status: "available" },
//       { day: "Thursday", hours: "11:00 AM - 4:00 PM", status: "available" },
//       { day: "Friday", hours: "9:00 AM - 2:00 PM", status: "available" },
//       { day: "Saturday", hours: "Not Available", status: "unavailable" },
//       { day: "Sunday", hours: "Not Available", status: "unavailable" },
//     ],
//     upcomingClasses: [
//       { course: "Advanced Calculus I", time: "9:00 AM", day: "Monday" },
//       { course: "Statistics & Probability", time: "2:00 PM", day: "Monday" },
//       { course: "Linear Algebra", time: "10:00 AM", day: "Tuesday" },
//     ],
//   },
//   feedback: {
//     ratingBreakdown: {
//       5: 89,
//       4: 28,
//       3: 7,
//       2: 2,
//       1: 1,
//     },
//     recentReviews: [
//       {
//         id: 1,
//         studentName: "Alex Chen",
//         studentInitials: "AC",
//         rating: 5,
//         date: "2 days ago",
//         course: "Advanced Calculus I",
//         comment:
//           "Dr. Johnson explains complex concepts in a way that's easy to understand. Her teaching style really helped me grasp calculus fundamentals. Highly recommend!",
//         helpful: 12,
//         teacherReply: null,
//       },
//       {
//         id: 2,
//         studentName: "Maria Rodriguez",
//         studentInitials: "MR",
//         rating: 5,
//         date: "1 week ago",
//         course: "Statistics & Probability",
//         comment:
//           "Excellent professor! Very patient and always willing to help during office hours. The real-world examples made statistics much more interesting.",
//         helpful: 8,
//         teacherReply:
//           "Thank you Maria! I'm glad the real-world applications helped make the concepts clearer. Keep up the great work!",
//       },
//       {
//         id: 3,
//         studentName: "James Wilson",
//         studentInitials: "JW",
//         rating: 4,
//         date: "2 weeks ago",
//         course: "Linear Algebra",
//         comment:
//           "Great teacher with deep knowledge. Sometimes moves a bit fast, but overall very good at explaining the material.",
//         helpful: 5,
//         teacherReply: null,
//       },
//     ],
//   },
//   certificates: [
//     { name: "Advanced Teaching Methods Certificate", issuer: "Educational Institute", year: "2023", verified: true },
//     { name: "Mathematics Education Specialist", issuer: "State University", year: "2022", verified: true },
//     { name: "Online Learning Certification", issuer: "Tech Education Board", year: "2021", verified: false },
//   ],
//   settings: {
//     emailNotifications: true,
//     pushNotifications: false,
//     darkMode: false,
//   },
// }

// export function TeacherProfile() {
//   const [isEditing, setIsEditing] = useState(false)
//   const [showAllReviews, setShowAllReviews] = useState(false)
//   const [settings, setSettings] = useState(teacherData.settings)

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">
//       {/* Header Section */}
//       <div className="bg-white border border-slate-200 shadow-sm rounded-lg">
//         <div className="p-6 pb-4">
//           <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//             {/* Profile Picture */}
//             <div className="relative">
//               <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-blue-100 rounded-full overflow-hidden">
//                 <img
//                   src={teacherData.profilePic || "/placeholder.svg"}
//                   alt={teacherData.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               {teacherData.isVerified && (
//                 <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
//                   <CheckCircle className="w-6 h-6 text-green-500" />
//                 </div>
//               )}
//             </div>

//             {/* Name, Role, and Actions */}
//             <div className="flex-1 space-y-3">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                 <div>
//                   <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
//                     {teacherData.name}
//                     {teacherData.isVerified && (
//                       <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded-full text-xs font-medium">
//                         Verified
//                       </span>
//                     )}
//                   </h1>
//                   <p className="text-lg text-slate-600 mt-1">{teacherData.role}</p>
//                 </div>
//                 <button
//                   onClick={() => setIsEditing(!isEditing)}
//                   className="border border-blue-200 text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
//                 >
//                   <Edit className="w-4 h-4" />
//                   Edit Profile
//                 </button>
//               </div>

//               {/* Rating */}
//               <div className="flex items-center gap-2">
//                 <div className="flex items-center">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`w-4 h-4 ${i < Math.floor(teacherData.rating) ? "text-yellow-400 fill-current" : "text-slate-300"}`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm font-medium text-slate-700">{teacherData.rating}</span>
//                 <span className="text-sm text-slate-500">({teacherData.totalReviews} reviews)</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="px-6 pb-6">
//           {/* Contact Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <Mail className="w-4 h-4 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Email</p>
//                 <p className="font-medium text-slate-900">{teacherData.email}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <Phone className="w-4 h-4 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Phone</p>
//                 <p className="font-medium text-slate-900">{teacherData.phone}</p>
//               </div>
//             </div>
//           </div>
//            <div className="">
//         <div className="p-6">
//           <h2 className="text-xl font-semibold text-slate-900 mb-4">About</h2>
//           <p className="text-slate-700 leading-relaxed">{teacherData.bio}</p>

//           {/* Specializations */}
//           <div className="mt-6">
//             <h3 className="text-lg font-medium text-slate-900 mb-3">Specializations</h3>
//             <div className="flex flex-wrap gap-2">
//               {teacherData.specializations.map((spec, index) => (
//                 <span
//                   key={index}
//                   className="bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm font-medium"
//                 >
//                   {spec}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Awards */}
//           <div className="mt-6">
//             <h3 className="text-lg font-medium text-slate-900 mb-3">Recent Awards</h3>
//             <div className="space-y-2">
//               {teacherData.awards.map((award, index) => (
//                 <div key={index} className="flex items-center gap-3">
//                   <Award className="w-4 h-4 text-yellow-500" />
//                   <span className="text-slate-700">{award.title}</span>
//                   <span className="text-sm text-slate-500">({award.year})</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//          <div className="">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-semibold text-slate-900">Qualifications & Certifications</h2>
//             <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
//               <Plus className="w-4 h-4" />
//               Add Certificate
//             </button>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Academic Qualifications */}
//             <div>
//               <h3 className="text-lg font-medium text-slate-900 mb-4">Academic Qualifications</h3>
//               <div className="space-y-3">
//                 {teacherData.qualifications.map((qualification, index) => (
//                   <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
//                     <div className="p-2 bg-blue-100 rounded-lg">
//                       <GraduationCap className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="font-medium text-slate-900 text-sm">{qualification}</div>
//                     </div>
//                     <button className="text-slate-500 hover:text-slate-700 p-1">
//                       <Edit className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Certifications */}
//             <div>
//               <h3 className="text-lg font-medium text-slate-900 mb-4">Professional Certifications</h3>
//               <div className="space-y-3">
//                 {teacherData.certificates.map((cert, index) => (
//                   <div key={index} className="p-3 border border-slate-200 rounded-lg">
//                     <div className="flex items-start justify-between mb-2">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-green-100 rounded-lg">
//                           <FileText className="w-4 h-4 text-green-600" />
//                         </div>
//                         <div>
//                           <div className="font-medium text-slate-900 text-sm">{cert.name}</div>
//                           <div className="text-xs text-slate-600">
//                             {cert.issuer} • {cert.year}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {cert.verified && (
//                           <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded-full text-xs font-medium">
//                             Verified
//                           </span>
//                         )}
//                         <button className="text-slate-500 hover:text-slate-700 p-1">
//                           <Edit className="w-3 h-3" />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 mt-2">
//                       <button className="text-xs border border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent px-2 py-1 rounded-md font-medium flex items-center gap-1 transition-colors">
//                         <Upload className="w-3 h-3" />
//                         Upload Proof
//                       </button>
//                       <button className="text-xs text-slate-600 hover:text-slate-700 px-2 py-1 rounded-md font-medium transition-colors">
//                         View Certificate
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Qualification Summary */}
//           <div className="mt-6 p-4 bg-slate-50 rounded-lg">
//             <h3 className="text-sm font-medium text-slate-900 mb-3">Qualification Summary</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">{teacherData.qualifications.length}</div>
//                 <div className="text-sm text-slate-600">Academic Degrees</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-green-600">{teacherData.certificates.length}</div>
//                 <div className="text-sm text-slate-600">Certifications</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-purple-600">
//                   {teacherData.certificates.filter((cert) => cert.verified).length}
//                 </div>
//                 <div className="text-sm text-slate-600">Verified</div>
//               </div>
//             </div>
//           </div>
//         </div>
//            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-sm font-medium text-slate-900">Save Changes</h3>
//                 <p className="text-xs text-slate-600">Your changes will be saved automatically</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button className="border border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
//                   <X className="w-4 h-4" />
//                   Cancel
//                 </button>
//                 <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
//                   <Save className="w-4 h-4" />
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//       </div>
//       </div>
//         </div>
//       </div>
//     </div> 


//   )
// }


import { useState } from "react";
import ProfileHeader from "../../Components/Profile/ProfileHeader";
import ContactInformation from "../../Components/Profile/ContactInfo";
import AboutSection from "../../Components/Profile/AboutSection";
import QualificationsSection from "../../Components/Profile/QualificationsSection";
import SaveChanges from "../../Components/Profile/SaveChanges";


const TeacherProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

 const teacherData = {
  name: "Dr. Sarah Johnson",
  role: "Mathematics Instructor",
  email: "sarah.johnson@school.edu",
  phone: "+1 (555) 123-4567",
  bio: "Passionate mathematics educator with over 10 years of experience in teaching advanced calculus and statistics. I believe in making complex mathematical concepts accessible and engaging for all students.",
  profilePic: "/placeholder.svg?height=120&width=120",
  isVerified: true,
  rating: 4.8,
  totalReviews: 127,
  qualifications: ["Ph.D. in Mathematics", "M.Ed. in Curriculum and Instruction", "B.S. in Applied Mathematics"],
  specializations: ["Calculus", "Statistics", "Linear Algebra", "Mathematical Modeling"],
  awards: [
    { title: "Excellence in Teaching Award", year: "2023" },
    { title: "Outstanding Faculty Recognition", year: "2022" },
  ],
  courses: [
    {
      name: "Advanced Calculus I",
      students: 45,
      description: "Comprehensive introduction to differential and integral calculus",
    },
    {
      name: "Statistics & Probability",
      students: 38,
      description: "Applied statistics for real-world problem solving",
    },
    { name: "Linear Algebra", students: 32, description: "Vector spaces, matrices, and linear transformations" },
  ],
  schedule: {
    weeklyHours: 32,
    availability: [
      { day: "Monday", hours: "9:00 AM - 4:00 PM", status: "available" },
      { day: "Tuesday", hours: "10:00 AM - 3:00 PM", status: "available" },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM", status: "available" },
      { day: "Thursday", hours: "11:00 AM - 4:00 PM", status: "available" },
      { day: "Friday", hours: "9:00 AM - 2:00 PM", status: "available" },
      { day: "Saturday", hours: "Not Available", status: "unavailable" },
      { day: "Sunday", hours: "Not Available", status: "unavailable" },
    ],
    upcomingClasses: [
      { course: "Advanced Calculus I", time: "9:00 AM", day: "Monday" },
      { course: "Statistics & Probability", time: "2:00 PM", day: "Monday" },
      { course: "Linear Algebra", time: "10:00 AM", day: "Tuesday" },
    ],
  },
  feedback: {
    ratingBreakdown: {
      5: 89,
      4: 28,
      3: 7,
      2: 2,
      1: 1,
    },
    recentReviews: [
      {
        id: 1,
        studentName: "Alex Chen",
        studentInitials: "AC",
        rating: 5,
        date: "2 days ago",
        course: "Advanced Calculus I",
        comment:
          "Dr. Johnson explains complex concepts in a way that's easy to understand. Her teaching style really helped me grasp calculus fundamentals. Highly recommend!",
        helpful: 12,
        teacherReply: null,
      },
      {
        id: 2,
        studentName: "Maria Rodriguez",
        studentInitials: "MR",
        rating: 5,
        date: "1 week ago",
        course: "Statistics & Probability",
        comment:
          "Excellent professor! Very patient and always willing to help during office hours. The real-world examples made statistics much more interesting.",
        helpful: 8,
        teacherReply:
          "Thank you Maria! I'm glad the real-world applications helped make the concepts clearer. Keep up the great work!",
      },
      {
        id: 3,
        studentName: "James Wilson",
        studentInitials: "JW",
        rating: 4,
        date: "2 weeks ago",
        course: "Linear Algebra",
        comment:
          "Great teacher with deep knowledge. Sometimes moves a bit fast, but overall very good at explaining the material.",
        helpful: 5,
        teacherReply: null,
      },
    ],
  },
  certificates: [
    { name: "Advanced Teaching Methods Certificate", issuer: "Educational Institute", year: "2023", verified: true },
    { name: "Mathematics Education Specialist", issuer: "State University", year: "2022", verified: true },
    { name: "Online Learning Certification", issuer: "Tech Education Board", year: "2021", verified: false },
  ],
  settings: {
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
  },
}

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
      <ProfileHeader teacher={teacherData} />
      <ContactInformation teacher={teacherData} />
      <AboutSection teacher={teacherData} />
      <QualificationsSection teacher={teacherData} />
      <SaveChanges />
    </div>
  );
};

export default TeacherProfile;
