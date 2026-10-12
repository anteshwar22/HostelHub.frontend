import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { HomePage } from '../pages/HomePage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { HostelManagement } from '../pages/admin/HostelManagement';
import { WardenManagement } from '../pages/admin/WardenManagement';
import { AdminRooms } from '../pages/admin/AdminRooms';
import { AdminNotices } from '../pages/admin/AdminNotices';

// Warden Pages
import { WardenDashboard } from '../pages/warden/WardenDashboard';
import { RoomGridPage } from '../pages/warden/RoomGridPage';
import { StudentManagement } from '../pages/warden/StudentManagement';
import { ComplaintManagement } from '../pages/warden/ComplaintManagement';
import { NightOutApproval } from '../pages/warden/NightOutApproval';
import { RoomChangeApproval } from '../pages/warden/RoomChangeApproval';
import { WardenNotices } from '../pages/warden/WardenNotices';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { StudentComplaints } from '../pages/student/StudentComplaints';
import { NightOutPass } from '../pages/student/NightOutPass';
import { RoomChangeRequest } from '../pages/student/RoomChangeRequest';
import { StudentNotices } from '../pages/student/StudentNotices';
import { HostelChatRoom } from '../pages/student/HostelChatRoom';
import { StudentRules } from '../pages/student/StudentRules';

// Root redirector based on authentication and active role
const RootRedirector = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <HomePage />;

  if (role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (role === 'WARDEN') return <Navigate to="/warden" replace />;
  if (role === 'STUDENT') return <Navigate to="/student" replace />;

  return <HomePage />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RootRedirector />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/student/login" element={<LoginPage />} />
      <Route path="/register" element={<LoginPage />} />

      {/* Admin Module */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="hostels" element={<HostelManagement />} />
        <Route path="wardens" element={<WardenManagement />} />
        <Route path="rooms" element={<AdminRooms />} />
        <Route path="notices" element={<AdminNotices />} />
      </Route>

      {/* Warden Module */}
      <Route
        path="/warden"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'WARDEN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<WardenDashboard />} />
        <Route path="rooms" element={<RoomGridPage />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="chat" element={<HostelChatRoom />} />
        <Route path="complaints" element={<ComplaintManagement />} />
        <Route path="night-out" element={<NightOutApproval />} />
        <Route path="room-change" element={<RoomChangeApproval />} />
        <Route path="notices" element={<WardenNotices />} />
      </Route>

      {/* Student Module */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="chat" element={<HostelChatRoom />} />
        <Route path="rules" element={<StudentRules />} />
        <Route path="complaints" element={<StudentComplaints />} />
        <Route path="night-out" element={<NightOutPass />} />
        <Route path="room-change" element={<RoomChangeRequest />} />
        <Route path="notices" element={<StudentNotices />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
