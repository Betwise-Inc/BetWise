import type { JSX } from "react";
import "../styles/LandingPage.css";

const LandingPage = (): JSX.Element => {
  return (
    <main className="landingPage">
         <header className="mobile-header">
            <button type="button" className="get-started-mobile"> GET STARTED</button>
        </header>
        <section className="landing-container">
            <section className="landing-left">
                <h1 className="appName">BetWise</h1>
            </section>
            <section className="landing-right">
                <section className="slogan-container">
                    <p className="black-text">BETTiNG</p>
                    <p className="blue-text">MADE</p>
                    <p className="black-text">SiMPLE</p>
                    <button type="button" className="get-started-button"> GET STARTED</button>
                </section>
            </section>
        </section>

    </main>
  );
};

export default LandingPage;
