import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import StudentLayout from './layouts/StudentLayout';
import InstructorLayout from './layouts/InstructorLayout';
import AdminLayout from './layouts/AdminLayout';

// Guards
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import CourseListing from './pages/public/CourseListing';
import CourseDetails from './pages/public/CourseDetails';
import VerifyCertificate from './pages/public/VerifyCertificate';
import Unauthorized from './pages/public/Unauthorized';
import NotFound from './pages/public/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AdminLogin from './pages/auth/AdminLogin';

// Student Pages
import Dashboard from './pages/student/Dashboard';
import MyCourses from './pages/student/MyCourses';
import CoursePlayer from './pages/student/CoursePlayer';
import Cart from './pages/student/Cart';
import Checkout from './pages/student/Checkout';
import Profile from './pages/student/Profile';

// Gamification & AI Student Pages (Phase 4)
import XPDashboard from './pages/student/XPDashboard';
import StreakDashboard from './pages/student/StreakDashboard';
import WeeklyGoal from './pages/student/WeeklyGoal';
import Achievements from './pages/student/Achievements';
import Leaderboard from './pages/student/Leaderboard';
import AINotes from './pages/student/AINotes';
import AIQuiz from './pages/student/AIQuiz';
import CodingPlayground from './pages/student/CodingPlayground';
import LiveClasses from './pages/student/LiveClasses';
import Certificates from './pages/student/Certificates';
import Wishlist from './pages/student/Wishlist';

// Instructor Studio Pages (Phase 5)
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorMyCourses from './pages/instructor/MyCourses';
import CreateCourse from './pages/instructor/CreateCourse';
import ManageCurriculum from './pages/instructor/ManageCurriculum';
import CreateQuiz from './pages/instructor/CreateQuiz';
import Discussions from './pages/instructor/Discussions';
import Reviews from './pages/instructor/Reviews';
import Earnings from './pages/instructor/Earnings';
import LiveClassManager from './pages/instructor/LiveClassManager';
import FacultySettings from './pages/instructor/FacultySettings';

// Admin Control Panel Pages (Phase 6)
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCourses from './pages/admin/ManageCourses';
import ManageCategories from './pages/admin/ManageCategories';
import ManagePayments from './pages/admin/ManagePayments';
import AdminSettings from './pages/admin/AdminSettings';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public Pages (with navbar/footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseListing />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/verify-certificate" element={<VerifyCertificate />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* Auth Pages (no navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />

        {/* Course Player (Standalone View) */}
        <Route
          path="/student/course/:id/play"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CoursePlayer />
            </ProtectedRoute>
          }
        />

        {/* Student Protected Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/student/dashboard" element={<Dashboard />} />
          <Route path="/student/my-learning" element={<MyCourses />} />
          
          {/* Gamification & AI Features */}
          <Route path="/student/xp" element={<XPDashboard />} />
          <Route path="/student/streak" element={<StreakDashboard />} />
          <Route path="/student/weekly-goal" element={<WeeklyGoal />} />
          <Route path="/student/achievements" element={<Achievements />} />
          <Route path="/student/leaderboard" element={<Leaderboard />} />
          
          {/* AI Tools & Code Sandbox */}
          <Route path="/student/ai-notes" element={<AINotes />} />
          <Route path="/student/ai-[#AIQuiz]" element={<AIQuiz />} />
          <Route path="/student/ai-quiz" element={<AIQuiz />} />
          <Route path="/student/playground" element={<CodingPlayground />} />
          
          {/* Live, Certificates, Wishlist */}
          <Route path="/student/live-classes" element={<LiveClasses />} />
          <Route path="/student/certificates" element={<Certificates />} />
          <Route path="/student/wishlist" element={<Wishlist />} />
          
          <Route path="/student/cart" element={<Cart />} />
          <Route path="/student/checkout" element={<Checkout />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/settings" element={<Profile />} />
        </Route>

        {/* Instructor Protected Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/my-courses" element={<InstructorMyCourses />} />
          <Route path="/instructor/create-course" element={<CreateCourse />} />
          <Route path="/instructor/manage-curriculum" element={<ManageCurriculum />} />
          <Route path="/instructor/create-quiz" element={<CreateQuiz />} />
          <Route path="/instructor/discussions" element={<Discussions />} />
          <Route path="/instructor/reviews" element={<Reviews />} />
          <Route path="/instructor/earnings" element={<Earnings />} />
          <Route path="/instructor/live-classes" element={<LiveClassManager />} />
          <Route path="/instructor/settings" element={<FacultySettings />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/approvals" element={<ManageCourses />} />
          <Route path="/admin/courses" element={<ManageCourses />} />
          <Route path="/admin/categories" element={<ManageCategories />} />
          <Route path="/admin/payments" element={<ManagePayments />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
