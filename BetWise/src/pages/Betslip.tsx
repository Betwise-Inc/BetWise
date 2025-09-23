import React from "react";
import type { JSX } from "react";
import "../styles/HomePage.css";
import "../styles/livescore.css"; // Reusing the same CSS styles
import { useUser } from "../Hooks/UserContext";
import LoadingDots from "./loading";
import NavBar from "./Navbar";
import Footer from "./Footer";
import { getCompetitions } from "../APIconfigs/Competitions";
import "../styles/Betslip.css";

export interface Comp {
  _id: number;
  name: string;
  country: string;
  logo: string;
  round: string;
}

export interface BetSelection {
  id: number;
  homeTeam: string;
  awayTeam: string;
  market: string;
  selection: string;
  odds: number;
  confidence: number;
  source: 'league' | 'insights';
}

export interface GeneratedBetSlip {
  id: string;
  selections: BetSelection[];
  totalOdds: number;
  recommendedStake: number;
  potentialReturn: number;
  confidence: number;
  createdAt: string;
}

type FilterType = "insights" | "league";

interface State {
  competitions: Comp[];
  selectedFilterType: FilterType;
  selectedLeagueId: number | null;
  betslip: GeneratedBetSlip | null;
  loading: boolean;
  error: string | null;
  dropdownOpen: boolean;
}

class BetSlipGenerator extends React.Component<unknown, State> {
  state: State = {
    competitions: [],
    selectedFilterType: "insights",
    selectedLeagueId: null,
    betslip: null,
    loading: false,
    error: null,
    dropdownOpen: false,
  };

  componentDidMount() {
    this.loadCompetitions();
    this.generateDefaultBetslip();
  }

  async loadCompetitions() {
    try {
      const competitions = await getCompetitions();
      this.setState({ competitions });
    } catch (err: any) {
      console.error("Error fetching competitions:", err);
      this.setState({ error: "Failed to load competitions" });
    }
  }

  generateDefaultBetslip() {
    // Mock betslip based on viewed insights (default)
    const mockInsightsBetslip: GeneratedBetSlip = {
      id: "betslip_insights_001",
      selections: [
        {
          id: 1,
          homeTeam: "Manchester City",
          awayTeam: "Arsenal",
          market: "Match Result",
          selection: "Manchester City Win",
          odds: 1.85,
          confidence: 78,
          source: 'insights'
        },
        {
          id: 2,
          homeTeam: "Liverpool",
          awayTeam: "Chelsea",
          market: "Both Teams To Score",
          selection: "Yes",
          odds: 1.65,
          confidence: 82,
          source: 'insights'
        },
        {
          id: 3,
          homeTeam: "Tottenham",
          awayTeam: "Newcastle",
          market: "Over/Under 2.5 Goals",
          selection: "Over 2.5",
          odds: 1.95,
          confidence: 75,
          source: 'insights'
        }
      ],
      totalOdds: 5.94,
      recommendedStake: 25,
      potentialReturn: 148.50,
      confidence: 78,
      createdAt: new Date().toLocaleString()
    };

    this.setState({ betslip: mockInsightsBetslip });
  }

  generateLeagueBetslip(leagueId: number) {
    // const { competitions } = this.state;
    // const selectedLeague = competitions.find(c => c._id === leagueId);
    
    // Mock betslip for selected league
    const mockLeagueBetslip: GeneratedBetSlip = {
      id: `betslip_league_${leagueId}`,
      selections: [
        {
          id: 4,
          homeTeam: "Team A",
          awayTeam: "Team B",
          market: "Match Result",
          selection: "Team A Win",
          odds: 2.10,
          confidence: 72,
          source: 'league'
        },
        {
          id: 5,
          homeTeam: "Team C",
          awayTeam: "Team D",
          market: "Total Goals",
          selection: "Over 1.5",
          odds: 1.45,
          confidence: 85,
          source: 'league'
        }
      ],
      totalOdds: 3.05,
      recommendedStake: 20,
      potentialReturn: 61.00,
      confidence: 79,
      createdAt: new Date().toLocaleString()
    };

    this.setState({ betslip: mockLeagueBetslip, loading: false });
  }

  toggleDropdown = () => {
    this.setState((s) => ({ dropdownOpen: !s.dropdownOpen }));
  };

  handleFilterTypeChange = (filterType: FilterType) => {
    this.setState({ 
      selectedFilterType: filterType, 
      dropdownOpen: false,
      loading: true 
    });

    if (filterType === "insights") {
      this.generateDefaultBetslip();
      this.setState({ loading: false });
    }
  };

  handleLeagueSelection = (leagueId: number) => {
    this.setState({ 
      selectedLeagueId: leagueId,
      selectedFilterType: "league",
      dropdownOpen: false,
      loading: true 
    });
    
    this.generateLeagueBetslip(leagueId);
  };

