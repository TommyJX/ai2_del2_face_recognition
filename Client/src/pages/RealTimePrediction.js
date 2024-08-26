import React, { useState } from "react";
import axios from "axios";
import "../styles/RealTimePrediction.css";

const RealTimePrediction = () => {
  const [realTimeMessage, setRealTimeMessage] = useState("");

  const handleRealTimePrediction = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/predict-realtime"
      );
      setRealTimeMessage(response.data.message);
    } catch (error) {
      alert("Error starting real-time prediction.");
    }
  };

  return (
    <div id="real-time-prediction-page" className="page-container">
      <h2 className="page-title">Real-Time Prediction</h2>
      <div className="real-time-section" id="real-time-section">
        <button
          id="real-time-start-button"
          className="real-time-button"
          onClick={handleRealTimePrediction}
        >
          Start Real-Time Prediction
        </button>
        {realTimeMessage && (
          <div id="real-time-message" className="result">
            <h4>Real-Time Prediction Status:</h4>
            <p>{realTimeMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimePrediction;
