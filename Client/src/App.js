import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Website from "./pages/Website";
import SurveyPage from "./pages/SurveyPage";
import ImageUpload from "./pages/ImageUpload";
import RealTimePrediction from "./pages/RealTimePrediction";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Website />} />
        <Route path="/Survey" element={<SurveyPage />} />
        <Route path="/image-upload" element={<ImageUpload />} />
        <Route path="/real-time-prediction" element={<RealTimePrediction />} />
      </Routes>
    </Router>
  );
};

export default App;
