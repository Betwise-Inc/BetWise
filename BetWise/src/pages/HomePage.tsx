import type { JSX } from "react";
import "../styles/HomePage.css";
import { useUser } from "../Hooks/UserContext";
import LoadingDots from "./loading";
import NavBar from "./Navbar";
import Footer from "./Footer";
import LiveScoreSection from "./LiveScoreSection"; 
import PredictionHistory from "./history";

const HomePage = (): JSX.Element => {
  const { loading: isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <section className="loading">
        <LoadingDots numDots={10} radius={60} speed={0.8} size={15} color="#1C4D78" />
      </section>
    );
  }

  return (
    <main className="home-page">
      <NavBar navLinks={[]} />
      <section className="heading-section">
        <h1 className="title">
          Welcome to <span className="highlight">BetWise</span>
        </h1>
        <p className="subtitle">BETTiNG MADE SiMPLE.</p>
      </section>
      
      <LiveScoreSection />
      <PredictionHistory />
      <section>
        <Footer />
      </section>
    </main>
  );
};

export default HomePage;