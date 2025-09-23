import type { JSX } from "react";
import { useEffect } from "react";
import "../styles/HomePage.css";
import PredictionPage from "./predictions";
import { useState, useRef } from "react";
import { useUser } from "../Hooks/UserContext";
import Footer from "./Footer";
import NavBar from "./Navbar";
import LoadingDots from "./loading";
import "../styles/InsightsPage.css";
import {
  getCompetitions,
  AddCompetition,
  deleteCompetitionById,
  updateCompetitionRound,
} from "../APIconfigs/Competitions";
import { fetchFixtures } from "../APIconfigs/fixtures";
import type { Fixture } from "../APIconfigs/fixtures";

type Competition = {
  _id: number;
  name: string;
  country: string;
  logo: string;
  round: string;
};

const InsightsPage = (): JSX.Element => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const fixturesRef = useRef<HTMLElement>(null);
  
  // Loading States
  const [loadingCompetitions, setLoadingCompetitions] = useState(true);
  const [loadingFixtures, setLoadingFixtures] = useState(false);
  const [competitionsError, setCompetitionsError] = useState<string | null>(null);
  const [fixturesError, setFixturesError] = useState<string | null>(null);
  
  // Data States
  const [selectedLeague, setSelectedLeague] = useState("2");
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [apiFixtures, setApiFixtures] = useState<Fixture[]>([]);
  
  // Modal States
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRoundPopup, setShowRoundPopup] = useState(false);
  const [showPredictionPopup, setShowPredictionPopup] = useState(false);
  const [addingCompetition, setAddingCompetition] = useState(false);
  const [updatingRound, setUpdatingRound] = useState(false);
  
  // Form States
  const [roundInput, setRoundInput] = useState("");
  const [activeLeague, setActiveLeague] = useState<Competition | null>(null);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [newCompetition, setNewCompetition] = useState({
    _id: 0,
    name: "",
    country: "",
    logo: "",
    round: "",
  });

  const { user, loading: isUserLoading } = useUser();

  // Load competitions on mount
  useEffect(() => {
    const fetchCompetitions = async () => {
      setLoadingCompetitions(true);
      setCompetitionsError(null);
      
      try {
        const data = await getCompetitions();
        setCompetitions(data);
      } catch (error) {
        console.error("Error fetching competitions:", error);
        setCompetitionsError("Failed to load competitions. Please try again.");
      } finally {
        setLoadingCompetitions(false);
      }
    };

    fetchCompetitions();
  }, []);

  // Load initial fixtures when competitions are loaded
  useEffect(() => {
    if (competitions.length > 0 && selectedLeague === "2") {
      const fetchInitialFixtures = async () => {
        const selectedComp = competitions.find(
          (comp) => comp._id.toString() === "2"
        );
        if (!selectedComp) return;

        setLoadingFixtures(true);
        setFixturesError(null);
        
        try {
          const fetched = await fetchFixtures(
            selectedComp._id,
            selectedComp.round || "1"
          );
          setApiFixtures(fetched);
        } catch (error) {
          console.error("Error fetching fixtures:", error);
          setApiFixtures([]);
          setFixturesError("Failed to load fixtures for this league.");
        } finally {
          setLoadingFixtures(false);
        }
      };

      fetchInitialFixtures();
    }
  }, [competitions, selectedLeague]);

  const handleLeagueClick = async (leagueId: string) => {
    setSelectedLeague(leagueId);
    fixturesRef.current?.scrollIntoView({ behavior: "smooth" });

    const selectedComp = competitions.find(
      (comp) => comp._id.toString() === leagueId
    );

    if (!selectedComp) return;

    const round = selectedComp.round || "1";

    setLoadingFixtures(true);
    setFixturesError(null);
    setApiFixtures([]); // Clear previous fixtures immediately
    
    try {
      const fetched = await fetchFixtures(selectedComp._id, round);
      setApiFixtures(fetched);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      setApiFixtures([]);
      setFixturesError("Failed to load fixtures for this league.");
    } finally {
      setLoadingFixtures(false);
    }
  };

  const handleAddCompetition = async () => {
    if (!newCompetition._id || !newCompetition.name || !newCompetition.country) {
      alert("Please fill in all required fields (ID, Name, Country)");
      return;
    }

    setAddingCompetition(true);
    
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
      
      // Refresh competitions
      const data = await getCompetitions();
      setCompetitions(data);
    } catch (err) {
      console.error("Error adding competition:", err);
      alert("Failed to add competition. Please try again.");
    } finally {
      setAddingCompetition(false);
    }
  };

  const handleDeleteCompetition = async (league: Competition) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${league.name}?`
    );
    
    if (!confirmDelete) {
      setOpenDropdownId(null);
      return;
    }

    try {
      await deleteCompetitionById(league._id);
      setOpenDropdownId(null);

      // Refresh competitions
      const data = await getCompetitions();
      setCompetitions(data);

      // Clear selection if deleted league was selected
      if (selectedLeague === league._id.toString()) {
        setSelectedLeague("");
        setApiFixtures([]);
      }
    } catch (error) {
      console.error("Error deleting competition:", error);
      alert("Failed to delete competition. Please try again.");
      setOpenDropdownId(null);
    }
  };

  const handleUpdateRound = async () => {
    if (!activeLeague || !roundInput.trim()) {
      alert("Please enter a valid round");
      return;
    }

    setUpdatingRound(true);
    
    try {
      await updateCompetitionRound(activeLeague._id, roundInput);
      
      // Update local state
      setCompetitions((prev) =>
        prev.map((comp) =>
          comp._id === activeLeague._id
            ? { ...comp, round: roundInput }
            : comp
        )
      );
      
      setShowRoundPopup(false);
      setRoundInput("");
      
      // Refresh fixtures if this is the selected league
      if (selectedLeague === activeLeague._id.toString()) {
        handleLeagueClick(selectedLeague);
      }
    } catch (error) {
      console.error("Error updating round:", error);
      alert("Failed to update round. Please try again.");
    } finally {
      setUpdatingRound(false);
    }
  };

  // Show loading spinner while user data is loading
  if (isUserLoading) {
    return (
      <section className="loading">
        <LoadingDots numDots={10} radius={60} speed={0.8} size={10} />
      </section>
    );
  }

  return (
    <main className="home-page">
      <>
        <NavBar navLinks={[]} />
        <section className="heading-section">
          <h1 className="title">
            Welcome to <span className="highlight">BetWise</span>
          </h1>
          <p className="subtitle">BETTING MADE SIMPLE.</p>
        </section>

        <section className="league-section" id="competitions">
          <h2 className="section-title">Select Your League</h2>
          
          {/* Loading competitions */}
          {loadingCompetitions && (
            <div className="loading-container">
              <LoadingDots numDots={5} radius={30} speed={0.6} size={8} />
              <p>Loading competitions...</p>
            </div>
          )}

          {/* Error loading competitions */}
          {competitionsError && (
            <div className="error-container">
              <p className="error-message">{competitionsError}</p>
              <button 
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {/* Competitions list */}
          {!loadingCompetitions && !competitionsError && (
            <>
              {competitions.length > 0 ? (
                <section className="league-buttons">
                  {competitions.map((league) => (
                    <section className="league-wrapper" key={league._id.toString()}>
                      <button
                        onClick={() => handleLeagueClick(league._id.toString())}
                        className={`league-button ${
                          selectedLeague === league._id.toString() ? "selected" : ""
                        }`}
                        disabled={loadingFixtures}
                      >
                        <section className="league-logo">
                          <img
                            src={league.logo}
                            alt={`${league.name} logo`}
                            width={20}
                            height={20}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
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
                                onClick={() => handleDeleteCompetition(league)}
                              >
                                Delete
                              </li>
                              <li
                                className="dropdown-item"
                                onClick={() => {
                                  setActiveLeague(league);
                                  setRoundInput(league.round || "");
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
              ) : (
                <div className="no-data-container">
                  <p>No competitions available.</p>
                  {user?.isAdmin && (
                    <p>Add your first competition using the button below.</p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Add competition section */}
          {user?.isAdmin && !loadingCompetitions && (
            <section className="add-competition-container">
              <button
                className="add-competition-button"
                onClick={() => setShowAddForm(!showAddForm)}
                disabled={addingCompetition}
              >
                {showAddForm ? "Cancel" : "+ Add Competition"}
              </button>
            </section>
          )}

          {/* Add competition form */}
          {showAddForm && (
            <section className="add-competition-form">
              <input
                type="number"
                placeholder="ID *"
                value={newCompetition._id || ""}
                onChange={(e) =>
                  setNewCompetition({
                    ...newCompetition,
                    _id: Number(e.target.value) || 0,
                  })
                }
                disabled={addingCompetition}
              />
              <input
                type="text"
                placeholder="League Name *"
                value={newCompetition.name}
                onChange={(e) =>
                  setNewCompetition({
                    ...newCompetition,
                    name: e.target.value,
                  })
                }
                disabled={addingCompetition}
              />
              <input
                type="text"
                placeholder="Country *"
                value={newCompetition.country}
                onChange={(e) =>
                  setNewCompetition({
                    ...newCompetition,
                    country: e.target.value,
                  })
                }
                disabled={addingCompetition}
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
                disabled={addingCompetition}
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
                disabled={addingCompetition}
              />
              <button 
                onClick={handleAddCompetition} 
                className="submit-button"
                disabled={addingCompetition}
              >
                {addingCompetition ? (
                  <>
                    <LoadingDots numDots={3} radius={10} speed={0.8} size={4} />
                    Adding...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </section>
          )}
        </section>

        {/* Fixtures Section */}
        <section className="fixtures section" id="fixtures" ref={fixturesRef}>
          <h2 className="section-title">Fixtures</h2>
          
          {/* Loading fixtures */}
          {loadingFixtures && (
            <div className="loading-container">
              <LoadingDots numDots={5} radius={30} speed={0.6} size={8} />
              <p>Loading fixtures...</p>
            </div>
          )}

          {/* Error loading fixtures */}
          {fixturesError && !loadingFixtures && (
            <div className="error-container">
              <p className="error-message">{fixturesError}</p>
              <button 
                className="retry-button"
                onClick={() => selectedLeague && handleLeagueClick(selectedLeague)}
              >
                Retry
              </button>
            </div>
          )}

          {/* Fixtures list */}
          {!loadingFixtures && !fixturesError && (
            <>
              {selectedLeague ? (
                apiFixtures.length > 0 ? (
                  <ul className="fixtures-list">
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
                  <p className="no-fixtures">
                    No fixtures available for the selected league.
                  </p>
                )
              ) : (
                <p className="no-fixtures">
                  Please select a league to view fixtures.
                </p>
              )}
            </>
          )}
        </section>

        <section>
          <Footer />
        </section>
      </>

      {/* Round Update Modal */}
      {showRoundPopup && activeLeague && (
        <section className="modal-overlay">
          <section className="modal">
            <button
              className="close-button"
              onClick={() => {
                setShowRoundPopup(false);
                setRoundInput("");
              }}
              disabled={updatingRound}
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
              disabled={updatingRound}
            />
            <button
              className="modal-submit"
              onClick={handleUpdateRound}
              disabled={updatingRound || !roundInput.trim()}
            >
              {updatingRound ? (
                <>
                  <LoadingDots numDots={3} radius={10} speed={0.8} size={4} />
                  Updating...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </section>
        </section>
      )}

      {/* Prediction Modal */}
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

export default InsightsPage;