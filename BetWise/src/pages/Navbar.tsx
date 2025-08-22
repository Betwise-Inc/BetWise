import React, { useState } from "react";
import "../styles/Nav.css";
import Menu from "./Menu";

type NavLink = [string, string]; 

interface NavBarProps {
  navLinks: NavLink[]; 
}

const NavBar: React.FC<NavBarProps> = ({ navLinks }) => {
  const [menuOpen, setMenuOpen] = useState(false);

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
          {navLinks.map(([label, href], index) => (
            <a key={index} href={href}>
              {label}
            </a>
          ))}
        </section>

        <section className="navbar-right"></section>
      </section>
      
      <Menu isOpen={menuOpen} onClose={handleMenuClose} />
    </>
  );
};

export default NavBar;