import React, { useEffect, useRef } from 'react';

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
  paceInterval = 1000
}) => {
  const horseRef = useRef<HTMLImageElement>(null);
  const positionRef = useRef<number>(0);
  const animationRef = useRef<number>(0);
  const hasFinishedRef = useRef<boolean>(false);

  // Time-tracking Refs
  const currentSpeedRef = useRef<number>(baseSpeed);
  const lastPaceChangeTimeRef = useRef<number>(0);

  // NEW: Advanced Arcade Tracking State
  const arcadeStateRef = useRef({
    isMoving: false,
    startPos: 0,
    targetPos: 0,
    startTime: 0,
    lastCycleTime: 0
  });

  useEffect(() => {
    positionRef.current = 0;
    hasFinishedRef.current = false;
    currentSpeedRef.current = baseSpeed;
    lastPaceChangeTimeRef.current = performance.now();

    // Reset Arcade state
    arcadeStateRef.current = {
      isMoving: false,
      startPos: 0,
      targetPos: 0,
      startTime: 0,
      lastCycleTime: performance.now()
    };

    if (horseRef.current) {
      horseRef.current.style.transform = `translateX(0px)`;
    }
  }, [resetTrigger, baseSpeed]);

  const animate = (timestamp: DOMHighResTimeStamp) => {
    if (hasFinishedRef.current) return;

    // 1. PACING LOGIC
    if (timestamp - lastPaceChangeTimeRef.current > paceInterval) {
      const randomVariance = (Math.random() * volatility * 2) - volatility;
      currentSpeedRef.current = Math.max(0.5, baseSpeed + randomVariance);
      lastPaceChangeTimeRef.current = timestamp;
    }

    // 2. MOVEMENT LOGIC
    let shouldUpdateVisuals = false;

    if (movementStyle === 'smooth') {
      positionRef.current += currentSpeedRef.current;
      shouldUpdateVisuals = true;
    } else {
      // INTERPOLATED ARCADE LOGIC
      const ARCADE_CYCLE_MS = 600; // Time between jumps
      const ARCADE_JUMP_DURATION = 250; // How long the animation takes (leaves 350ms for pausing)
      const state = arcadeStateRef.current;

      // Check if it's time to trigger a new jump
      if (!state.isMoving && (timestamp - state.lastCycleTime > ARCADE_CYCLE_MS)) {
        state.isMoving = true;
        state.startTime = timestamp;
        state.startPos = positionRef.current;

        // Calculate the distance: ~60 frames per second = 16.6ms per frame. 
        // We multiply speed by the frames it *would* have moved during the 600ms cycle
        const framesToCatchUp = ARCADE_CYCLE_MS / 16.66;
        state.targetPos = positionRef.current + (currentSpeedRef.current * framesToCatchUp);
        state.lastCycleTime = timestamp;
      }

      // If we are currently in the middle of a jump, animate it
      if (state.isMoving) {
        // Calculate progress from 0 to 1
        let progress = (timestamp - state.startTime) / ARCADE_JUMP_DURATION;

        if (progress >= 1) {
          progress = 1;
          state.isMoving = false; // Jump finished, start waiting
        }

        // Apply an 'ease-out' math function so it slows down slightly at the end of the jump
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);

        // Calculate the exact pixel position for this specific frame
        positionRef.current = state.startPos + (state.targetPos - state.startPos) * easeOutQuad;
        shouldUpdateVisuals = true;
      }
    }

    // 3. RENDER AND FINISH CHECK
    if (shouldUpdateVisuals) {
      if (positionRef.current >= finishLineDistance) {
        positionRef.current = finishLineDistance;
        hasFinishedRef.current = true;
        if (onFinish) onFinish(id);
      }

      if (horseRef.current) {
        horseRef.current.style.transform = `translateX(${positionRef.current}px)`;
      }
    }

    if (!hasFinishedRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isRunning && !hasFinishedRef.current) {
      const now = performance.now();
      lastPaceChangeTimeRef.current = now;
      arcadeStateRef.current.lastCycleTime = now;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, baseSpeed, volatility, movementStyle, paceInterval]);

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