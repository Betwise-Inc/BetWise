import { BrowserRouter as Router, Routes,Route} from "react-router-dom";
import LandingPage from "./pages/LangingPage";
import HomePage from "./pages/HomePage";

import './App.css'
import type { JSX } from "react";


function App(): JSX.Element{

  return (
    <Router>
      <Routes>
        <Route path = "/" element={<LandingPage/>} />
        <Route path = "/home" element={<HomePage/>} />

      </Routes>
    </Router>
  )
}

export default App
