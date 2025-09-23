import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LangingPage";
import HomePage from "./pages/HomePage";
import Auth from "./pages/Auth";
import InsightsPage from "./pages/View";
import BetSlip from "./pages/Betslip";
import { UserProvider } from "./Hooks/UserContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import "./App.css";
import type { JSX } from "react";

function App(): JSX.Element {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Routes - No authentication required */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/Auth" element={<Auth />} />
          
          {/* Protected Routes - Authentication required */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/generate-betslip" 
            element={
              <ProtectedRoute>
                <BetSlip />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/insights" 
            element={
              <ProtectedRoute>
                <InsightsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all route - Redirect to landing page */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;