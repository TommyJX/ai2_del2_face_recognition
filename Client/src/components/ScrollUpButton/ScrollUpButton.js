import React, { useState, useEffect } from "react";
import { Fab } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const ScrollButton = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(12),
  right: theme.spacing(4),
  zIndex: 1000,
  color: "#FFFF00",
  background: "#a7c957",
  opacity: 0,
  visibility: "hidden",
  transition: "opacity 0.4s ease-in-out, visibility 0.4s ease-in-out",
  "&.visible": {
    opacity: 1,
    visibility: "visible",
    background: "#a7c957",
  },
}));

const ScrollUpButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > window.innerHeight * 0.3) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  // Easing function for smooth scroll
  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const scrollToTop = () => {
    const startPosition = window.pageYOffset;
    const duration = 800;
    const startTime = performance.now();

    const scrollStep = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeInOutQuad(progress);
      window.scrollTo(0, startPosition * (1 - easedProgress));

      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      }
    };

    requestAnimationFrame(scrollStep);
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <ScrollButton
      onClick={scrollToTop}
      className={visible ? "visible" : ""}
      color="primary"
      aria-label="scroll back to top"
    >
      <KeyboardArrowUp />
    </ScrollButton>
  );
};

export default ScrollUpButton;
