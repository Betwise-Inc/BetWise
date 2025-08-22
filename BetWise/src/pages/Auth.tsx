import type { JSX } from "react";
import Login from "./login";
import SignUp from "./signup";
import { useState } from "react";
import "../styles/Auth.css";
const Auth = (): JSX.Element => {
  const [showLogin, setShowLogin] = useState(true); 
  const [showSignup, setShowSignup] = useState(false);

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