  getFilterDisplayText(): string {
    if (this.state.selectedFilterType === "insights") {
      return "Viewed Insights";
    }
    
    const { competitions, selectedLeagueId } = this.state;
    const selectedLeague = competitions.find(c => c._id === selectedLeagueId);
    return selectedLeague ? selectedLeague.name : "Select League";
  }

  renderBetSlip() {
    const { betslip } = this.state;
    
    if (!betslip) {
      return (
        <div className="live-score-no-fixtures">
          No betslip generated yet.
        </div>
      );
    }

    return (
      <div className="betslip-container">
        <div className="betslip-header">
          <h3 className="betslip-title">Generated BetSlip</h3>
          <div className="betslip-meta">
            <span className="betslip-confidence">
              Confidence: {betslip.confidence}%
            </span>
            <span className="betslip-created">
              {betslip.createdAt}
            </span>
          </div>
        </div>
        
        <div className="betslip-selections">
          {betslip.selections.map((selection) => (
            <div key={selection.id} className="betslip-selection">
              <div className="selection-match">
                {selection.homeTeam} vs {selection.awayTeam}
              </div>
              <div className="selection-details">
                <span className="selection-market">{selection.market}</span>
                <span className="selection-choice">{selection.selection}</span>
              </div>
              <div className="selection-footer">
                <span className="selection-odds">@{selection.odds}</span>
                <span className={`selection-confidence confidence-${selection.source}`}>
                  {selection.confidence}%
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="betslip-summary">
          <div className="summary-row">
            <span>Total Odds:</span>
            <span className="summary-value">{betslip.totalOdds.toFixed(2)}</span>
          </div>

        </div>
        
      </div>
    );
  }

  render() {
    const {
      competitions,
      selectedFilterType,
      loading,
      error,
      dropdownOpen,
    } = this.state;

    return (
      <main className="home-page">
        <NavBar navLinks={[]} />
        
        <section className="heading-section">
          <h1 className="title">
            Welcome to <span className="highlight">BetWise</span>
          </h1>
          <p className="subtitle">BETTING MADE SIMPLE.</p>
        </section>

        <section className="live-score-section" id="betslip-generator">
          <h2 className="live-score-title">Generate Betslip</h2>
          <p className="live-score-subheading">
            Create smart betslips based on insights or league analysis.
          </p>

          {/* Filter Section */}
          <div className="live-score-league-section">
            <div className="live-score-filter">
              <div className="live-score-filter-container">
                <button
                  className="live-score-filter-button"
                  onClick={this.toggleDropdown}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                >
                  Filter by source
                  <span className="dropdown-arrow">
                    {dropdownOpen ? "▲" : "▼"}
                  </span>
                </button>
                <span className="live-score-selected-league">
                  Selected: {this.getFilterDisplayText()}
                </span>
              </div>

              {dropdownOpen && (
                <ul className="live-score-dropdown" role="listbox">
                  <li
                    role="option"
                    aria-selected={selectedFilterType === "insights"}
                    className={`live-score-dropdown-item ${
                      selectedFilterType === "insights" ? "selected" : ""
                    }`}
                    onClick={() => this.handleFilterTypeChange("insights")}
                  >
                    <div className="live-score-league-text">
                      <div className="live-score-league-name">
                        Viewed Insights
                      </div>
                      <div className="live-score-league-country">
                        Based on your viewed content
                      </div>
                    </div>
                  </li>
                  
                  <li className="dropdown-divider">
                    <hr style={{margin: "8px 0", border: "none", borderTop: "1px solid rgba(28, 77, 120, 0.2)"}} />
                    <div style={{padding: "4px 16px", fontSize: "0.8rem", color: "#666", fontWeight: "bold"}}>
                      LEAGUES
                    </div>
                  </li>
                  
                  {competitions.map((league) => (
                    <li
                      key={league._id}
                      role="option"
                      aria-selected={false}
                      className="live-score-dropdown-item"
                      onClick={() => this.handleLeagueSelection(league._id)}
                    >
                      <div className="live-score-league-text">
                        <div className="live-score-league-name">
                          {league.name}
                        </div>
                        {league.country && (
                          <div className="live-score-league-country">
                            {league.country}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Loading / Error */}
          {loading && (
            <div className="live-score-loading">Generating betslip...</div>
          )}
          {error && !loading && (
            <div className="live-score-no-fixtures">Error: {error}</div>
          )}

          {/* Betslip Display */}
          {!loading && !error && this.renderBetSlip()}
        </section>

        <Footer />
      </main>
    );
  }
}

const BetSlip = (): JSX.Element => {
  const { loading: isUserLoading } = useUser();

  if (isUserLoading)
    return (
      <section className="loading">
        <LoadingDots numDots={10} radius={60} speed={0.8} size={10} />
      </section>
    );

  return <BetSlipGenerator />;
};

export default BetSlip;