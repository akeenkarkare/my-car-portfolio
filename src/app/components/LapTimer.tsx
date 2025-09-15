'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh } from 'three';

interface LapTimerProps {
  carRef: React.MutableRefObject<Mesh | null>;
  onTimerUpdate: (data: TimerData) => void;
}

export interface TimerData {
  currentTime: number;
  bestTime: number | null;
  isOnTrack: boolean;
  lapCount: number;
  nextCheckpoint?: string;
  checkpointProgress?: string;
}

interface TimerUIProps {
  timerData: TimerData;
}

export const TimerUI: React.FC<TimerUIProps> = ({ timerData }) => {
  const { currentTime, bestTime, isOnTrack, lapCount } = timerData;
  
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: isOnTrack ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        fontFamily: 'monospace',
        fontSize: '18px',
        minWidth: '250px',
        textAlign: 'center',
        border: isOnTrack ? '2px solid #4CAF50' : '2px solid #ff4444',
        transition: 'all 0.3s ease',
        zIndex: 1000,
      }}
    >
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
        {formatTime(currentTime)}
      </div>
      
      {!isOnTrack && (
        <div style={{ color: '#ff4444', fontSize: '14px', marginBottom: '10px' }}>
          ⚠️ OFF TRACK - Timer Reset!
        </div>
      )}
      
      {bestTime && (
        <div style={{ fontSize: '14px', color: '#4CAF50' }}>
          🏆 Best: {formatTime(bestTime)}
        </div>
      )}
      
      <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.8 }}>
        Lap {lapCount}
      </div>
      
      {timerData.checkpointProgress && (
        <div style={{ fontSize: '12px', marginTop: '5px', color: '#FFD700' }}>
          {timerData.checkpointProgress}
        </div>
      )}
    </div>
  );
};

