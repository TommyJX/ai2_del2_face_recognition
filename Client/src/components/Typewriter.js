import React, { useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Typewriter from "typewriter-effect/dist/core";

const ResponsiveTypography = styled(Typography)(({ theme }) => ({
  fontWeight: "600",
  fontSize: "2rem",
  [theme.breakpoints.down("md")]: {
    fontSize: "1.5rem",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.2rem",
  },
}));

const TypewriterHeader = ({ text }) => {
  const typewriterRef = useRef(null);

  useEffect(() => {
    if (typewriterRef.current) {
      const typewriter = new Typewriter(typewriterRef.current, {
        loop: true,
        delay: 120,
        autoStart: true,
      });

      typewriter.typeString(text).pauseFor(4000).deleteAll().start();
    }
  }, [text]);

  return (
    <ResponsiveTypography variant="h3" gutterBottom>
      <span ref={typewriterRef}></span>
    </ResponsiveTypography>
  );
};

export default TypewriterHeader;
