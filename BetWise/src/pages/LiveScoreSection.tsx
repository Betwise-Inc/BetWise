import React from "react";
import "../styles/LiveScore.css";
import { getCompetitions } from "../APIconfigs/Competitions"; 
import { fetchFixtures } from "../APIconfigs/fixtures"; 
import { fetchLiveScore } from "../APIconfigs/livescore";

export interface ApiFixture {
  id: number; // This is the fixture ID we need for live scores
  home_name: string;
  away_name: string;
  time?: string;
}

export interface Comp {
  _id: number;
  name: string;
  country: string;
  logo: string;
  round: string;
}

type FixtureStatus = "Upcoming" | "Live" | "HT" | "FT" | "IN PLAY";

interface FixtureVM {
  id: number; // Use actual fixture ID
  homeTeam: string;
  awayTeam: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status: FixtureStatus;
  minute?: string;
  time?: string;
  competitionId: number;
  round: string;
}

interface State {
  competitions: Comp[];
  selectedLeagueId: number | null;
  fixtures: FixtureVM[];
  loading: boolean;
  error: string | null;
  dropdownOpen: boolean;
}

class LiveScoreSection extends React.Component<unknown, State> {
  state: State = {
    competitions: [],
    selectedLeagueId: null,
    fixtures: [],
    loading: false,
    error: null,
    dropdownOpen: false,
  };

  componentDidMount() {
    this.loadCompetitions();
  }

  async loadCompetitions() {
    this.setState({ loading: true, error: null });
    try {
      const competitions = await getCompetitions();
      
      // Find Premier League and set it as default
      const premierLeague = competitions.find(
        comp => comp.name.toLowerCase().includes('premier league') || 
                comp.name.toLowerCase().includes('epl') ||
                comp.name.toLowerCase().includes('english premier')
      );
      
      if (premierLeague) {
        this.setState({ 
          competitions, 
          selectedLeagueId: premierLeague._id, 
          loading: false 
        }, () => {
          // Auto-load Premier League fixtures
          this.loadFixturesForLeague(premierLeague._id);
        });
      } else {
        this.setState({ competitions, loading: false });
      }
    } catch (err: any) {
      console.error("Error fetching competitions:", err);
      this.setState({ error: "Failed to load competitions", loading: false });
    }
  }

  async loadFixturesForLeague(leagueId: number) {
    const { competitions } = this.state;
    const comp = competitions.find((c) => c._id === leagueId);
    const round = comp?.round || "current";

    this.setState({ loading: true, error: null });
    try {
      const apiFixtures = await fetchFixtures(leagueId, round);
      
      // Create initial fixtures without scores
      const fixtures: FixtureVM[] = apiFixtures.map((fx) => ({
        id: fx.id, // Use actual fixture ID
        homeTeam: fx.home_name,
        awayTeam: fx.away_name,
        status: "Upcoming",
        time: fx.time,
        competitionId: leagueId,
        round,
      }));

      this.setState({ fixtures, loading: false });

      // Now fetch live scores for all fixtures
      this.loadLiveScores(fixtures);
    } catch (err: any) {
      console.error("Error fetching fixtures:", err);
      this.setState({ error: "Failed to load fixtures", fixtures: [], loading: false });
    }
  }

  async loadLiveScores(fixtures: FixtureVM[]) {
    try {
      // Fetch live scores for all fixtures
      const liveScorePromises = fixtures.map(fixture => 
        fetchLiveScore(fixture.id).catch(() => null) // Return null if live score fails
      );

      const liveScores = await Promise.all(liveScorePromises);

      // Update fixtures with live score data
      const updatedFixtures = fixtures.map((fixture, index) => {
        const liveScore = liveScores[index];
        
        if (liveScore) {
          // Parse the score string (e.g., "0 - 1" or "2 - 3")
          const scoreParts = liveScore.scores.score.split(' - ');
          const homeScore = scoreParts[0] ? parseInt(scoreParts[0]) : null;
          const awayScore = scoreParts[1] ? parseInt(scoreParts[1]) : null;

          return {
            ...fixture,
            homeScore,
            awayScore,
            status: this.mapApiStatusToFixtureStatus(liveScore.status),
            minute: liveScore.time,
          };
        }

        return fixture; // Return unchanged if no live score
      });

      this.setState({ fixtures: updatedFixtures });
    } catch (err: any) {
      console.error("Error fetching live scores:", err);
      // Don't show error for live scores, just keep fixtures without scores
    }
  }

