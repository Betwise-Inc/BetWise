import React, { useState } from "react";
import "../styles/Nav.css";
import Menu from "./Menu";
import ViewedInsights from "./viewedInsights"; // import your modal
import { FiFileText } from "react-icons/fi"; // paper icon from react-icons

type NavLink = [string, string]; 

interface NavBarProps {
  navLinks: NavLink[]; 
}

const NavBar: React.FC<NavBarProps> = ({ navLinks }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const handleMenuClick = () => setMenuOpen(true);
  const handleMenuClose = () => setMenuOpen(false);

  const handleInsightsClick = () => setShowInsights(true);

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

        <section className="navbar-right">
          <button
            className="insights-button"
            onClick={handleInsightsClick}
            title="Viewed Insights"
          >
            <FiFileText size={20} />
          </button>
        </section>
      </section>

      <Menu isOpen={menuOpen} onClose={handleMenuClose} />
      {showInsights && <ViewedInsights onClose={() => setShowInsights(false)} />}
    </>
  );
};

export default NavBar;
