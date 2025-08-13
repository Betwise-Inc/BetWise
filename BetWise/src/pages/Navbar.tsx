import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../Hooks/UserContext";
import Profile from "./profile";
import "../styles/Nav.css";

const NavBar: React.FC = () => {
  const { user } = useUser();
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "?";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="navbar">
      <section className="navbar-left"></section>

      <section className="navbar-links">
        <a href="#competitions">Competitions</a>
        <a href="#fixtures">Fixtures</a>
        <a href="#history">History</a>
      </section>

      <section className="navbar-right">
        <div
          className="user-initial-wrapper"
          ref={wrapperRef}
          onClick={() => setDropdownOpen((open) => !open)}
        >
          <div className="user-initial-circle" data-testid="UserInitialCircle">
            {userInitial}
          </div>
          <div
            className={`profile-dropdown ${dropdownOpen ? "dropdown-visible" : ""}`}
          >
            <Profile />
          </div>
        </div>
      </section>
    </section>
  );
};

export default NavBar;
