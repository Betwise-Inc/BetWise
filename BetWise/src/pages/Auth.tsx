import type { JSX } from "react";
import Login from "./login";
import SignUp from "./signup";
import { useState, useEffect } from "react";
import { useUser } from "../Hooks/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingDots from "./loading";
import "../styles/Auth.css";

const Auth = (): JSX.Element => {
  const [showLogin, setShowLogin] = useState(true); 
  const [showSignup, setShowSignup] = useState(false);
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      // Redirect to the page they were trying to access, or home
      const from = (location.state as any)?.from || "/home";
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <section className="loading">
        <LoadingDots numDots={10} radius={60} speed={0.8} size={15} color="#1C4D78" />
      </section>
    );
  }

  const handleCreateAccountClick = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const handleAlreadyHaveAccountClick = () => {
    setShowSignup(false); 
    setShowLogin(true);
  };

  return (
    <main className="authentication-page">
      {showLogin && (
        <Login
          isActive={showLogin}
          onCreateAccountClick={handleCreateAccountClick}
        />
      )}
      {showSignup && (
        <SignUp
          isActive={showSignup}
          onAlreadyHaveAccountClick={handleAlreadyHaveAccountClick}
        />
      )}
    </main>
  );
};

export default Auth;