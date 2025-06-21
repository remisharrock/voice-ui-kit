import React, { useEffect, useState } from "react";

interface ThinkingProps {
  className?: string;
}

const Thinking: React.FC<ThinkingProps> = ({ className = "" }) => {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots % 3) + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const renderDots = () => {
    return ".".repeat(dots);
  };

  return (
    <span className={className} aria-label="Loading">
      {renderDots()}
    </span>
  );
};

export default Thinking;
