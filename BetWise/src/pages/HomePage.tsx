import type { JSX } from "react";
import "../styles/HomePage.css";

const HomePage = (): JSX.Element => {
  return (
    <main className="homePage">
        <section className="landing-container">
            <section className="landing-left">
                <h1 className="appName">BetWise</h1>
            </section>
            <section className="landing-right">
                <section className="slogan-container">
                    <p><span className="black-text">BETTiNG</span></p>
                    <p><span className="blue-text">MADE</span></p>
                    <p><span className="black-text">SiMPLE</span></p>
                </section>
            </section>


        </section>

    </main>
  );
};

export default HomePage;
