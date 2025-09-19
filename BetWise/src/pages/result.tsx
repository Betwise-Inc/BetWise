import "../styles/bar.css";
import React, { useState, useEffect } from "react";

type ResultProps = {
  Win: number;
  Loss: number;
  Draw: number;
};

const ResultBar: React.FC<ResultProps> = ({ Win, Loss, Draw }) => {
  const total = Win + Loss + Draw;

  const targetWinPercent = total ? (Win / total) * 100 : 0;
  const targetLossPercent = total ? (Loss / total) * 100 : 0;
  const targetDrawPercent = total ? (Draw / total) * 100 : 0;

  // State to control animated widths
  const [winPercent, setWinPercent] = useState(0);
  const [lossPercent, setLossPercent] = useState(0);
  const [drawPercent, setDrawPercent] = useState(0);

  useEffect(() => {
    // Trigger the animation on mount and whenever props change
    const timeout = setTimeout(() => {
      setWinPercent(targetWinPercent);
      setLossPercent(targetLossPercent);
      setDrawPercent(targetDrawPercent);
    }, 50); // slight delay to ensure transition triggers

    return () => clearTimeout(timeout);
  }, [targetWinPercent, targetLossPercent, targetDrawPercent]);

  const formatPercent = (p: number) => p.toFixed(1) + "%";

  return (
    <section className="result-bar">
      <div className="result-bar-container">
        <div className="result-segment win" style={{ width: `${winPercent}%` }}>
          {winPercent > 5 && (
            <span className="percent-label">{formatPercent(winPercent)}</span>
          )}
        </div>
        <div
          className="result-segment draw"
          style={{ width: `${drawPercent}%` }}
        >
          {drawPercent > 5 && (
            <span className="percent-label">{formatPercent(drawPercent)}</span>
          )}
        </div>
        <div
          className="result-segment loss"
          style={{ width: `${lossPercent}%` }}
        >
          {lossPercent > 5 && (
            <span className="percent-label">{formatPercent(lossPercent)}</span>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResultBar;
