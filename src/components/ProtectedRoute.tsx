import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'vendor';
  requireVerification?: boolean;
  requireApproval?: boolean; // For vendors
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requireVerification = true,
  requireApproval = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/customer/login" state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Check verification requirement
  if (requireVerification && !user.verified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Check approval requirement (for vendors)
  if (requireApproval && user.role === 'vendor' && !user.approved) {
    return <Navigate to="/vendor/pending-approval" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;