import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../Hooks/UserContext";
import LoadingDots from "./loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  // Show loading spinner while Firebase is checking authentication
  if (loading) {
    return (
      <section className="loading">
        <LoadingDots numDots={10} radius={60} speed={0.8} size={10} />
      </section>
    );
  }

  // If user is not authenticated, redirect to auth page
  // Store the current location so we can redirect back after login
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