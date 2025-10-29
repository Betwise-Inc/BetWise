import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../Hooks/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  // While loading, render children (they will show their own loading state)
  if (loading) {
    return <>{children}</>;
  }

  // If user is not authenticated, redirect to auth page
  if (!user) {
    return (
      <Navigate 
        to="/Auth" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // User is authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;