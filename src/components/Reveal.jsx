import React, { useEffect } from "react";

const Reveal = ({ children }) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("reveal-item"); // Simple placeholder logic
    // In a real React app, we would use a ref. 
    // For this scaffold, we will apply global CSS for scroll reveals.
  }, []);

  return <div className="transition-all duration-1000 ease-out opacity-0 translate-y-10">{children}</div>;
};

export default Reveal;
