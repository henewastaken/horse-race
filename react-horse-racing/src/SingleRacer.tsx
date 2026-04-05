import React, { useEffect, useRef } from 'react';

export interface SingleRacerProps {
  id: string | number;
  src: string;
  baseSpeed?: number;
  volatility?: number;
  isRunning?: boolean;
  finishLineDistance: number; // How far to run (in pixels)
  onFinish?: (id: string | number) => void; // Callback when crossing the line
}

const SingleRacer: React.FC<SingleRacerProps> = ({
  id,
  src,
  baseSpeed = 2,
  volatility = 1,
  isRunning = false,
  finishLineDistance,
  onFinish
}) => {
  const horseRef = useRef<HTMLImageElement>(null);
  const positionRef = useRef<number>(0);
  const animationRef = useRef<number>(0);

  // Track if this specific horse has finished so we don't fire the callback 60 times a second!
  const hasFinishedRef = useRef<boolean>(false);

  const animate = () => {
    // Stop animating if already finished
    if (hasFinishedRef.current) return;

    const randomBoost = (Math.random() * volatility);
    positionRef.current += baseSpeed + randomBoost;

    // Check if we crossed the finish line
    if (positionRef.current >= finishLineDistance) {
      positionRef.current = finishLineDistance; // Snap exactly to the line

      if (horseRef.current) {
        horseRef.current.style.transform = `translateX(${positionRef.current}px)`;
      }

      hasFinishedRef.current = true;
      if (onFinish) {
        onFinish(id); // Tell the parent we finished!
      }
      return;
    }

    if (horseRef.current) {
      horseRef.current.style.transform = `translateX(${positionRef.current}px)`;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isRunning && !hasFinishedRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, baseSpeed, volatility]);

  return (
    <div style={{ width: '100%', borderBottom: '2px dashed #ccc', padding: '10px 0', position: 'relative' }}>
      <img
        ref={horseRef}
        src={src}
        alt="Racer"
        style={{
          width: '50px',
          height: '50px',
          willChange: 'transform'
        }}
      />
    </div>
  );
};

export default SingleRacer;