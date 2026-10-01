import React from 'react';
import { Navigate } from 'react-router-dom';
import { Profile, UserRole } from '../../types';

export interface ProtectedRouteProps {
  user: Profile | null;
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, allowedRoles, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role_key)) {
    const defaultRoute = 
      user.role_key === 'pilot' ? '/pilot/dashboard' :
      user.role_key === 'verifier' ? '/verifier/dashboard' : '/admin/dashboard';
    return <Navigate to={defaultRoute} replace />;
  }

  return <>{children}</>;
};
