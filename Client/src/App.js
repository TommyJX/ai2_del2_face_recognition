import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Website from "./pages/Website";
import SurveyPage from "./pages/SurveyPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Website />} />
        <Route path="/Survey" element={<SurveyPage />} />
      </Routes>
    </Router>
  );
};

export default App;
