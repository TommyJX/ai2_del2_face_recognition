import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Typewriter from "../components/Typewriter.js";
import "../styles/RealTimePrediction.css";

const RealTimePrediction = () => {
  const [isRunning, setIsRunning] = useState(false);
  const videoRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  // Start webcam and prediction
  const startRealTimePrediction = () => {
    setIsRunning(true);
    // Display the video feed and set the source
    videoRef.current.style.display = "block";
    videoRef.current.src = "http://127.0.0.1:5000/predict-realtime";
  };

  // Stop webcam and prediction
  const stopRealTimePrediction = () => {
    setIsRunning(false);
    videoRef.current.src = ""; // Clear the video source to stop streaming
    videoRef.current.style.display = "none"; // Hide the video feed
  };

  return (
    <div
      id="real-time-prediction-page"
      className={`page-container ${isAnimating ? "fade-out" : ""}`}
    >
      <Typewriter
        text="Real-Time Prediction"
        className="page-title"
        variant="h3"
        gutterBottom
      />
      <div className="real-time-section" id="real-time-section">
        <img
          ref={videoRef}
          className="video-feed"
          alt="Real-Time Prediction Feed"
        />
        {!isRunning && (
          <button
            id="real-time-start-button"
            className="real-time-button"
            onClick={startRealTimePrediction}
          >
            Start Real-Time Prediction
          </button>
        )}
        {isRunning && (
          <button
            id="real-time-stop-button"
            className="real-time-button"
            onClick={stopRealTimePrediction}
          >
            Stop Real-Time Prediction
          </button>
        )}
      </div>
      <button onClick={handleBackToHome} className="back-to-homepage">
        Back to Homepage
      </button>
    </div>
  );
};

export default RealTimePrediction;
