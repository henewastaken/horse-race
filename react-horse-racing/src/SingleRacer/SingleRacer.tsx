import React, { useEffect, useRef } from 'react';
import './SingleRacer.css';

export interface SingleRacerProps {
  id: string | number;
  src: string;
  baseSpeed?: number;
  volatility?: number;
  isRunning?: boolean;
  finishLineDistance: number;
  onFinish?: (id: string | number) => void;
  resetTrigger: number;
  movementStyle?: 'smooth' | 'arcade';
  paceInterval?: number;
  animationStyle?: 'straight' | 'gallop'; // NEW
}

const SingleRacer: React.FC<SingleRacerProps> = ({
  id,
  src,
  baseSpeed = 2,
  volatility = 1,
  isRunning = false,
  finishLineDistance,
  onFinish,
  resetTrigger,
  movementStyle = 'smooth',
  paceInterval = 1000,
  animationStyle = 'straight' // NEW
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null); // NEW: Controls the wiggle class
  const positionRef = useRef<number>(0);
  const animationRef = useRef<number>(0);
  const hasFinishedRef = useRef<boolean>(false);

  const currentSpeedRef = useRef<number>(baseSpeed);
  const lastPaceChangeTimeRef = useRef<number>(0);

  const arcadeStateRef = useRef({
    isMoving: false,
    startPos: 0,
    targetPos: 0,
    startTime: 0,
    lastCycleTime: 0
  });

  const shouldGallop = animationStyle === 'gallop' || movementStyle === 'arcade';

  useEffect(() => {
    positionRef.current = 0;
    hasFinishedRef.current = false;
    currentSpeedRef.current = baseSpeed;
    lastPaceChangeTimeRef.current = performance.now();

    arcadeStateRef.current = {
      isMoving: false, startPos: 0, targetPos: 0, startTime: 0,
      lastCycleTime: performance.now()
    };

    if (wrapperRef.current) wrapperRef.current.style.transform = `translateX(0px)`;
    if (imageRef.current) imageRef.current.classList.remove('galloping');
  }, [resetTrigger, baseSpeed]);

  const animate = (timestamp: DOMHighResTimeStamp) => {
    if (hasFinishedRef.current) return;

    if (timestamp - lastPaceChangeTimeRef.current > paceInterval) {
      const randomVariance = (Math.random() * volatility * 2) - volatility;
      currentSpeedRef.current = Math.max(0.5, baseSpeed + randomVariance);
      lastPaceChangeTimeRef.current = timestamp;
    }

    let shouldUpdateVisuals = false;

    if (movementStyle === 'smooth') {
      positionRef.current += currentSpeedRef.current;
      shouldUpdateVisuals = true;
    } else {
      const ARCADE_CYCLE_MS = 600;
      const ARCADE_JUMP_DURATION = 250;
      const state = arcadeStateRef.current;

      if (!state.isMoving && (timestamp - state.lastCycleTime > ARCADE_CYCLE_MS)) {
        state.isMoving = true;
        state.startTime = timestamp;
        state.startPos = positionRef.current;
        const framesToCatchUp = ARCADE_CYCLE_MS / 16.66;
        state.targetPos = positionRef.current + (currentSpeedRef.current * framesToCatchUp);
        state.lastCycleTime = timestamp;
      }

      if (state.isMoving) {
        let progress = (timestamp - state.startTime) / ARCADE_JUMP_DURATION;
        if (progress >= 1) {
          progress = 1;
          state.isMoving = false;
        }
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        positionRef.current = state.startPos + (state.targetPos - state.startPos) * easeOutQuad;
        shouldUpdateVisuals = true;
      }
    }

    if (shouldUpdateVisuals) {
      if (positionRef.current >= finishLineDistance) {
        positionRef.current = finishLineDistance;
        hasFinishedRef.current = true;

        // Stop the wiggle immediately when crossing the line
        if (imageRef.current) imageRef.current.classList.remove('galloping');
        if (onFinish) onFinish(id);
      }

      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translateX(${positionRef.current}px)`;
      }
    }

    if (!hasFinishedRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Manage the galloping class based on run state
  useEffect(() => {
    if (isRunning && !hasFinishedRef.current) {
      if (shouldGallop && imageRef.current) {
        imageRef.current.classList.add('galloping');
      }
      const now = performance.now();
      lastPaceChangeTimeRef.current = now;
      arcadeStateRef.current.lastCycleTime = now;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (imageRef.current) imageRef.current.classList.remove('galloping');
      cancelAnimationFrame(animationRef.current);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, baseSpeed, volatility, movementStyle, paceInterval, shouldGallop]);

  return (
    <div className="racer-lane">
      <div ref={wrapperRef} className="racer-wrapper">
        <img
          ref={imageRef}
          className="racer-image"
          src={src}
          alt="Racer"
        />
      </div>
    </div>
  );
};

export default SingleRacer;