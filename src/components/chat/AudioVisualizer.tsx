
import React, { useEffect, useState } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive }) => {
  const [heights, setHeights] = useState<number[]>([]);
  const barCount = 32;
  
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        const newHeights = Array(barCount).fill(0).map(() => 
          Math.random() * 100
        );
        setHeights(newHeights);
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setHeights(Array(barCount).fill(15));
    }
  }, [isActive, barCount]);
  
  return (
    <div className="w-full h-10 flex items-center justify-center gap-[2px]">
      {heights.map((height, index) => (
        <div
          key={index}
          className={`w-1 rounded-full ${isActive ? 'bg-tehoria-accent' : 'bg-tehoria-muted'}`}
          style={{ 
            height: `${Math.max(4, height)}%`,
            animationDelay: `${index * 0.05}s`
          }}
        ></div>
      ))}
    </div>
  );
};

export default AudioVisualizer;
