import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SurveyPage.css";

const SurveyPage = () => {
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state
  const navigate = useNavigate(); // React Router navigation

  const handleBackToHome = () => {
    setIsAnimating(true); // Start the animation
    setTimeout(() => {
      navigate("/"); // Navigate to homepage after animation (e.g., 500ms)
    }, 500); // Adjust the delay to match your animation duration
  };

  const [responses, setResponses] = useState({
    question1: "",
    question2: "",
    question3: "",
  });

  const handleChange = (e) => {
    setResponses({
      ...responses,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you would typically send the responses to a server or process them further
    console.log("Survey Responses:", responses);
    alert("Thank you for your feedback!");
  };

  return (
    <div className={`survey-container ${isAnimating ? "fade-out" : ""}`}>
      <h1>Survey</h1>
      <form onSubmit={handleSubmit}>
        <div className="survey-question">
          <h3>How satisfied are you with our service?</h3>
          <div className="survey-options">
            <label>
              <input
                type="radio"
                name="question1"
                value="Very Satisfied"
                checked={responses.question1 === "Very Satisfied"}
                onChange={handleChange}
              />
              Very Satisfied
            </label>
            <label>
              <input
                type="radio"
                name="question1"
                value="Satisfied"
                checked={responses.question1 === "Satisfied"}
                onChange={handleChange}
              />
              Satisfied
            </label>
            <label>
              <input
                type="radio"
                name="question1"
                value="Neutral"
                checked={responses.question1 === "Neutral"}
                onChange={handleChange}
              />
              Neutral
            </label>
            <label>
              <input
                type="radio"
                name="question1"
                value="Dissatisfied"
                checked={responses.question1 === "Dissatisfied"}
                onChange={handleChange}
              />
              Dissatisfied
            </label>
            <label>
              <input
                type="radio"
                name="question1"
                value="Very Dissatisfied"
                checked={responses.question1 === "Very Dissatisfied"}
                onChange={handleChange}
              />
              Very Dissatisfied
            </label>
          </div>
        </div>

        <div className="survey-question">
          <h3>How likely are you to recommend us to a friend?</h3>
          <div className="survey-options">
            <label>
              <input
                type="radio"
                name="question2"
                value="Very Likely"
                checked={responses.question2 === "Very Likely"}
                onChange={handleChange}
              />
              Very Likely
            </label>
            <label>
              <input
                type="radio"
                name="question2"
                value="Likely"
                checked={responses.question2 === "Likely"}
                onChange={handleChange}
              />
              Likely
            </label>
            <label>
              <input
                type="radio"
                name="question2"
                value="Neutral"
                checked={responses.question2 === "Neutral"}
                onChange={handleChange}
              />
              Neutral
            </label>
            <label>
              <input
                type="radio"
                name="question2"
                value="Unlikely"
                checked={responses.question2 === "Unlikely"}
                onChange={handleChange}
              />
              Unlikely
            </label>
            <label>
              <input
                type="radio"
                name="question2"
                value="Very Unlikely"
                checked={responses.question2 === "Very Unlikely"}
                onChange={handleChange}
              />
              Very Unlikely
            </label>
          </div>
        </div>

        <div className="survey-question">
          <h3>What can we improve?</h3>
          <textarea
            name="question3"
            value={responses.question3}
            onChange={handleChange}
            rows="4"
            placeholder="Your suggestions here..."
          ></textarea>
        </div>

        <button type="submit" className="survey-submit-button">
          Submit
        </button>
      </form>

      <button onClick={handleBackToHome} className="back-to-homepage">
        Back to Homepage
      </button>
    </div>
  );
};

export default SurveyPage;
