import React, { useState } from "react";
import "../styles/PredictionPage.css";
import ResultBar from "./result";
type Props = {
  fixture: {
    home_name: string;
    away_name: string;
  };
  onClose: () => void;
};

const PredictionPage: React.FC<Props> = ({ fixture, onClose }) => {
  const [activeTab, setActiveTab] = useState<"insights" | "ai">("insights");

  return (
    <section className="modal-overlay">
      <section className="modal">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "insights" ? "active" : ""}`}
            onClick={() => setActiveTab("insights")}
          >
            Numerical Insights
          </button>
          <button
            className={`tab-button ${activeTab === "ai" ? "active" : ""}`}
            onClick={() => setActiveTab("ai")}
          >
            BetWise AI
          </button>
        </div>

        {/* Content */}
        <div className="tab-content">
          {activeTab === "insights" && (
            <section className="prediction-section">

              <p className="prediction-text">
                {fixture.home_name} vs {fixture.away_name}
              </p>
              <p className="Home-outcome">{fixture.home_name}:<ResultBar Win={40} Draw={20} Loss={40} /></p>
              <p className="Away-outcome">{fixture.away_name}:<ResultBar Win={30} Draw={35} Loss={15} /></p>
              <p className="goals-overall">Goals Overall :Over 2.5</p>
              <p className="BTS">Both Teams to Score:Yes</p>
            </section>
          )}

          {activeTab === "ai" && (
            <section className="prediction-section">
              <h2 className="prediction-title">BetWise AI Predictions</h2>
              <p className="prediction-text">
                Our AI model predicts the outcomes of upcoming matches based on historical data.
              </p>
            </section>
          )}
        </div>
      </section>
    </section>
  );
};

export default PredictionPage;
