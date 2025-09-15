'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Mesh } from 'three';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';

import Car from './components/Car';
import Ground from './components/Ground';
import FollowCamera from './components/FollowCamera';
import Track from './components/Track';
import Border from './components/Border';
import TrackCurb from './components/TrackCurb';
import Forest from './components/Forest';
import DustParticles from './components/DustParticles';
import DestructibleObjects from './components/DestructibleObjects';
import ProjectShowcase, { getProjects } from './components/ProjectShowcase';
import ProjectUI from './components/ProjectUI';
import SimpleLapTimer, { TimerData } from './components/SimpleLapTimer';
import { TimerUI } from './components/LapTimer';
import StartFinishLine from './components/StartFinishLine';

const Page: React.FC = () => {
  const carRef = useRef<Mesh | null>(null);
  const [activeProject, setActiveProject] = useState<any>(null);
  const [visitedProjects, setVisitedProjects] = useState<Set<string>>(new Set());
  const [timerData, setTimerData] = useState<TimerData>({
    currentTime: 0,
    bestTime: null,
    isOnTrack: true,
    lapCount: 1
  });
  const [exploreMode, setExploreMode] = useState<boolean>(false);

  const handleProjectEnter = (project: any) => {
    setActiveProject(project);
    setVisitedProjects(prev => new Set([...prev, project.id]));
  };

  const handleProjectExit = () => {
    setActiveProject(null);
  };

  const handleOpenProject = () => {
    if (activeProject?.url) {
      window.open(activeProject.url, '_blank');
    }
  };

  // Handle keyboard press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        if (activeProject?.url) {
          handleOpenProject();
        }
      }
      if (e.key === 'r' || e.key === 'R') {
        setExploreMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [activeProject]);

  // Set the spawn position of the car (x, y, z)
  const carSpawnPosition: [number, number, number] = [-25, 1, 5]; // Adjust this based on your track's design


  return (
    <div style={{ height: '100vh', backgroundColor: 'lightblue', position: 'relative' }}>
      <Canvas shadows gl={{ alpha: true }} camera={{ position: [0, 2, -10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Physics>
          {/* Car Component */}
          <Car setCarRef={(mesh) => (carRef.current = mesh)} position={carSpawnPosition} />
          <Ground />
          <Border />
          <TrackCurb />
          <Forest />
          <DestructibleObjects />
          <ProjectShowcase carRef={carRef} onProjectEnter={handleProjectEnter} onProjectExit={handleProjectExit} />
        </Physics>
        <Track />
        {!exploreMode && <StartFinishLine />}
        <FollowCamera target={carRef} />
        <DustParticles carRef={carRef} />
        {!exploreMode && <SimpleLapTimer carRef={carRef} onTimerUpdate={setTimerData} />}
      </Canvas>
      {!exploreMode && <TimerUI timerData={timerData} />}
      
      {/* Mode Toggle Indicator */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: exploreMode ? 'rgba(138, 43, 226, 0.8)' : 'rgba(0, 128, 0, 0.8)',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '10px',
          fontFamily: 'monospace',
          fontSize: '16px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          zIndex: 1000,
          textAlign: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          {exploreMode ? '🔍 EXPLORE MODE' : '🏁 RACE MODE'}
        </div>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>
          Press R to {exploreMode ? 'enable timer' : 'explore freely'}
        </div>
      </div>
      <ProjectUI 
        activeProject={activeProject}
        visitedProjects={visitedProjects}
        totalProjects={5}
        projectIcons={getProjects()}
        onOpenProject={handleOpenProject}
      />
    </div>
  );
};

export default Page;