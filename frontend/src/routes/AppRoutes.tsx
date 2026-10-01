import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Profile, UserRole } from '../types';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

import { Login } from '../features/auth/Login';

import { PilotDashboard } from '../features/pilot/PilotDashboard';
import { PilotProfile } from '../features/pilot/PilotProfile';
import { PilotDocuments } from '../features/pilot/PilotDocuments';
import { PilotStatus } from '../features/pilot/PilotStatus';

import { VerifierDashboard } from '../features/verifier/VerifierDashboard';
import { VerifierApplications } from '../features/verifier/VerifierApplications';
import { VerifierDetail } from '../features/verifier/VerifierDetail';

import { AdminDashboard } from '../features/admin/AdminDashboard';
import { AdminUsers } from '../features/admin/AdminUsers';
import { AdminAssignments } from '../features/admin/AdminAssignments';
import { AdminDocumentTypes } from '../features/admin/AdminDocumentTypes';
import { AdminVerificationRules } from '../features/admin/AdminVerificationRules';
import { AdminReports } from '../features/admin/AdminReports';
import { AdminAudit } from '../features/admin/AdminAudit';
import { AdminSettings } from '../features/admin/AdminSettings';
import { NotificationsCenter } from '../components/notifications/NotificationsCenter';

export interface AppRoutesProps {
  user: Profile | null;
  onLoginSuccess: (user: Profile) => void;
  onProfileUpdated: (user: Profile) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ user, onLoginSuccess, onProfileUpdated }) => {
  return (
    <Routes>
      <Route path="/login" element={<Login onLoginSuccess={onLoginSuccess} />} />

      {/* PILOT ROLE ROUTES */}
      <Route
        path="/pilot/dashboard"
        element={
          <ProtectedRoute user={user} allowedRoles={['pilot']}>
            <PilotDashboard user={user!} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pilot/profile"
        element={
          <ProtectedRoute user={user} allowedRoles={['pilot']}>
            <PilotProfile user={user!} onProfileUpdated={onProfileUpdated} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pilot/documents"
        element={
          <ProtectedRoute user={user} allowedRoles={['pilot']}>
            <PilotDocuments user={user!} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pilot/status"
        element={
          <ProtectedRoute user={user} allowedRoles={['pilot']}>
            <PilotStatus user={user!} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pilot/notifications"
        element={
          <ProtectedRoute user={user} allowedRoles={['pilot']}>
            <NotificationsCenter user={user!} />
          </ProtectedRoute>
        }
      />

      {/* VERIFIER ROLE ROUTES */}
      <Route
        path="/verifier/dashboard"
        element={
          <ProtectedRoute user={user} allowedRoles={['verifier', 'admin']}>
            <VerifierDashboard user={user!} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verifier/applications"
        element={
          <ProtectedRoute user={user} allowedRoles={['verifier', 'admin']}>
            <VerifierApplications user={user!} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verifier/applications/:applicationId"
        element={
          <ProtectedRoute user={user} allowedRoles={['verifier', 'admin']}>
            <VerifierDetail user={user!} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verifier/reports"
        element={
          <ProtectedRoute user={user} allowedRoles={['verifier', 'admin']}>
            <AdminReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verifier/notifications"
        element={
          <ProtectedRoute user={user} allowedRoles={['verifier', 'admin']}>
            <NotificationsCenter user={user!} />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROLE ROUTES */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/assignments"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <AdminAssignments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/document-types"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <AdminDocumentTypes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/verification-rules"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <AdminVerificationRules />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <AdminReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <AdminAudit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/system-settings"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <AdminSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <NotificationsCenter user={user!} />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK REDIRECTION */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate
              to={
                user.role_key === 'pilot' ? '/pilot/dashboard' :
                user.role_key === 'verifier' ? '/verifier/dashboard' : '/admin/dashboard'
              }
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};
