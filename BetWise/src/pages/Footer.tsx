import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} BetWise. All rights reserved.
    </footer>
  );
};

export default Footer;
