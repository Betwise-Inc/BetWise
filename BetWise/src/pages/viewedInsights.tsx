import React, { useEffect, useState } from "react";
import { getViewedInsightsByEmail, deleteViewedInsight } from "../APIconfigs/viewedInsights";
import type { Insight, ViewedInsights as VI } from "../APIconfigs/viewedInsights";
import { useUser } from "../Hooks/UserContext";

type Props = {
  onClose: () => void;
};

const ViewedInsights: React.FC<Props> = ({ onClose }) => {
  const { user } = useUser();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const data: VI = await getViewedInsightsByEmail(user.email);
        setInsights(data.insights);
      } catch (err) {
        console.error("Failed to fetch viewed insights:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [user]);

  const handleDelete = async (index: number) => {
    if (!user?.email) return;
    setDeletingIndex(index);
    try {
      const response = await deleteViewedInsight(user.email, index);
      if (response.user) setInsights(response.user.insights);
      else setInsights([]);
    } catch (err) {
      console.error("Failed to delete insight:", err);
    } finally {
      setDeletingIndex(null);
    }
  };

  if (!user?.email) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <p>Please log in to view insights.</p>
          <button className="modal-submit" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>✕</button>
        <h3>Viewed Insights</h3>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : insights.length === 0 ? (
          <p className="no-fixtures">No viewed insights found.</p>
        ) : (
          <div className="modal-scroll">
            <ul className="history-list">
              {insights.map((insight, idx) => (
                <li key={idx} className="history-item">
                  <p><strong>{insight.home.name}</strong> vs <strong>{insight.away.name}</strong></p>
                  <p>{insight.home.name}: W {insight.home.win} - D {insight.home.draw} - L {insight.home.lose}</p>
                  <p>{insight.away.name}: W {insight.away.win} - D {insight.away.draw} - L {insight.away.lose}</p>
                  <p>Goals: {insight.goals}</p>
                  <p>BTS: {insight.both_teams_to_score ? "Yes" : "No"}</p>
                  <button
                    className="modal-submit"
                    onClick={() => handleDelete(idx)}
                    disabled={deletingIndex === idx}
                  >
                    {deletingIndex === idx ? "Deleting..." : "Delete"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewedInsights;
