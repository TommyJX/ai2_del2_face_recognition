import React, { useState, useRef, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import "../styles/Website.css";

import robotImage from "../images/robot_ai_image.jpg";
import neuralNetworkImage from "../images/neural_network_image-image.jpg.jpeg";
import aiRealTimeImage from "../images/ai_real_time_prediction-image.jpg.jpeg";

const Website = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

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

  return (
    <div>
      {/* Header */}
      <header className="header">
        <h1 className="header-title">AI-POWERED IMAGE PREDICTION SYSTEM</h1>
        <nav className="nav">
          <ScrollLink to="home" smooth={true} className="nav-link">
            Home
          </ScrollLink>
          <div className="dropdown">
            <button onClick={toggleMoreMenu} className="nav-button">
              More {isMoreOpen ? "∨" : "∧"}
            </button>
            <div className={`dropdown-content ${isMoreOpen ? "active" : ""}`}>
              <ScrollLink to="about" smooth={true} className="nav-link">
                About
              </ScrollLink>
              <ScrollLink to="services" smooth={true} className="nav-link">
                Services
              </ScrollLink>
            </div>
          </div>
          <ScrollLink to="contact" smooth={true} className="nav-link">
            Contact
          </ScrollLink>
        </nav>
      </header>

      {/* Section 1: Home */}
      <section
        ref={(el) => (sections.current[0] = el)}
        className="home-section section"
      >
        <div className="overlay"></div>
        <div className="content">
          <h2>AI-Powered Image Prediction System</h2>
          <p>Enhancing User Experience with Real-Time AI Predictions</p>
          <ScrollLink to="services" smooth={true} className="button">
            View Services
          </ScrollLink>
        </div>
      </section>

      {/* Section 2: About */}
      <section
        ref={(el) => (sections.current[1] = el)}
        id="about"
        className="about-section section"
      >
        <div className="about-content">
          <h4 className="pre-title">Innovative Predictions</h4>
          <h2>Unlocking Insights with AI</h2>
          <p>
            Discover the power of our AI-Powered Image Prediction System based
            in Malmö. Our cutting-edge technology harnesses deep learning models
            developed in Python with TensorFlow/Keras to accurately predict
            gender, age, and emotion in real-time.
          </p>
          <ScrollLink
            to="contact"
            smooth={true}
            className="get-in-touch-button"
          >
            Get in touch
          </ScrollLink>
        </div>
        <div className="about-image">
          <img src={robotImage} alt="AI Robot" />
        </div>
      </section>

      {/* Section 3: Services */}
      <section
        ref={(el) => (sections.current[2] = el)}
        id="services"
        className="services-section section"
      >
        <h4 className="pre-title">Our Services</h4>
        <h2>Transforming Industries with AI</h2>
        <div className="cards">
          <div className="card">
            <img
              src={neuralNetworkImage}
              alt="Upload Prediction"
              className="card-image"
            />
            <div className="card-content">
              <h3>Image upload prediction {">"}</h3>
              <p>Accurately predict image using advanced AI technology.</p>
            </div>
          </div>
          <div className="card">
            <img
              src={aiRealTimeImage}
              alt="Real-Time Prediction"
              className="card-image"
            />
            <div className="card-content">
              <h3>Real-Time prediction {">"}</h3>
              <p>
                Predict in real-time with remarkable accuracy through image
                analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Contact */}
      <section
        ref={(el) => (sections.current[3] = el)}
        id="contact"
        className="section"
      >
        <h4 className="pre-title">Get in Touch</h4>
        <h2>Connect with Us for More Info</h2>
        <div className="contact-section">
          <form className="contact-form">
            <input type="text" placeholder="Full-Name" className="input" />
            <input type="email" placeholder="Email" className="input" />
            <input type="tel" placeholder="Phone Number" className="input" />
            <textarea placeholder="Message" className="textarea"></textarea>
            <button type="submit" className="submit-button">
              Submit
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
                <strong>Email:</strong> tommy.wang@nbi.se
              </p>
              <p>
                <strong>Location:</strong> Malmö, SE
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <ScrollLink to="services" smooth={true} className="footer-link">
            Services
          </ScrollLink>
          <RouterLink to="/Survey" className="footer-link">
            {" "}
            Complete Intake
          </RouterLink>
          <ScrollLink to="contact" smooth={true} className="footer-link">
            Contact
          </ScrollLink>
        </div>
        <p>All rights reserved | Tommy Wang</p>
      </footer>
    </div>
  );
};

export default Website;
