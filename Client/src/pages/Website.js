import React, { useState, useRef, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import "../styles/Website.css";

import robotImage from "../images/robot_ai_image.jpg";
import neuralNetworkImage from "../images/neural_network_image-image.jpg.jpeg";
import aiRealTimeImage from "../images/ai_real_time_prediction-image.jpg.jpeg";

// Translations object
const translations = {
  en: {
    title: "AI-Powered Image Prediction System",
    home: "Home",
    about: "About",
    services: "Services",
    contact: "Contact",
    getInTouch: "Get in Touch",
    connectWithUs: "Connect with Us for More Info",
    submit: "Submit",
    email: "Email",
    location: "Location",
    fullName: "Full-Name",
    phoneNumber: "Phone Number",
    message: "Message",
    imageUploadPrediction: "Image upload prediction",
    realTimePrediction: "Real-Time prediction",
    aboutText:
      "Discover the power of our AI-Powered Image Prediction System basedin Malmö. Our cutting-edge technology harnesses deep learning models developed in Python with TensorFlow/Keras to accurately predict gender, age, and emotion in real-time.",
    imageUploadDescription:
      "Accurately predict image using advanced AI technology.",
    realTimeDescription:
      "Predict in real-time with remarkable accuracy through image analysis.",
  },
  se: {
    title: "AI-drivet bildförutsägelsessystem",
    home: "Hem",
    about: "Om oss",
    services: "Tjänster",
    contact: "Kontakt",
    getInTouch: "Kontakta oss",
    connectWithUs: "Kontakta oss för mer information",
    submit: "Skicka",
    email: "E-post",
    location: "Plats",
    fullName: "Fullständigt namn",
    phoneNumber: "Telefonnummer",
    message: "Meddelande",
    imageUploadPrediction: "Bilduppladdningsförutsägelse",
    realTimePrediction: "Förutsägelse i realtid",
    aboutText:
      "Upptäck kraften i vårt AI-drivna bildförutsägelsessystem baserat i Malmö. Vår banbrytande teknologi använder deep learning-modeller utvecklade i Python med TensorFlow/Keras för att exakt förutsäga kön, ålder och känslor i realtid.",
    imageUploadDescription: "Förutsäg bild noggrant med avancerad AI-teknik.",
    realTimeDescription:
      "Förutsäg i realtid med anmärkningsvärd noggrannhet genom bildanalys.",
  },
};

const Website = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [hovered, setHovered] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const sections = useRef([]);

  useEffect(() => {
    const currentSections = sections.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          } else {
            entry.target.classList.remove("in-view");
          }
        });
      },
      { threshold: 0.1 }
    );

    currentSections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      currentSections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const toggleMoreMenu = () => {
    setIsMoreOpen(!isMoreOpen);
  };

  const handleLanguageChange = () => {
    setLanguage((prevLang) => (prevLang === "se" ? "en" : "se"));
  };

  const t = translations[language]; // Access the correct translation object

  const toggleCard = (card) => {
    setExpandedCard(expandedCard === card ? null : card);
  };

  return (
    <div>
      <header className="header">
        <h1 className="header-title">{t.title}</h1>
        <nav className="nav">
          <ScrollLink to="home" smooth={true} className="nav-link">
            {t.home}
          </ScrollLink>
          <div className="dropdown">
            <button onClick={toggleMoreMenu} className="nav-button">
              More {isMoreOpen ? "∨" : "∧"}
            </button>
            <div className={`dropdown-content ${isMoreOpen ? "active" : ""}`}>
              <ScrollLink to="about" smooth={true} className="nav-link">
                {t.about}
              </ScrollLink>
              <ScrollLink to="services" smooth={true} className="nav-link">
                {t.services}
              </ScrollLink>
            </div>
          </div>
          <ScrollLink to="contact" smooth={true} className="nav-link">
            {t.contact}
          </ScrollLink>
        </nav>

        {/* Language Switcher */}
        <button
          className="language-switcher"
          onClick={handleLanguageChange}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hovered ? (language === "en" ? "SE" : "EN") : language.toUpperCase()}
        </button>
      </header>

      {/* Home Section */}
      <section
        ref={(el) => (sections.current[0] = el)}
        className="home-section section"
      >
        <div className="overlay"></div>
        <div className="content">
          <h2>{t.title}</h2>
          <p>{t.connectWithUs}</p>
          <ScrollLink to="services" smooth={true} className="button">
            {t.services}
          </ScrollLink>
        </div>
      </section>

      {/* About Section */}
      <section
        ref={(el) => (sections.current[1] = el)}
        id="about"
        className="about-section section"
      >
        <div className="about-content">
          <h4 className="pre-title">{t.getInTouch}</h4>
          <h2>{t.connectWithUs}</h2>
          <p>{t.aboutText}</p>
          <ScrollLink
            to="contact"
            smooth={true}
            className="get-in-touch-button"
          >
            {t.getInTouch}
          </ScrollLink>
        </div>
        <div className="about-image">
          <img src={robotImage} alt="AI Robot" />
        </div>
      </section>

      {/* Services Section */}
      <section
        ref={(el) => (sections.current[2] = el)}
        id="services"
        className="services-section section"
      >
        <h4 className="pre-title">{t.services}</h4>
        <h2>Transforming Industries with AI</h2>
        <div className="cards">
          {/* Image Upload Prediction Card */}
          <div
            className={`card ${
              expandedCard === "imageUpload" ? "expanded" : ""
            }`}
            onClick={() => toggleCard("imageUpload")}
          >
            <img
              src={neuralNetworkImage}
              alt={t.imageUploadPrediction}
              className="card-image"
            />
            <div className="card-content">
              <RouterLink to="/image-upload" className="card-title-link">
                <h3>{t.imageUploadPrediction}</h3>
              </RouterLink>
              <p>{t.imageUploadDescription}</p>
            </div>
          </div>

          {/* Real-Time Prediction Card */}
          <div
            className={`card ${expandedCard === "realTime" ? "expanded" : ""}`}
            onClick={() => toggleCard("realTime")}
          >
            <img
              src={aiRealTimeImage}
              alt={t.realTimePrediction}
              className="card-image"
            />
            <div className="card-content">
              <RouterLink
                to="/real-time-prediction"
                className="card-title-link"
              >
                <h3>{t.realTimePrediction}</h3>
              </RouterLink>
              <p>{t.realTimeDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        ref={(el) => (sections.current[3] = el)}
        id="contact"
        className="section"
      >
        <h4 className="pre-title">{t.getInTouch}</h4>
        <h2>{t.connectWithUs}</h2>
        <div className="contact-section">
          <form className="contact-form">
            <input type="text" placeholder={t.fullName} className="input" />
            <input type="email" placeholder={t.email} className="input" />
            <input type="tel" placeholder={t.phoneNumber} className="input" />
            <textarea placeholder={t.message} className="textarea"></textarea>
            <button type="submit" className="submit-button">
              {t.submit}
            </button>
          </form>
          <div className="contact-info">
            <iframe
              src="https://www.google.com/maps?q=Propellergatan%201,%20Malmö&output=embed"
              className="map"
              title="Map"
            ></iframe>
            <div>
              <p>
                <strong>{t.email}:</strong> tommy.wang@nbi.se
              </p>
              <p>
                <strong>{t.location}:</strong> Malmö, SE
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <ScrollLink to="services" smooth={true} className="footer-link">
            {t.services}
          </ScrollLink>
          <RouterLink to="/Survey" className="footer-link">
            Complete Intake
          </RouterLink>
          <ScrollLink to="contact" smooth={true} className="footer-link">
            {t.contact}
          </ScrollLink>
        </div>
        <p>All rights reserved | Tommy Wang</p>
      </footer>
    </div>
  );
};

export default Website;
