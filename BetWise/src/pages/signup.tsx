import React, { useState } from "react";
import "../styles/signup.css";
import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createUser } from "../APIconfigs/Users";

type SignupFormProps = {
  isActive: boolean;
  onAlreadyHaveAccountClick: () => void;
};

const SignUp: React.FC<SignupFormProps> = ({ onAlreadyHaveAccountClick }) => {
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { email, password, confirmPassword } = form;

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUser(email);
      setMessage({ type: "success", text: "Account created successfully!" });
      setForm({ email: "", password: "", confirmPassword: "" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <section className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          test-id="email-input"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="signup-email"
        />
        <input
          test-id="password-input"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="signup-password"
        />
        <input
          test-id="confirm-password-input"
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className="signup-confirm-password"
        />
        <button type="submit" className="signup-button">
          Sign Up
        </button>
        {message && (
          <p className={message.type === "error" ? "signup-error" : "signup-success"}>
            {message.text}
          </p>
        )}
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
