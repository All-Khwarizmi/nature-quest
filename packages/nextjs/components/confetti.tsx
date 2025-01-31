import React from "react";
import ReactConfetti from "react-confetti";

interface ConfettiProps {
  duration?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ duration = 5000 }) => {
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsActive(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!isActive) return null;

  return (
    <ReactConfetti
      colors={["#90EE90", "#2C5530", "#8B4513", "#FFD700"]} // Nature-themed colors
      confettiSource={{ x: 0, y: 0, w: window.innerWidth, h: 0 }}
    />
  );
};
