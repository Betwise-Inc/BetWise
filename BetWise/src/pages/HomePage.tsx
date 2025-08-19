import type { JSX } from "react";
import { useEffect } from "react";
import "../styles/HomePage.css";
import PredictionPage from "./predictions";
import { useState, useRef } from "react";
import { useUser } from "../Hooks/UserContext";
import LoadingDots from "./loading";
import NavBar from "./Navbar";
import {
  getCompetitions,
  AddCompetition,
  deleteCompetitionById,
  updateCompetitionRound,
} from "../APIconfigs/Competitions";
import { fetchFixtures } from "../APIconfigs/fixtures";
import type { Fixture } from "../APIconfigs/fixtures";

import useAutoLogout from "../Hooks/useAutoLogout";
type Competition = {
  _id: number;
  name: string;
  country: string;
  logo: string;
  round: string;
};

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

const HomePage = (): JSX.Element => {
  useAutoLogout();
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const fixturesRef = useRef<HTMLElement>(null);
  const [selectedLeague, setSelectedLeague] = useState("2");
  const [searchQuery, setSearchQuery] = useState("");
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRoundPopup, setShowRoundPopup] = useState(false);
  const [roundInput, setRoundInput] = useState("");
  const [activeLeague, setActiveLeague] = useState<Competition | null>(null);
  const [apiFixtures, setApiFixtures] = useState<Fixture[]>([]);
  const [loadingFixtures, setLoadingFixtures] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [showPredictionPopup, setShowPredictionPopup] = useState(false);
  // const [isUserLoading, setIsUserLoading] = useState(true);

  const [newCompetition, setNewCompetition] = useState({
    _id: 0,
    name: "",
    country: "",
    logo: "",
    round: "",
  });

  // const [user, setUser] = useState<{
  //   email: string | null;
  //   isAdmin: boolean;
  // } | null>(null);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
  //     if (firebaseUser) {
  //       const email = firebaseUser.email;
  //       if (email) {
  //         try {
  //           const userData = await getUserByEmail(email);
  //           setUser({ email, isAdmin: userData?.isAdmin || false });
  //         } catch {
  //           setUser({ email, isAdmin: false });
  //         }
  //       } else {
  //         setUser({ email: null, isAdmin: false });
  //       }
  //     } else {
  //       setUser(null);
  //     }

  //     setIsUserLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);
  const { user, loading: isUserLoading } = useUser();
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
  useEffect(() => {
    if (competitions.length > 0 && selectedLeague === "2") {
      const fetchInitialFixtures = async () => {
        const selectedComp = competitions.find(
          (comp) => comp._id.toString() === "2"
        );
        if (!selectedComp) return;

        setLoadingFixtures(true);
        try {
          const fetched = await fetchFixtures(
            selectedComp._id,
            selectedComp.round || "1"
          );
          setApiFixtures(fetched);
        } catch {
          setApiFixtures([]);
        } finally {
          setLoadingFixtures(false);
        }
      };

      fetchInitialFixtures();
    }
  }, [competitions, selectedLeague]);

  const filteredTeams = dummyTeams.filter((team) =>
    team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLeagueClick = async (leagueId: string) => {
    setSelectedLeague(leagueId);
    fixturesRef.current?.scrollIntoView({ behavior: "smooth" });

    const selectedComp = competitions.find(
      (comp) => comp._id.toString() === leagueId
    );

    if (!selectedComp) return;

    const round = selectedComp.round || "1";

    setLoadingFixtures(true);
    try {
      const fetched = await fetchFixtures(selectedComp._id, round);
      setApiFixtures(fetched);
    } catch (error) {
      setApiFixtures([]);
    } finally {
      setLoadingFixtures(false);
    }
  };

  const handleAddCompetition = async () => {
    try {
      const { _id, name, country, logo, round } = newCompetition;
      await AddCompetition(_id, name, country, logo, round);

      setShowAddForm(false);
      setNewCompetition({
        _id: 0,
        name: "",
        country: "",
        logo: "",
        round: "",
      });
      const data = await getCompetitions();
      setCompetitions(data);
    } catch (err) {
      console.error("Error adding competition:", err);
    }
  };
  if (isUserLoading)
    return (
      <section className="loading">
        <LoadingDots numDots={10} radius={60} speed={0.8} size={10} />
      </section>
    );
  return (
    <main className="home-page">
      <>
        <NavBar />
        <section className="heading-section">
          <h1 className="title">
            Welcome to <span className="highlight">BetWise</span>
          </h1>
          <p className="subtitle">BETTiNG MADE SiMPLE.</p>
        </section>
        <section className="league-section" id="competitions">
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

                    <section className="league-country">
                      {league.country}
                    </section>
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
                            setActiveLeague(league);
                            setShowRoundPopup(true);
                            setOpenDropdownId(null);
                          }}
                        >
                          Set Round
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
                  setNewCompetition({
                    ...newCompetition,
                    name: e.target.value,
                  })
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
                  setNewCompetition({
                    ...newCompetition,
                    logo: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Round (e.g., 1, 5, QF, R16, SF, F)"
                value={newCompetition.round}
                onChange={(e) =>
                  setNewCompetition({
                    ...newCompetition,
                    round: e.target.value,
                  })
                }
              />
              <button onClick={handleAddCompetition} className="submit-button">
                Submit
              </button>
            </section>
          )}
        </section>
        <section className="fixtures section" id="fixtures">
          <h2 className="section-title">Fixtures</h2>
          {loadingFixtures ? (
            <p>Loading fixtures...</p>
          ) : apiFixtures.length > 0 ? (
            <ul className="fixtures-list">
              {/* {apiFixtures.map((fixture, index) => (
              <li key={index} className="fixture-item">
                <span>{fixture.home_name}</span> vs{" "}
                <span>{fixture.away_name}</span>
              </li>
            ))} */}
              {apiFixtures.map((fixture, index) => (
                <li
                  key={index}
                  className="fixture-item"
                  onClick={() => {
                    setSelectedFixture(fixture);
                    setShowPredictionPopup(true);
                  }}
                >
                  <span>{fixture.home_name}</span> vs{" "}
                  <span>{fixture.away_name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-fixtures">No fixtures available.</p>
          )}
        </section>

        <section className="history section" id="history">
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
      </>
      {showRoundPopup && activeLeague && (
        <section className="modal-overlay">
          <section className="modal">
            <button
              className="close-button"
              onClick={() => setShowRoundPopup(false)}
            >
              ✕
            </button>
            <h3>Set Round for {activeLeague.name}</h3>
            <input
              type="text"
              placeholder="Enter round (e.g. 1, 5, QF, R16, SF, F)"
              value={roundInput}
              onChange={(e) => setRoundInput(e.target.value)}
              className="modal-input"
            />
            <button
              className="modal-submit"
              onClick={async () => {
                if (!activeLeague) return;

                try {
                  await updateCompetitionRound(activeLeague._id, roundInput);
                  setCompetitions((prev) =>
                    prev.map((comp) =>
                      comp._id === activeLeague._id
                        ? { ...comp, round: roundInput }
                        : comp
                    )
                  );
                  setShowRoundPopup(false);
                  setRoundInput("");
                } catch (error) {
                  console.error("Error updating round:", error);
                }
              }}
            >
              Submit
            </button>
          </section>
        </section>
      )}
      {showPredictionPopup && selectedFixture && (
        <PredictionPage
          fixture={selectedFixture}
          onClose={() => {
            setShowPredictionPopup(false);
            setSelectedFixture(null);
          }}
        />
      )}
    </main>
  );
};

export default HomePage;
