'use client';

import React, { useState, useEffect, useRef } from 'react';
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

const SimpleLapTimer: React.FC<LapTimerProps> = ({ carRef, onTimerUpdate }) => {
  const startTimeRef = useRef<number>(Date.now());
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [lapCount, setLapCount] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  
  // Sequential checkpoint system - must hit in order
  const currentCheckpoint = useRef<number>(0);
  const lastLapCompleteTime = useRef<number>(0);
  const frameCounter = useRef<number>(0);
  
  // Define ordered checkpoints with HUGE radius to cover entire track width
  // These follow the actual track path from Track.tsx component
  // Radius of 30-35 ensures you can't miss them no matter where on track you are
  const trackCheckpoints = [
    { pos: new Vector3(-25, 0, 5), radius: 25, name: 'Start/Finish' },     // 0: Start/Finish at spawn
    { pos: new Vector3(-5, 0, -5), radius: 30, name: 'First Corner' },     // 1: After start
    { pos: new Vector3(0, 0, -30), radius: 35, name: 'South' },            // 2: Southern point
    { pos: new Vector3(20, 0, -10), radius: 30, name: 'Southeast' },       // 3: Southeast section  
    { pos: new Vector3(20, 0, 0), radius: 30, name: 'East Mid' },          // 4: East middle
    { pos: new Vector3(15, 0, 10), radius: 30, name: 'Northeast' },        // 5: Northeast
    { pos: new Vector3(5, 0, 20), radius: 30, name: 'North' },             // 6: North section
    { pos: new Vector3(-5, 0, 35), radius: 35, name: 'Far North' },        // 7: Northernmost point
    { pos: new Vector3(-20, 0, 5), radius: 30, name: 'West' },             // 8: West section back to start
  ];
  
  // Track current checkpoint for UI
  const [checkpointInfo, setCheckpointInfo] = useState<{ next: string; progress: string }>({
    next: '',
    progress: ''
  });

  // Load best time from localStorage
  useEffect(() => {
    const savedBest = localStorage.getItem('carRaceBestTime');
    if (savedBest) {
      setBestTime(parseFloat(savedBest));
    }
  }, []);

  // Update timer
  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now() - startTimeRef.current);
    }, 100);

    return () => clearInterval(interval);
  }, [timerActive]);

  // Update parent
  useEffect(() => {
    onTimerUpdate({
      currentTime,
      bestTime,
      isOnTrack: true,
      lapCount,
      nextCheckpoint: checkpointInfo.next,
      checkpointProgress: checkpointInfo.progress
    });
  }, [currentTime, bestTime, lapCount, checkpointInfo, onTimerUpdate]);

  useFrame(() => {
    if (!carRef.current) return;
    
    // Check every frame for better reliability
    frameCounter.current++;

    const carPos = new Vector3();
    carRef.current.getWorldPosition(carPos);
    
    // Check if near start/finish
    const distToStart = carPos.distanceTo(trackCheckpoints[0].pos);
    const nearStart = distToStart < trackCheckpoints[0].radius;
    
    // Starting the timer (first time at start)
    if (!timerActive && nearStart && lapCount === 0) {
      setTimerActive(true);
      startTimeRef.current = Date.now();
      setCurrentTime(0);
      setLapCount(1);
      currentCheckpoint.current = 1; // Next checkpoint is 1
      lastLapCompleteTime.current = Date.now();
      setCheckpointInfo({
        next: trackCheckpoints[1].name,
        progress: `Checkpoints: 0/${trackCheckpoints.length - 1}`
      });
      console.log('🏁 Timer started! Complete all checkpoints in order.');
      return;
    }
    
    // If timer not active, don't check further
    if (!timerActive) return;
    
    // Check current checkpoint - check EVERY FRAME for reliability
    if (currentCheckpoint.current > 0 && currentCheckpoint.current < trackCheckpoints.length) {
      const targetCheckpoint = trackCheckpoints[currentCheckpoint.current];
      const distToCheckpoint = carPos.distanceTo(targetCheckpoint.pos);
      
      // Larger radius and check every frame
      if (distToCheckpoint < targetCheckpoint.radius) {
        console.log(`✅ Checkpoint ${currentCheckpoint.current} (${targetCheckpoint.name}) reached!`);
        currentCheckpoint.current++;
        
        // If we've hit all checkpoints, ready to complete lap at start
        if (currentCheckpoint.current >= trackCheckpoints.length) {
          currentCheckpoint.current = 0; // Looking for start/finish
          console.log('🎯 All checkpoints complete! Return to START/FINISH to complete lap.');
          setCheckpointInfo({
            next: '🏁 START/FINISH',
            progress: `Checkpoints: ${trackCheckpoints.length - 1}/${trackCheckpoints.length - 1} ✓`
          });
        } else {
          // Update UI with next checkpoint
          const nextCheckpoint = trackCheckpoints[currentCheckpoint.current];
          setCheckpointInfo({
            next: `→ ${nextCheckpoint.name}`,
            progress: `Checkpoints: ${currentCheckpoint.current - 1}/${trackCheckpoints.length - 1}`
          });
          
          // Log distance to next checkpoint for debugging
          console.log(`Next: ${nextCheckpoint.name} (currently ${distToCheckpoint.toFixed(1)} units away)`);
        }
      }
    }
    
    // Check for lap completion (must have hit all checkpoints)
    if (currentCheckpoint.current === 0 && nearStart && timerActive) {
      const now = Date.now();
      const timeSinceLastLap = now - lastLapCompleteTime.current;
      
      // Need minimum time to prevent instant re-trigger (reduced to 3 seconds)
      if (timeSinceLastLap > 3000) {
        const lapTime = currentTime;
        
        // Update best time
        if (!bestTime || lapTime < bestTime) {
          setBestTime(lapTime);
          localStorage.setItem('carRaceBestTime', lapTime.toString());
          console.log(`🏆 NEW BEST TIME: ${(lapTime / 1000).toFixed(2)}s!`);
        }
        
        console.log(`🏁 Lap ${lapCount} completed! Time: ${(lapTime / 1000).toFixed(2)}s`);
        
        // Reset for next lap
        setLapCount(prev => prev + 1);
        startTimeRef.current = now;
        setCurrentTime(0);
        currentCheckpoint.current = 1; // Start looking for checkpoint 1 again
        lastLapCompleteTime.current = now;
        setCheckpointInfo({
          next: trackCheckpoints[1].name,
          progress: `Checkpoints: 0/${trackCheckpoints.length - 1}`
        });
      }
    }
    
    // Debug info every 60 frames (about once per second)
    if (frameCounter.current % 60 === 0 && currentCheckpoint.current > 0 && currentCheckpoint.current < trackCheckpoints.length) {
      const nextCheckpoint = trackCheckpoints[currentCheckpoint.current];
      const dist = carPos.distanceTo(nextCheckpoint.pos);
      // Uncomment for debugging:
      // console.log(`Distance to ${nextCheckpoint.name}: ${dist.toFixed(1)} (need < ${nextCheckpoint.radius})`);
    }
  });

  return null;
};

export default SimpleLapTimer;