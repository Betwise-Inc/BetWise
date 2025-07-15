import type { JSX } from "react";
import "../styles/LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = (): JSX.Element => {
    const navigate = useNavigate();
    return (
    <main className="landingPage">
         
        <section className="landing-container">
            <section className="landing-left">
                <h1 className="appName">BetWise</h1>
            </section>
            <section className="landing-right">
                <section className="slogan-container">
                    <p className="black-text">BETTiNG</p>
                    <p className="blue-text">MADE</p>
                    <p className="black-text">SiMPLE</p>
                    <button type="button" className="get-started-button" onClick={()=>navigate('/home')}> GET STARTED</button>
                </section>
            </section>
        </section>

    </main>
  );
};

export default LandingPage;
