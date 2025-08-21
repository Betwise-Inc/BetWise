import React from "react";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Hooks/UserContext";
import "../styles/Menu.css"; 

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      await auth.signOut();
      navigate("/");
      onClose(); // Close menu after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleNavigationClick = (path: string) => {
    navigate(path);
    onClose(); // Close menu after navigation
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <section className="menu" onClick={handleOverlayClick}>
      <section className="menu-left">
        <span className="nav-highlight">BetWise</span>
        <section className="menu-items">
          <button onClick={() => handleNavigationClick("/home")}>
            <span className="menu-item-text">Prediction History</span>
          </button>
          <button onClick={() => handleNavigationClick("/insights")}>
            <span className="menu-item-text">View Insights</span>
          </button>
          <button onClick={() => handleNavigationClick("/generate-betslip")}>
            <span className="menu-item-text">Generate BetSlip</span>
          </button>
        </section>
        <section className="menu-footer">
          <span className="user-profile">
            You are logged in as: {user?.email}
          </span>
          <button className="logout" onClick={handleLogoutClick}>
            <span className="menu-item-text">Logout</span>
          </button>
        </section>
      </section>
    </section>
  );
};

export default Menu;