import type { JSX } from "react";
import "../styles/HomePage.css";
import { useState } from "react";

const leagues = [
  { id: 'premier', name: 'Premier League', country: 'England', color: 'purple' },
  { id: 'laliga', name: 'La Liga', country: 'Spain', color: 'orange' },
  { id: 'seriea', name: 'Serie A', country: 'Italy', color: 'green' },
  { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', color: 'red' },
  { id: 'ligue1', name: 'Ligue 1', country: 'France', color: 'blue' },
  { id: 'psl', name: 'Betway Premiership', country: 'South Africa', color: 'black' },
];

const dummySerieA = [
  "Juventus VS Napoli",
  "Inter Milan VS AC Milan",
  "Lazio VS ROMA"
];
const dummyPremierLeague = [
  "Arsenal VS Chelsea",
  "Liverpool VS Tottenham",
  "Man Utd VS Man City"
];
const dummyLaliga = [
  "Real Madrid VS Barcelona",
  "Sevilla VS Atletico Madrid"
];
const dummyBundesliga = [
  "Bayern Munich VS Dortmund",
  "Frankfurt VS Bayer Leverkusen"
];
const dummyLigue1 = [
  "PSG VS Nantes"
];

const dummyTeams = [
  "Arsenal",
  "Chelsea",
  "Liverpool",
  "Manchester City",
  "Manchester United",
  "Tottenham",
  "Barcelona",
  "Real Madrid",
  "Juventus",
  "Napoli",
  "Bayern Munich",
  "PSG",
  "AC Milan",
  "Inter Milan",
  "Dortmund"
];

const getFixtures = (leagueId: string): string[] => {
  switch (leagueId) {
    case 'premier':
      return dummyPremierLeague;
    case 'laliga':
      return dummyLaliga;
    case 'seriea':
      return dummySerieA;
    case 'bundesliga':
      return dummyBundesliga;
    case 'ligue1':
      return dummyLigue1;
    default:
      return [];
  }
};

const HomePage = (): JSX.Element => {
  const [selectedLeague, setSelectedLeague] = useState('premier');
  const [searchQuery, setSearchQuery] = useState('');
  const fixtures = getFixtures(selectedLeague);

  const filteredTeams = dummyTeams.filter(team =>
    team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="home-page">
      <section className="heading-section">
        <h1 className="title">Welcome to <span className="highlight">BetWise</span></h1>
        <p className="subtitle">BETTiNG MADE SiMPLE.</p>
      </section>

      <section className="league-section">
        <h2 className="section-title">Select Your League</h2>
        <section className="league-buttons">
          {leagues.map((league) => (
            <button
              key={league.id}
              onClick={() => setSelectedLeague(league.id)}
              className={`league-button ${selectedLeague === league.id ? 'selected' : ''}`}
            >
              <section className="league-dot" style={{ backgroundColor: league.color }}></section>
              <section className="league-text">
                <section className="league-name">{league.name}</section>
                <section className="league-country">{league.country}</section>
              </section>
            </button>
          ))}
        </section>

        <section className="fixtures section">
          <h2 className="section-title">Fixtures</h2>
          <p className="fixtures-subheading">Select the fixture you want predictions for.</p>
          {fixtures.length > 0 ? (
            <ul className="fixtures-list">
              {fixtures.map((match, index) => (
                <li key={index} className="fixture-item">{match}</li>
              ))}
            </ul>
          ) : (
            <p className="no-fixtures">No fixtures available.</p>
          )}
        </section>
      </section>

      <section className="history section">
        <h2 className="section-title">Prediction History</h2>
        <p className="history-subheading">View previous predictions.</p>
        <section className="search-bar">
            <input
            type="text"
            placeholder="Search team"
            className="history-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
        </section>

        {searchQuery.trim() !== '' && (
        <ul className="history-list">
            {filteredTeams.length > 0 ? (
            filteredTeams.map((team, index) => (
                <li key={index} className="history-item">{team}</li>
            ))
            ) : (
            <p className="no-fixtures">No teams found.</p>
            )}
        </ul>
)}

      </section>

      <footer className="footer">
        © {new Date().getFullYear()} BetWise. All rights reserved.
      </footer>
    </main>
  );
};

export default HomePage;
