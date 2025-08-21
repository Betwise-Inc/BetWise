import type { JSX } from "react";
import "../styles/HomePage.css";
import { useUser } from "../Hooks/UserContext";
import LoadingDots from "./loading";
import NavBar from "./Navbar";

const HomePage = (): JSX.Element => {
  const { loading: isUserLoading } = useUser();

  if (isUserLoading)
    return (
      <section className="loading">
        <LoadingDots numDots={10} radius={60} speed={0.8} size={10} />
      </section>
    );
  return (
    <main className="home-page">
      <>
        <NavBar />
        <section className="heading-section">
          <h1 className="title">
            Welcome to <span className="highlight">BetWise</span>
          </h1>
          <p className="subtitle">BETTiNG MADE SiMPLE.</p>
        </section>
        <section className="history section" id="history">
          <h2 className="section-title">Prediction History</h2>
          <p className="history-subheading">View previous predictions.</p>

          <footer className="footer">
            © {new Date().getFullYear()} BetWise. All rights reserved.
          </footer>
        </section>
      </>
    </main>
  );
};

export default HomePage;
