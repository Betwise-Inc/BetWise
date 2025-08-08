import { BrowserRouter as Router, Routes,Route} from "react-router-dom";
import LandingPage from "./pages/LangingPage";
import HomePage from "./pages/HomePage";
import Auth from "./pages/Auth";
import { UserProvider } from "./Hooks/UserContext"; 
import './App.css'
import type { JSX } from "react";


function App(): JSX.Element{

  return (
    
    <UserProvider>
      <Router>
        <Routes>
          <Route path = "/" element={<LandingPage/>} />
          <Route path = "/Auth" element={<Auth/>} />
          <Route path = "/home" element={<HomePage/>} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
