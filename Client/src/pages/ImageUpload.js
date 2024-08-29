import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Typewriter from "../components/Typewriter.js";
import "../styles/ImageUpload.css";

const ImageUpload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleBackToHome = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImageFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    }
  };

  const handleUploadPredict = async () => {
    if (!imageFile) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/predict-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPredictionResult(response.data);
      // Add 'show' class to fade in the result
      document.getElementById("prediction-result").classList.add("show");
    } catch (error) {
      alert("Error occurred during prediction.");
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setPredictionResult(null);

    // Remove 'show' class to trigger fade-out effect
    const resultElement = document.getElementById("prediction-result");
    if (resultElement) {
      resultElement.classList.remove("show");
    }
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the input file name
    }
  };

  // Emoji and color mappings based on emotion
  const getEmotionEmoji = (emotion) => {
    switch (emotion) {
      case "Happy":
        return "😊";
      case "Sad":
        return "😢";
      case "Angry":
        return "😡";
      case "Surprised":
        return "😲";
      case "Neutral":
        return "😐";
      default:
        return "😶";
    }
  };

  const getEmotionClass = (emotion) => {
    switch (emotion) {
      case "Happy":
        return "prediction-emotion-happy";
      case "Sad":
        return "prediction-emotion-sad";
      case "Angry":
        return "prediction-emotion-angry";
      case "Surprised":
        return "prediction-emotion-surprised";
      case "Neutral":
        return "prediction-emotion-neutral";
      default:
        return "";
    }
  };

  return (
    <div
      id="image-upload-page"
      className={`page-container ${isAnimating ? "fade-out" : ""}`}
    >
      <Typewriter
        text="Image Upload Prediction"
        className="page-title"
        variant="h3"
        gutterBottom
      />

      <div id="image-upload-section">
        {/* Image Preview */}
        {imagePreview && (
          <img src={imagePreview} alt="Preview" id="image-preview" />
        )}

        {/* Controls Section */}
        <div id="image-upload-controls">
          <input
            type="file"
            id="image-file-input"
            className="image-input"
            ref={fileInputRef} // Attach ref to file input
            onChange={handleFileChange}
          />

          <div className="button-group">
            <button
              id="upload-predict-button"
              className="upload-button"
              onClick={handleUploadPredict}
            >
              Predict
            </button>

            {/* Show Reset Button if an image is selected or prediction is made */}
            {(imagePreview || predictionResult) && (
              <button
                id="reset-button"
                className="reset-button"
                onClick={handleReset}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {predictionResult && (
        <div id="prediction-result" className="result">
          <h4>Prediction Result:</h4>

          {/* Display the age range and confidence */}
          <div id="prediction-age">
            Age: {predictionResult.age_range} <div></div>
            <span className="confidence">
              ({predictionResult.age_confidence})
            </span>
          </div>

          {/* Display gender and confidence */}
          <div
            id="prediction-gender"
            className={
              predictionResult.gender.includes("Male")
                ? "prediction-gender-male"
                : "prediction-gender-female"
            }
          >
            Gender: {predictionResult.gender}
            <div></div>
            <span className="confidence">
              ({predictionResult.gender_confidence})
            </span>
          </div>

          {/* Display emotion and confidence */}
          <div
            id="prediction-emotion"
            className={getEmotionClass(predictionResult.emotion)}
          >
            Emotion: {predictionResult.emotion}{" "}
            <span className="bouncing-emoji">
              {getEmotionEmoji(predictionResult.emotion)}
            </span>{" "}
            <div></div>
            <span className="confidence">
              ({predictionResult.emotion_confidence})
            </span>
          </div>
        </div>
      )}

      <button onClick={handleBackToHome} className="back-to-homepage">
        Back to Homepage
      </button>
    </div>
  );
};

export default ImageUpload;
