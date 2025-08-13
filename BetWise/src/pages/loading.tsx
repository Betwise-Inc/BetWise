import React, { useEffect, useRef } from "react";

interface LoadingDotsProps {
  numDots?: number; // number of dots
  radius?: number;  // distance from center
  speed?: number;   // rotations per second
  size?: number;    // size of dots in px
  backgroundColor?: string; // optional background color for matching text
}

const LoadingDots: React.FC<LoadingDotsProps> = ({
  numDots = 8,
  radius = 40,
  speed = 0.5,
  size = 8,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);

  useEffect(() => {
    let animationId: number;

    const animate = () => {
      const container = containerRef.current;
      if (container) {
        const children = Array.from(container.querySelectorAll(".dot")) as HTMLDivElement[];
        angleRef.current += (speed * Math.PI * 2) / 60; // radians/frame

        children.forEach((dot, index) => {
          const angle = angleRef.current + (index * (Math.PI * 2)) / numDots;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          // Opacity fade effect
          const normalizedAngle = (angle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
          const fadeFactor = (Math.cos(normalizedAngle) + 1) / 2; // range 0 → 1
          const opacity = 0.3 + fadeFactor * 0.7; // range 0.3 → 1

          dot.style.transform = `translate(${x}px, ${y}px)`;
          dot.style.opacity = opacity.toString();
        });
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [numDots, radius, speed]);

  return (
    <section
    className="loading-container"
      ref={containerRef}
      style={{
        position: "relative",
        width: `${radius * 2 + size}px`,
        height: `${radius * 2 + size}px`,
      }}
    >
      <section
        className="loading-text"
        style={{
          position: "absolute",
          top: "55%",
          left: "55%",
          transform: "translate(-50%, -50%)",
          color: "#1C4D78",
          fontWeight: "bold",
          fontSize: "1rem",
          pointerEvents: "none",
        }}
      >
        BetWise
      </section>

      {/* Orbiting dots */}
      {Array.from({ length: numDots }).map((_, i) => (
        <div
          key={i}
          className="dot"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: "#1C4D78",
            borderRadius: "50%",
            transform: "translate(0, 0)",
            opacity: 0.3,
          }}
        />
      ))}
    </section>
  );
};

export default LoadingDots;