  mapApiStatusToFixtureStatus(apiStatus: string): FixtureStatus {
    switch (apiStatus) {
      case "IN PLAY":
      case "LIVE":
        return "Live";
      case "HT":
      case "HALF_TIME":
        return "HT";
      case "FT":
      case "FINISHED":
        return "FT";
      default:
        return "Upcoming";
    }
  }

  toggleDropdown = () => {
    this.setState((s) => ({ dropdownOpen: !s.dropdownOpen }));
  };

  handleChooseLeague = (leagueId: number) => {
    this.setState({ selectedLeagueId: leagueId, dropdownOpen: false }, () => {
      this.loadFixturesForLeague(leagueId);
    });
  };

  getStatusClass(status: FixtureStatus) {
    switch (status) {
      case "Live":
        return "status-live";
      case "HT":
        return "status-ht";
      case "FT":
        return "status-ft";
      case "Upcoming":
      default:
        return "status-upcoming";
    }
  }

  formatFixtureDisplay(fixture: FixtureVM) {
    if (fixture.status === "Upcoming") {
      return `${fixture.homeTeam} vs ${fixture.awayTeam}${fixture.time ? ` - ${fixture.time}` : ""}`;
    } else if (fixture.homeScore !== null && fixture.awayScore !== null) {
      // Show actual scores when available
      return `${fixture.homeTeam} ${fixture.homeScore} - ${fixture.awayScore} ${fixture.awayTeam}`;
    } else {
      // Fallback for live games without score data
      return `${fixture.homeTeam} vs ${fixture.awayTeam}`;
    }
  }

  render() {
    const { competitions, selectedLeagueId, fixtures, loading, error, dropdownOpen } = this.state;
    const selectedLeagueName =
      competitions.find((c) => c._id === selectedLeagueId)?.name || "None";

    return (
      <section className="live-score-section" id="live-score">
        <h2 className="live-score-title">Live Score</h2>
        <p className="live-score-subheading">Stay updated with the latest scores.</p>

        {/* Filter by league */}
        <div className="live-score-league-section">
          <div className="live-score-filter">
            <div className="live-score-filter-container">
              <button
                className="live-score-filter-button"
                onClick={this.toggleDropdown}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
              >
                Filter by league
                <span className="dropdown-arrow">{dropdownOpen ? '▲' : '▼'}</span>
              </button>
              <span className="live-score-selected-league">Selected: {selectedLeagueName}</span>
            </div>

            {dropdownOpen && (
              <ul className="live-score-dropdown" role="listbox">
                {competitions.map((league) => (
                  <li
                    key={league._id}
                    role="option"
                    aria-selected={league._id === selectedLeagueId}
                    className={`live-score-dropdown-item ${
                      league._id === selectedLeagueId ? "selected" : ""
                    }`}
                    onClick={() => this.handleChooseLeague(league._id)}
                  >
                    <div className="live-score-league-text">
                      <div className="live-score-league-name">{league.name}</div>
                      {league.country && (
                        <div className="live-score-league-country">{league.country}</div>
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
          <div className="live-score-loading">Loading fixtures...</div>
        )}
        {error && !loading && (
          <div className="live-score-no-fixtures">Error: {error}</div>
        )}

        {/* Fixtures */}
        <div className="live-score-fixtures-container">
          {!loading && !error && fixtures.length > 0 ? (
            <ul className="live-score-fixtures-list">
              {fixtures.map((fixture) => (
                <li key={fixture.id} className="live-score-fixture-item">
                  <div className="live-score-fixture-content">
                    {this.formatFixtureDisplay(fixture)}
                  </div>
                  <div className={`live-score-fixture-status ${this.getStatusClass(fixture.status)}`}>
                    {fixture.status === "Live" && fixture.minute ? `${fixture.minute}'` : fixture.status}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            !loading &&
            !error && (
              <div className="live-score-no-fixtures">
                {selectedLeagueId
                  ? "No fixtures available for the selected league."
                  : "Choose a league to see fixtures."}
              </div>
            )
          )}
        </div>
      </section>
    );
  }
}

export default LiveScoreSection;