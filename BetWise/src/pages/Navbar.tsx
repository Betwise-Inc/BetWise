import React, { useState } from "react";
// , { useRef, useEffect }
// import { useUser } from "../Hooks/UserContext";

import "../styles/Nav.css";
import Menu from "./Menu"; // Import your Menu component

const NavBar: React.FC = () => {
  // const { user } = useUser();
  // const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "?";

  const [menuOpen, setMenuOpen] = useState(false);
  // const wrapperRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
  //       setDropdownOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  const handleMenuClick = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <section className="navbar">
        <section className="navbar-left">
          <button className="hamburger-menu" onClick={handleMenuClick}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          <span className="nav-highlight">BetWise</span>
        </section>

        <section className="navbar-links">
          <a href="#competitions">Competitions</a>
          <a href="#fixtures">Fixtures</a>
          <a href="#history">History</a>
        </section>

        <section className="navbar-right"></section>
      </section>
      
      <Menu isOpen={menuOpen} onClose={handleMenuClose} />
    </>
  );
};

export default NavBar;