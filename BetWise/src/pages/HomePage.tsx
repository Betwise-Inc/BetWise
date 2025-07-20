import type { JSX } from "react";
import { useEffect } from "react";
import "../styles/HomePage.css";
import { useState, useRef } from "react";
import laligaLogo from '../assets/laliga_logo.svg';
import premierleagueLogo from '../assets/premierLeagueLogo.svg';
import bundesligaLogo from '../assets/bundesligaLogo.svg';
import serialLogo from '../assets/serieaLogo.svg';
import ligue1logo from '../assets/ligue1Logo.svg';
import betwayPremiershipLogo from '../assets/betwaypremiership.svg';






import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
//Competitions db,id = competition name from livescore API
//Admins can add competitions
const leagues = [
  { id: 'premier', name: 'Premier League', country: 'England', color: 'purple', logo: premierleagueLogo },
  { id: 'laliga', name: 'La Liga', country: 'Spain', color: 'orange', logo: laligaLogo },
  { id: 'seriea', name: 'Serie A', country: 'Italy', color: 'green', logo: serialLogo },
  { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', color: 'red', logo: bundesligaLogo },
  { id: 'ligue1', name: 'Ligue 1', country: 'France', color: 'blue', logo: ligue1logo },
  { id: 'psl', name: 'Betway Premiership', country: 'South Africa', color: 'black', logo: betwayPremiershipLogo },
];



const dummySerieA = [
  "Juventus VS Napoli",
  "Inter Milan VS AC Milan",
  "Lazio VS ROMA",
];
const dummyPremierLeague = [
  "Arsenal VS Chelsea",
  "Liverpool VS Tottenham",
  "Man Utd VS Man City",
];
const dummyLaliga = ["Real Madrid VS Barcelona", "Sevilla VS Atletico Madrid"];
const dummyBundesliga = [
  "Bayern Munich VS Dortmund",
  "Frankfurt VS Bayer Leverkusen",
];
const dummyLigue1 = ["PSG VS Nantes"];

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
  "Dortmund",
];

const getFixtures = (leagueId: string): string[] => {
  switch (leagueId) {
    case "premier":
      return dummyPremierLeague;
    case "laliga":
      return dummyLaliga;
    case "seriea":
      return dummySerieA;
    case "bundesliga":
      return dummyBundesliga;
    case "ligue1":
      return dummyLigue1;
    default:
      return [];
  }
};

const HomePage = (): JSX.Element => {



  const fixturesRef = useRef<HTMLElement>(null);
  const [selectedLeague, setSelectedLeague] = useState('premier');
  const [searchQuery, setSearchQuery] = useState('');


  const fixtures = getFixtures(selectedLeague);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogoutClick = async () => {
    try {
      await auth.signOut();
      navigate("/Auth");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  const filteredTeams = dummyTeams.filter((team) =>
    team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLeagueClick = (leagueId: string) => {
    setSelectedLeague(leagueId);
    fixturesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="home-page">
      <section className="navbar">
        <section className="navbar-left">
          <img
            data-testid="Pic2"
            src="https://th.bing.com/th/id/R.b15541f5211192e39040dbb75cfdae14?rik=Upya7SBm%2bYjb3w&riu=http%3a%2f%2fwww.freeiconspng.com%2fuploads%2fperson-icon-5.png&ehk=vP6v8y8lw%2brW7%2fJl3ecgKvm7UrO%2fbmZ70TGxNeY40fg%3d&risl=&pid=ImgRaw&r=0"
            alt="Pic2"
            className="user-image"
          />
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-username"
          >
            {userEmail}
          </a>
        </section>
        <section className="navbar-right">
          <button onClick={handleLogoutClick} className="logout">Logout</button>
        </section>
      </section>
      <section className="heading-section">
        <h1 className="title">
          Welcome to <span className="highlight">BetWise</span>
        </h1>
        <p className="subtitle">BETTiNG MADE SiMPLE.</p>
      </section>
      <section className="league-section">
        <h2 className="section-title">Select Your League</h2>
        <section className="league-buttons">
          {leagues.map((league) => (
            <button
              key={league.id}

              onClick={() => handleLeagueClick(league.id)}
              className={`league-button ${selectedLeague === league.id ? 'selected' : ''}`}
            >
              <section className="league-logo" ><img src={league.logo} alt={`${league.name} logo`} width={20} height={20} /></section>

              <section className="league-text">
                <section className="league-name">{league.name}</section>
                <section className="league-country">{league.country}</section>
              </section>
            </button>
          ))}
        </section>
      </section>


      <section ref={fixturesRef} className="fixtures section">
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
      
        <footer className="footer">

        © {new Date().getFullYear()} BetWise. All rights reserved.
      </footer>
      </section>

       
    </main>
  );
};

export default HomePage;
