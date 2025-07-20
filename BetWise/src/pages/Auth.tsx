import type { JSX } from "react";
import Login from "./login";
import SignUp from "./signup";
import { useState } from "react";
import "../styles/Auth.css";
const Auth = (): JSX.Element => {
  const [showLogin, setShowLogin] = useState(true); // Default to showing login
  const [showSignup, setShowSignup] = useState(false);

  const handleCreateAccountClick = () => {
    setShowSignup(true); // Set to show signup form
    setShowLogin(false); // Hide login form
  };
  const handleAlreadyHaveAccountClick = () => {
    setShowSignup(false); // Hide signup form
    setShowLogin(true); // Show login form
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
