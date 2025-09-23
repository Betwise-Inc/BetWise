import React, { useState, useEffect } from "react";
import "../styles/livescore.css"; // Reusing existing styles
import "../styles/history.css";
export interface TeamStats {
  name: string;
  win: number;
  draw: number;
  lose: number;
}

export interface Insight {
  home: TeamStats;
  away: TeamStats;
  goals: number;
  both_teams_to_score: boolean;
}

export interface PredictionRecord {
  id: number;
  fixture: {
    homeTeam: string;
    awayTeam: string;
    date: string;
  };
  prediction: Insight;
  actualResult: {
    homeScore: number;
    awayScore: number;
    totalGoals: number;
    bothTeamsScored: boolean;
  };
  outcomes: {
    matchResult: 'home' | 'draw' | 'away';
    goalsCorrect: boolean;
    bttsCorrect: boolean;
  };
}

interface AccuracyStats {
  totalPredictions: number;
  matchResultAccuracy: number;
  goalsAccuracy: number;
  bttsAccuracy: number;
  overallAccuracy: number;
}

const PredictionHistory: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [accuracyStats, setAccuracyStats] = useState<AccuracyStats>({
    totalPredictions: 0,
    matchResultAccuracy: 0,
    goalsAccuracy: 0,
    bttsAccuracy: 0,
    overallAccuracy: 0,
  });
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading mock data
    const loadMockData = () => {
      setLoading(true);
      
      // Mock prediction data
      const mockPredictions: PredictionRecord[] = [
        {
          id: 1,
          fixture: {
            homeTeam: "Manchester City",
            awayTeam: "Arsenal",
            date: "2024-09-20"
          },
          prediction: {
            home: { name: "Manchester City", win: 65, draw: 20, lose: 15 },
            away: { name: "Arsenal", win: 15, draw: 20, lose: 65 },
            goals: 3,
            both_teams_to_score: true
          },
          actualResult: {
            homeScore: 2,
            awayScore: 1,
            totalGoals: 3,
            bothTeamsScored: true
          },
          outcomes: {
            matchResult: 'home',
            goalsCorrect: true,
            bttsCorrect: true
          }
        },
        {
          id: 2,
          fixture: {
            homeTeam: "Liverpool",
            awayTeam: "Chelsea",
            date: "2024-09-18"
          },
          prediction: {
            home: { name: "Liverpool", win: 55, draw: 25, lose: 20 },
            away: { name: "Chelsea", win: 20, draw: 25, lose: 55 },
            goals: 2,
            both_teams_to_score: false
          },
          actualResult: {
            homeScore: 1,
            awayScore: 1,
            totalGoals: 2,
            bothTeamsScored: true
          },
          outcomes: {
            matchResult: 'draw',
            goalsCorrect: true,
            bttsCorrect: false
          }
        },
        {
          id: 3,
          fixture: {
            homeTeam: "Tottenham",
            awayTeam: "Newcastle",
            date: "2024-09-15"
          },
          prediction: {
            home: { name: "Tottenham", win: 40, draw: 30, lose: 30 },
            away: { name: "Newcastle", win: 30, draw: 30, lose: 40 },
            goals: 4,
            both_teams_to_score: true
          },
          actualResult: {
            homeScore: 3,
            awayScore: 1,
            totalGoals: 4,
            bothTeamsScored: true
          },
          outcomes: {
            matchResult: 'home',
            goalsCorrect: true,
            bttsCorrect: true
          }
        },
        {
          id: 4,
          fixture: {
            homeTeam: "Brighton",
            awayTeam: "West Ham",
            date: "2024-09-12"
          },
          prediction: {
            home: { name: "Brighton", win: 45, draw: 30, lose: 25 },
            away: { name: "West Ham", win: 25, draw: 30, lose: 45 },
            goals: 2,
            both_teams_to_score: false
          },
          actualResult: {
            homeScore: 0,
            awayScore: 2,
            totalGoals: 2,
            bothTeamsScored: false
          },
          outcomes: {
            matchResult: 'away',
            goalsCorrect: true,
            bttsCorrect: true
          }
        },
        {
          id: 5,
          fixture: {
            homeTeam: "Aston Villa",
            awayTeam: "Wolves",
            date: "2024-09-10"
          },
          prediction: {
            home: { name: "Aston Villa", win: 60, draw: 25, lose: 15 },
            away: { name: "Wolves", win: 15, draw: 25, lose: 60 },
            goals: 3,
            both_teams_to_score: true
          },
          actualResult: {
            homeScore: 1,
            awayScore: 0,
            totalGoals: 1,
            bothTeamsScored: false
          },
          outcomes: {
            matchResult: 'home',
            goalsCorrect: false,
            bttsCorrect: false
          }
        }
      ];

      setPredictions(mockPredictions);
      calculateAccuracy(mockPredictions);
      setLoading(false);
    };

    // Simulate API delay
    setTimeout(loadMockData, 1000);
  }, []);

  const calculateAccuracy = (predictionData: PredictionRecord[]) => {
    const total = predictionData.length;
    if (total === 0) return;

    let matchResultCorrect = 0;
    let goalsCorrect = 0;
    let bttsCorrect = 0;

    predictionData.forEach(record => {
      const { prediction, actualResult } = record;
      
      // Match result accuracy
      const predictedResult = getPredictedMatchResult(prediction);
      const actualMatchResult = getActualMatchResult(actualResult);
      if (predictedResult === actualMatchResult) {
        matchResultCorrect++;
      }

      // Goals accuracy
      if (prediction.goals === actualResult.totalGoals) {
        goalsCorrect++;
      }

      // Both teams to score accuracy
      if (prediction.both_teams_to_score === actualResult.bothTeamsScored) {
        bttsCorrect++;
      }
    });

    const matchResultAccuracy = (matchResultCorrect / total) * 100;
    const goalsAccuracy = (goalsCorrect / total) * 100;
    const bttsAccuracy = (bttsCorrect / total) * 100;
    const overallAccuracy = (matchResultAccuracy + goalsAccuracy + bttsAccuracy) / 3;

    setAccuracyStats({
      totalPredictions: total,
      matchResultAccuracy,
      goalsAccuracy,
      bttsAccuracy,
      overallAccuracy
    });
  };

  const getPredictedMatchResult = (prediction: Insight): 'home' | 'draw' | 'away' => {
    const { home, away } = prediction;
    if (home.win > away.win && home.win > home.draw) return 'home';
    if (away.win > home.win && away.win > away.draw) return 'away';
    return 'draw';
  };

  const getActualMatchResult = (result: PredictionRecord['actualResult']): 'home' | 'draw' | 'away' => {
    if (result.homeScore > result.awayScore) return 'home';
    if (result.awayScore > result.homeScore) return 'away';
    return 'draw';
  };

  const getFilteredPredictions = () => {
    if (selectedFilter === 'all') return predictions;
    
    return predictions.filter(record => {
      const predictedResult = getPredictedMatchResult(record.prediction);
      const actualResult = getActualMatchResult(record.actualResult);
      const isMatchCorrect = predictedResult === actualResult;
      const isGoalsCorrect = record.prediction.goals === record.actualResult.totalGoals;
      const isBttsCorrect = record.prediction.both_teams_to_score === record.actualResult.bothTeamsScored;
      
      const overallCorrect = isMatchCorrect && isGoalsCorrect && isBttsCorrect;
      
      if (selectedFilter === 'correct') return overallCorrect;
      return !overallCorrect;
    });
  };

  const getResultIcon = (correct: boolean) => {
    return correct ? (
      <span className="result-correct">✓</span>
    ) : (
      <span className="result-incorrect">✗</span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="live-score-section">
        <div className="live-score-loading">Loading prediction history...</div>
      </section>
    );
  }

  const filteredPredictions = getFilteredPredictions();

  return (
    <section className="live-score-section" id="prediction-history">
      <h2 className="live-score-title">Prediction History</h2>
      <p className="live-score-subheading">
        Compare predictions with actual results and track accuracy.
      </p>

      {/* Accuracy Stats */}
      <div className="accuracy-stats-container">
        <div className="accuracy-stats">
          <div className="stat-card overall">
            <div className="stat-value">{accuracyStats.overallAccuracy.toFixed(1)}%</div>
            <div className="stat-label">Overall Accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{accuracyStats.matchResultAccuracy.toFixed(1)}%</div>
            <div className="stat-label">Match Result</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{accuracyStats.goalsAccuracy.toFixed(1)}%</div>
            <div className="stat-label">Total Goals</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{accuracyStats.bttsAccuracy.toFixed(1)}%</div>
            <div className="stat-label">Both Teams Score</div>
          </div>
        </div>
        <div className="total-predictions">
          Total Predictions: {accuracyStats.totalPredictions}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="prediction-filters">
        <button
          className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('all')}
        >
          All ({predictions.length})
        </button>
        <button
          className={`filter-btn ${selectedFilter === 'correct' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('correct')}
        >
          Correct ({predictions.filter(p => {
            const matchCorrect = getPredictedMatchResult(p.prediction) === getActualMatchResult(p.actualResult);
            const goalsCorrect = p.prediction.goals === p.actualResult.totalGoals;
            const bttsCorrect = p.prediction.both_teams_to_score === p.actualResult.bothTeamsScored;
            return matchCorrect && goalsCorrect && bttsCorrect;
          }).length})
        </button>
        <button
          className={`filter-btn ${selectedFilter === 'incorrect' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('incorrect')}
        >
          Incorrect ({predictions.filter(p => {
            const matchCorrect = getPredictedMatchResult(p.prediction) === getActualMatchResult(p.actualResult);
            const goalsCorrect = p.prediction.goals === p.actualResult.totalGoals;
            const bttsCorrect = p.prediction.both_teams_to_score === p.actualResult.bothTeamsScored;
            return !(matchCorrect && goalsCorrect && bttsCorrect);
          }).length})
        </button>
      </div>

      {/* Predictions List */}
      <div className="predictions-container">
        {filteredPredictions.length > 0 ? (
          <ul className="predictions-list">
            {filteredPredictions.map((record) => {
              const predictedResult = getPredictedMatchResult(record.prediction);
              const actualResult = getActualMatchResult(record.actualResult);
              const isMatchCorrect = predictedResult === actualResult;
              const isGoalsCorrect = record.prediction.goals === record.actualResult.totalGoals;
              const isBttsCorrect = record.prediction.both_teams_to_score === record.actualResult.bothTeamsScored;

              return (
                <li key={record.id} className="prediction-item">
                  <div className="prediction-header">
                    <div className="match-info">
                      <div className="teams">
                        {record.fixture.homeTeam} vs {record.fixture.awayTeam}
                      </div>
                      <div className="match-date">{formatDate(record.fixture.date)}</div>
                    </div>
                    <div className="final-score">
                      {record.actualResult.homeScore} - {record.actualResult.awayScore}
                    </div>
                  </div>

                  <div className="prediction-details">
                    <div className="prediction-row">
                      <span className="prediction-type">Match Result:</span>
                      <div className="prediction-comparison">
                        <span className="predicted">
                          Predicted: {predictedResult.charAt(0).toUpperCase() + predictedResult.slice(1)}
                        </span>
                        <span className="actual">
                          Actual: {actualResult.charAt(0).toUpperCase() + actualResult.slice(1)}
                        </span>
                        {getResultIcon(isMatchCorrect)}
                      </div>
                    </div>

                    <div className="prediction-row">
                      <span className="prediction-type">Total Goals:</span>
                      <div className="prediction-comparison">
                        <span className="predicted">Predicted: {record.prediction.goals}</span>
                        <span className="actual">Actual: {record.actualResult.totalGoals}</span>
                        {getResultIcon(isGoalsCorrect)}
                      </div>
                    </div>

                    <div className="prediction-row">
                      <span className="prediction-type">Both Teams Score:</span>
                      <div className="prediction-comparison">
                        <span className="predicted">
                          Predicted: {record.prediction.both_teams_to_score ? 'Yes' : 'No'}
                        </span>
                        <span className="actual">
                          Actual: {record.actualResult.bothTeamsScored ? 'Yes' : 'No'}
                        </span>
                        {getResultIcon(isBttsCorrect)}
                      </div>
                    </div>

                    <div className="prediction-probabilities">
                      <div className="prob-item">
                        <span>Home Win: {record.prediction.home.win}%</span>
                      </div>
                      <div className="prob-item">
                        <span>Draw: {record.prediction.home.draw}%</span>
                      </div>
                      <div className="prob-item">
                        <span>Away Win: {record.prediction.away.win}%</span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="live-score-no-fixtures">
            No predictions found for the selected filter.
          </div>
        )}
      </div>
    </section>
  );
};

export default PredictionHistory;