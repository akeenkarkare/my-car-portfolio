'use client';

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';

import Car from './components/Car';
import Ground from './components/Ground';
import FollowCamera from './components/FollowCamera';
import Track from './components/Track';
import Border from './components/Border';
import TrackCurb from './components/TrackCurb';
import Forest from './components/Forest';
import Tunnels from './components/Tunnels';

const Page: React.FC = () => {
  const carRef = useRef<any>(null);

  // Set the spawn position of the car (x, y, z) where you'd like it on the track
  const carSpawnPosition: [number, number, number] = [-25, 1, 5]; // Adjust this based on your track's design

  return (
    <div style={{ height: '100vh', backgroundColor: 'lightblue', position: 'relative' }}>
      <Canvas shadows gl={{ alpha: true }} camera={{ position: [0, 2, -10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Physics>
          {/* Pass the position prop for the car's spawn point */}
          <Car setCarRef={(mesh) => (carRef.current = mesh)} position={carSpawnPosition} />
          <Ground />
          <Border />
          <TrackCurb />
          <Forest />
        </Physics>
        <Track />
        <FollowCamera target={carRef} />
        <Tunnels carRef={carRef} />
      </Canvas>
    </div>
  );
};

export default Page;