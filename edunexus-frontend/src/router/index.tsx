import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "../pages/Pages/HomePage"
import Coureses from "../pages/Pages/Coureses";
import Updates from "../pages/Pages/Update";
import Contact from "../pages/Pages/Contact";


import StudentLayout from "../layouts/StudetLayout";
import ProtectedRoute from "./ProtectedRoute";
import RedirectHandler from "./RedirectHandler";
import PublicOnlyRoute from "./PublicOnlyRoute";
import StudentSignupPage from "../pages/Student/StudentSignupPage";
import TeacherSignupPage from "../pages/Teacher/TeacherSignupPage";
import AdminSignupPage from "../pages/Admin/AdminSignupPage";
import StudentLoginPage from "../pages/Student/StudentLoginPage";
import TeacherLoginPage from "../pages/Teacher/TeacherLoginPage";
import AdminLoginPage from "../pages/Admin/AdminLoginPage";
import AdminOtpVerification from "../pages/Admin/AdminOtpVerification";
import StudentOtpVerification from "../pages/Student/StudentOtpVerification";
import TeacherOtpVerification from "../pages/Teacher/TeacherOtpVerification";
import AdminForgotPassword from "../pages/Admin/AdminForgotPassword";
import StudentForgotPassword from "../pages/Student/StudentForgotPassword";
import TeacherForgotPassword from "../pages/Teacher/TeacherForgotPassword";
import AdminResetPassword from "../pages/Admin/AdminResetPassword";
import StudentRestPassword from "../pages/Student/StudentRestPassword";
import TeacherResetPasswor from "../pages/Teacher/TeacherResetPasswor";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UserTable from '../pages/Admin/UsersTable';
import TeachersTable from "../pages/Admin/TeachersTable";
import TeacherLayout from "../layouts/TeacherLayout";
import Dashboard from "../pages/Teacher/Dashboard";
import ProfilePage from "../pages/Teacher/Profile";
import EditProfileForm from "../pages/Teacher/EditProfileForm";
import AdminTeacherProfile from "../pages/Admin/AdminTeacherProfile";
import { TeacherCourses } from "../pages/Teacher/TeacherCourses";
import { CreateCourseForm } from "../pages/Teacher/CreateCourseForm";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <RedirectHandler />

            <Routes>
                {/* Public routes */}
                <Route path="/register/student" element={<PublicOnlyRoute><StudentSignupPage /></PublicOnlyRoute>} />
                <Route path="/register/teacher" element={<PublicOnlyRoute><TeacherSignupPage /></PublicOnlyRoute>} />
                <Route path="/register/admin" element={<PublicOnlyRoute><AdminSignupPage /></PublicOnlyRoute>} />
                <Route path="/verify-otp/admin" element={<PublicOnlyRoute><AdminOtpVerification /></PublicOnlyRoute>} />
                <Route path="/verify-otp/student" element={<PublicOnlyRoute><StudentOtpVerification /></PublicOnlyRoute>} />
                <Route path="/verify-otp/teacher" element={<PublicOnlyRoute><TeacherOtpVerification /></PublicOnlyRoute>} />
                <Route path="/login/student" element={<PublicOnlyRoute><StudentLoginPage /></PublicOnlyRoute>} />
                <Route path="/login/teacher" element={<PublicOnlyRoute><TeacherLoginPage /></PublicOnlyRoute>} />
                <Route path="/login/admin" element={<PublicOnlyRoute><AdminLoginPage /></PublicOnlyRoute>} />
                <Route path="/forgot-password/admin" element={<PublicOnlyRoute><AdminForgotPassword /></PublicOnlyRoute>} />
                <Route path="/forgot-password/student" element={<PublicOnlyRoute><StudentForgotPassword /></PublicOnlyRoute>} />
                <Route path="/forgot-password/teacher" element={<PublicOnlyRoute><TeacherForgotPassword /></PublicOnlyRoute>} />
                <Route path="/reset-password/admin" element={<PublicOnlyRoute><AdminResetPassword /></PublicOnlyRoute>} />
                <Route path="/reset-password/student" element={<PublicOnlyRoute><StudentRestPassword /></PublicOnlyRoute>} />
                <Route path="/reset-password/teacher" element={<PublicOnlyRoute><TeacherResetPasswor /></PublicOnlyRoute>} />

                <Route path="/" element={<StudentLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="courses" element={<Coureses />} />
                    <Route path="updates" element={<Updates />} />
                    <Route path="contact" element={<Contact />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
                    <Route path="/" element={<StudentLayout />}>
                        <Route path="profile" element={<ProfilePage />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<UserTable />} />
                        <Route path="teachers" element={<TeachersTable />} />
                        <Route path="teacher-profile/:teacherId" element={<AdminTeacherProfile />} />
                    </Route>
                </Route>
                <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
                    <Route path="/teacher" element={<TeacherLayout />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="Profile" element={<ProfilePage />} />
                        <Route path="profile/edit" element={<EditProfileForm />} />
                        <Route path="courses" element={<TeacherCourses />} />
                        <Route path="course/add" element={<CreateCourseForm />} />
                    </Route>
                </Route>

            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;