const LapTimer: React.FC<LapTimerProps> = ({ carRef, onTimerUpdate }) => {
  const startTimeRef = useRef<number>(Date.now());
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [isOnTrack, setIsOnTrack] = useState<boolean>(true);
  const [lapCount, setLapCount] = useState<number>(1);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const checkpointsPassed = useRef<Set<number>>(new Set());
  const lastUpdateRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const offTrackFrames = useRef<number>(0);
  const lastLapTime = useRef<number>(0);
  const hasLeftStart = useRef<boolean>(false);
  
  // Define checkpoints that follow the actual track path
  const trackCheckpoints = useRef([
    { pos: new Vector3(-25, 0, 5), radius: 12, isStart: true }, // Start/Finish (spawn)
    { pos: new Vector3(-5, 0, -5), radius: 12 },
    { pos: new Vector3(0, 0, -30), radius: 12 },
    { pos: new Vector3(20, 0, -10), radius: 12 },
    { pos: new Vector3(20, 0, 0), radius: 12 },
    { pos: new Vector3(15, 0, 10), radius: 12 },
    { pos: new Vector3(5, 0, 20), radius: 12 },
    { pos: new Vector3(-5, 0, 35), radius: 15 },
    { pos: new Vector3(-20, 0, 5), radius: 12 },
  ]);

  // Balanced track checking
  const isCarOnTrack = useCallback((carPos: Vector3): boolean => {
    // Check Y boundaries (reasonable limits)
    if (carPos.y < -0.5 || carPos.y > 6) return false;
    
    // Check if within outer track boundaries
    if (Math.abs(carPos.x) > 45 || Math.abs(carPos.z) > 45) return false;
    
    // Check proximity to track checkpoints (this defines the actual track)
    let nearTrack = false;
    for (let i = 0; i < trackCheckpoints.current.length; i++) {
      const checkpoint = trackCheckpoints.current[i];
      const dx = carPos.x - checkpoint.pos.x;
      const dz = carPos.z - checkpoint.pos.z;
      const distSq = dx * dx + dz * dz;
      // Use a reasonable radius for track detection
      const radiusCheck = (checkpoint.radius + 5) * (checkpoint.radius + 5);
      if (distSq < radiusCheck) {
        nearTrack = true;
        break;
      }
    }
    
    return nearTrack;
  }, []);

  // Load best time from localStorage
  useEffect(() => {
    const savedBest = localStorage.getItem('carRaceBestTime');
    if (savedBest) {
      setBestTime(parseFloat(savedBest));
    }
  }, []);

  // Update timer - only when timer has started
  useEffect(() => {
    if (!isOnTrack || !timerStarted) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now() - startTimeRef.current);
    }, 100);

    return () => clearInterval(interval);
  }, [isOnTrack, timerStarted]);

  // Throttled update to parent
  useEffect(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current > 100) {
      onTimerUpdate({
        currentTime,
        bestTime,
        isOnTrack,
        lapCount
      });
      lastUpdateRef.current = now;
    }
  }, [currentTime, bestTime, isOnTrack, lapCount, onTimerUpdate]);

  useFrame(() => {
    if (!carRef.current) return;
    
    // Only check every 5th frame for performance
    frameCountRef.current++;
    if (frameCountRef.current % 5 !== 0) return;

    const carPos = new Vector3();
    carRef.current.getWorldPosition(carPos);

    const onTrack = isCarOnTrack(carPos);
    
    // Use a buffer system - must be off track for several frames before resetting
    if (!onTrack) {
      offTrackFrames.current++;
      // Need to be off track for 15 frames (about 0.25 seconds) before resetting
      if (offTrackFrames.current > 15 && isOnTrack) {
        setIsOnTrack(false);
        setTimerStarted(false);
        setCurrentTime(0);
        checkpointsPassed.current.clear();
      }
    } else {
      offTrackFrames.current = 0;
      if (!isOnTrack) {
        setIsOnTrack(true);
      }
    }

    // Check distance to start line
    const startCheckpoint = trackCheckpoints.current[0];
    const distToStart = carPos.distanceTo(startCheckpoint.pos);
    
    // Track if car has left the start area
    if (timerStarted && distToStart > 15) {
      hasLeftStart.current = true;
    }

    // Check for timer start at spawn/start line
    if (!timerStarted && frameCountRef.current % 5 === 0) {
      if (distToStart < 10) {
        // Start the timer
        setTimerStarted(true);
        startTimeRef.current = Date.now();
        setCurrentTime(0);
        checkpointsPassed.current.clear();
        checkpointsPassed.current.add(0);
        hasLeftStart.current = false;
        lastLapTime.current = Date.now();
      }
    }

    // Check for checkpoint passing
    if (timerStarted && isOnTrack && frameCountRef.current % 5 === 0) {
      // Check all checkpoints
      trackCheckpoints.current.forEach((checkpoint, index) => {
        if (index === 0) return; // Skip start checkpoint here
        const dist = carPos.distanceTo(checkpoint.pos);
        if (dist < 12) {
          checkpointsPassed.current.add(index);
        }
      });
    }

    // Check for lap completion - check every frame when near finish
    if (timerStarted && isOnTrack && hasLeftStart.current) {
      if (distToStart < 10) {
        // Must have passed at least 5 checkpoints and been racing for at least 10 seconds
        const timeSinceLap = Date.now() - lastLapTime.current;
        if (checkpointsPassed.current.size >= 5 && timeSinceLap > 10000) {
          const lapTime = currentTime;
          
          if (!bestTime || lapTime < bestTime) {
            setBestTime(lapTime);
            localStorage.setItem('carRaceBestTime', lapTime.toString());
          }
          
          setLapCount(prev => prev + 1);
          startTimeRef.current = Date.now();
          setCurrentTime(0);
          checkpointsPassed.current.clear();
          checkpointsPassed.current.add(0);
          hasLeftStart.current = false;
          lastLapTime.current = Date.now();
        }
      }
    }
  });

  return null;
};

export default LapTimer;