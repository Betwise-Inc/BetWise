import type { JSX } from "react";
import "../styles/HomePage.css";
import { useUser } from "../Hooks/UserContext";
import LoadingDots from "./loading";
import NavBar from "./Navbar";
import Footer from "./Footer";
const BetSlip = (): JSX.Element => {
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
        <h1 className="title">Your Bets</h1>
        <section className="heading-section">
          <p className="subtitle">BETTiNG MADE SiMPLE.</p>
        </section>
        <section>
          <p className="section-description">
            Review and manage your active bets.
          </p>
        </section>
      </>
      <section>
          <Footer />
        </section>
    </main>
  );
};

export default BetSlip;
