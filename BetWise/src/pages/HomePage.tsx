import type { JSX } from "react";
import { useEffect } from "react";
import "../styles/HomePage.css";
import { useState, useRef } from "react";
import {
  getCompetitions,
  AddCompetition,
  deleteCompetitionById,
} from "../APIconfigs/Competitions";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { getUserByEmail } from "../APIconfigs/Users";
//Competitions db,id = competition name from livescore API
//Admins can add competitions
type Competition = {
  _id: number; // Or `string` if you're using string IDs
  name: string;
  country: string;
  logo: string;
};

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
    case "2":
      return dummyPremierLeague;
    case "3":
      return dummyLaliga;
    case "4":
      return dummySerieA;
    case "1":
      return dummyBundesliga;
    case "5":
      return dummyLigue1;
    default:
      return [];
  }
};

const HomePage = (): JSX.Element => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const fixturesRef = useRef<HTMLElement>(null);
  const [selectedLeague, setSelectedLeague] = useState("2");
  const [searchQuery, setSearchQuery] = useState("");
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompetition, setNewCompetition] = useState({
    _id: 0,
    name: "",
    country: "",
    logo: "",
  });

  const [user, setUser] = useState<{
    email: string | null;
    isAdmin: boolean;
  } | null>(null);
  const fixtures = getFixtures(selectedLeague);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email;
        if (email) {
          try {
            const userData = await getUserByEmail(email);
            setUser({ email, isAdmin: userData?.isAdmin || false });
          } catch {
            setUser({ email, isAdmin: false });
          }
        } else {
          setUser({ email: null, isAdmin: false });
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const data = await getCompetitions();
        setCompetitions(data);
      } catch (error) {
        console.error("Error fetching competitions:", error);
      }
    };

    fetchCompetitions();
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
  const handleAddCompetition = async () => {
    try {
      const { _id, name, country, logo } = newCompetition;
      await AddCompetition(_id, name, country, logo);

      setShowAddForm(false);
      setNewCompetition({ _id: 0, name: "", country: "", logo: "" }); 
      const data = await getCompetitions();
      setCompetitions(data);
    } catch (err) {
      console.error("Error adding competition:", err);
    }
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
            {user?.email}
          </a>
        </section>
        <section className="navbar-right">
          <button onClick={handleLogoutClick} className="logout">
            Logout
          </button>
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
          {competitions.map((league) => (
            <section className="league-wrapper" key={league._id.toString()}>
              <button
                onClick={() => handleLeagueClick(league._id.toString())}
                className={`league-button ${
                  selectedLeague === league._id.toString() ? "selected" : ""
                }`}
              >
                <section className="league-logo">
                  <img
                    src={league.logo}
                    alt={`${league.name} logo`}
                    width={20}
                    height={20}
                  />
                </section>

                <section className="league-text">
                  <section className="league-name">{league.name}</section>
                  <section className="league-country">{league.country}</section>
                </section>
              </button>

              {user?.isAdmin && (
                <div className="dots-wrapper">
                  <button
                    className="dots-button"
                    aria-label="More options"
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === league._id ? null : league._id
                      )
                    }
                  >
                    ⋮
                  </button>
                  {openDropdownId === league._id && (
                    <ul className="dropdown-menu">
                      <li
                        className="dropdown-item"
                        onClick={async () => {
                          const confirmDelete = window.confirm(
                            `Are you sure you want to delete ${league.name}?`
                          );
                          if (confirmDelete) {
                            try {
                              await deleteCompetitionById(league._id);
                              
                              setOpenDropdownId(null);
                          
                              const data = await getCompetitions();
                              setCompetitions(data);
                             
                              if (selectedLeague === league._id.toString()) {
                                setSelectedLeague("");
                              }
                            } catch (error) {
                              console.error(
                                "Error deleting competition:",
                                error
                              );
                             
                            }
                          } else {
                            setOpenDropdownId(null);
                          }
                        }}
                      >
                        Delete
                      </li>
                      <li
                        className="dropdown-item"
                        onClick={() => {
                          alert(`Modify ${league.name} (to be implemented)`);
                          setOpenDropdownId(null);
                        }}
                      >
                        Modify
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </section>
          ))}
        </section>
        {user?.isAdmin && (
          <section className="add-competition-container">
            <button
              className="add-competition-button"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? "Cancel" : "+ Add Competition"}
            </button>
          </section>
        )}
        {showAddForm && (
          <section className="add-competition-form">
            <input
              type="number"
              placeholder="ID"
              value={newCompetition._id}
              onChange={(e) =>
                setNewCompetition({
                  ...newCompetition,
                  _id: Number(e.target.value),
                })
              }
            />
            <input
              type="text"
              placeholder="League Name"
              value={newCompetition.name}
              onChange={(e) =>
                setNewCompetition({ ...newCompetition, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Country"
              value={newCompetition.country}
              onChange={(e) =>
                setNewCompetition({
                  ...newCompetition,
                  country: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Logo URL (e.g., /assets/laliga_logo.svg)"
              value={newCompetition.logo}
              onChange={(e) =>
                setNewCompetition({ ...newCompetition, logo: e.target.value })
              }
            />
            <button onClick={handleAddCompetition} className="submit-button">
              Submit
            </button>
          </section>
        )}
      </section>
      <section ref={fixturesRef} className="fixtures section">
        <h2 className="section-title">Fixtures</h2>
        <p className="fixtures-subheading">
          Select the fixture you want predictions for.
        </p>
        {fixtures.length > 0 ? (
          <ul className="fixtures-list">
            {fixtures.map((match, index) => (
              <li key={index} className="fixture-item">
                {match}
              </li>
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
        {searchQuery.trim() !== "" && (
          <ul className="history-list">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team, index) => (
                <li key={index} className="history-item">
                  {team}
                </li>
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
