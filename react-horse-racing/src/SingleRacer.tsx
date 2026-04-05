import React, { useEffect, useRef } from 'react';

export interface SingleRacerProps {
  id: string | number;
  src: string;
  baseSpeed?: number;
  volatility?: number;
  isRunning?: boolean;
  finishLineDistance: number;
  onFinish?: (id: string | number) => void;
  resetTrigger: number; // NEW: Watches for reset commands
}

const SingleRacer: React.FC<SingleRacerProps> = ({
  id,
  src,
  baseSpeed = 2,
  volatility = 1,
  isRunning = false,
  finishLineDistance,
  onFinish,
  resetTrigger
}) => {
  const horseRef = useRef<HTMLImageElement>(null);
  const positionRef = useRef<number>(0);
  const animationRef = useRef<number>(0);
  const hasFinishedRef = useRef<boolean>(false);

  // NEW: The Soft Reset Listener
  useEffect(() => {
    // When the parent changes the trigger, reset all internal refs to 0
    positionRef.current = 0;
    hasFinishedRef.current = false;

    // Instantly snap the DOM element back to the start
    if (horseRef.current) {
      horseRef.current.style.transform = `translateX(0px)`;
    }
  }, [resetTrigger]);

  const animate = () => {
    if (hasFinishedRef.current) return;

    const randomBoost = (Math.random() * volatility);
    positionRef.current += baseSpeed + randomBoost;

    if (positionRef.current >= finishLineDistance) {
      positionRef.current = finishLineDistance;

      if (horseRef.current) {
        horseRef.current.style.transform = `translateX(${positionRef.current}px)`;
      }

      hasFinishedRef.current = true;
      if (onFinish) onFinish(id);
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