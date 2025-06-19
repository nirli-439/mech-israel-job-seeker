import React, { useEffect, useState } from 'react';

interface RotatingTextProps {
  texts: string[];
  interval?: number;
  className?: string;
}

const RotatingText: React.FC<RotatingTextProps> = ({
  texts,
  interval = 2500,
  className = '',
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, interval);
    return () => clearInterval(id);
  }, [texts, interval]);

  return (
    <span className={className} key={index}>
      {texts[index]}
    </span>
  );
};

export default RotatingText;
