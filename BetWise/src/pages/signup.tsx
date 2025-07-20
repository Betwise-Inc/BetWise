import React, { useState } from "react";
import "../styles/signup.css";
import { createUser } from "../APIconfigs/Users";
type SignupFormProps = {
  isActive: boolean;
  onAlreadyHaveAccountClick: () => void;
};

const SignUp: React.FC<SignupFormProps> = ({ onAlreadyHaveAccountClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // State for success message

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      
      setSuccess("Account created successfully!");
      await createUser(email);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setSuccess(null);
    }
  };
  return (
    <section className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          test-id="email-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="signup-email"
        />
        <input
          test-id="password-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="signup-password"
        />
        <input
          test-id="confirm-password-input"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="signup-confirm-password"
        />
        <button type="submit" className="signup-button">
          Sign Up
        </button>
        {error && <p className="signup-error">{error}</p>}
        {success && <p className="signup-success">{success}</p>}{" "}
        {/* Display success message */}
      </form>
      <section className="have-account">
        <p>
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onAlreadyHaveAccountClick();
            }}
            className="to-login"
          >
            Login
          </a>
        </p>
      </section>
    </section>
  );
};

export default SignUp;
