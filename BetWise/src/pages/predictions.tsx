import React, { useState } from "react";
import "../styles/PredictionPage.css";
import ResultBar from "./result";

import { addViewedInsight} from "../APIconfigs/viewedInsights";
import type { Insight, TeamStats } from "../APIconfigs/viewedInsights";
import { useUser } from "../Hooks/UserContext";

type Props = {
  fixture: {
    home_name: string;
    away_name: string;
  };
  onClose: () => void;
};

const PredictionPage: React.FC<Props> = ({ fixture, onClose }) => {
  const { user } = useUser(); // Logged-in user
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user?.email) {
    return <p>Please log in to view insights</p>;
  }

  // Mock team stats
  const mockHomeStats: TeamStats = {
    name: fixture.home_name,
    win: 40,
    draw: 20,
    lose: 40,
  };

  const mockAwayStats: TeamStats = {
    name: fixture.away_name,
    win: 30,
    draw: 35,
    lose: 15,
  };

  const handleAdd = async () => {
    if (!user?.email) return;

    setLoading(true);

    const mockInsight: Insight = {
      home: mockHomeStats,
      away: mockAwayStats,
      goals: 3,
      both_teams_to_score: true,
    };

    try {
      await addViewedInsight(user.email, mockInsight);
      setAdded(true);
    } catch (err: any) {
      console.error("Add insight failed:", err.response?.data || err.message);
      alert("Failed to add insight");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="modal-overlay">
      <section className="modal">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>

        <section className="prediction-content">
          <h2 className="prediction-title">Match Insights</h2>
          <p className="prediction-text">{fixture.home_name} vs {fixture.away_name}</p>

          <div className="Home-outcome">
            {fixture.home_name}: <ResultBar Win={mockHomeStats.win} Draw={mockHomeStats.draw} Loss={mockHomeStats.lose} />
          </div>
          <div className="Away-outcome">
            {fixture.away_name}: <ResultBar Win={mockAwayStats.win} Draw={mockAwayStats.draw} Loss={mockAwayStats.lose} />
          </div>

          <p className="goals-overall">Goals Overall: Over 2.5</p>
          <p className="BTS">Both Teams to Score: Yes</p>

          <button
            className={`add-viewed-button ${added ? "added" : ""}`}
            onClick={handleAdd}
            disabled={added || loading}
          >
            {loading ? "Adding..." : added ? "Added" : "Add to Viewed Insights"}
          </button>
        </section>
      </section>
    </section>
  );
};

export default PredictionPage;
