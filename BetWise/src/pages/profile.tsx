import React from "react";

import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Hooks/UserContext";

const Profile: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const handleLogoutClick = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  return (
    <section>
      <a target="_blank" rel="noopener noreferrer" className="navbar-username">
        {user?.email}
      </a>
      <button className="logout" onClick={handleLogoutClick}>Logout</button>
    </section>
  );
};

export default Profile;