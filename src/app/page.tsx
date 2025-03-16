'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import Ramp from './components/Ramp';  // Import the Ramp component
import Bridge from './components/Bridge'; // Import the TrackBridge component

const Page: React.FC = () => {
  const carRef = useRef<any>(null);
  const [carOnTrack, setCarOnTrack] = useState(false);

  // Set the spawn position of the car (x, y, z)
  const carSpawnPosition: [number, number, number] = [-25, 1, 5]; // Adjust this based on your track's design

  // Ramp positions
  const ramp1Pos: [number, number, number] = [22, -1.6, 23];
  const ramp2Pos: [number, number, number] = [-12, -1.6, 15];

  const bridgeStart: [number, number, number] = [10, 0, -10];
  const bridgeEnd: [number, number, number] = [-10, 0, 10];
  const bridgeHeight = 10; // Height of the bridge

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

          {/* Add Ramp 1 */}
          <Ramp position={ramp1Pos} rotation={[0, Math.PI/4, Math.PI / 9]} />
          {/* Add Ramp 2 */}
          <Ramp position={ramp2Pos} rotation={[0, Math.PI / 8, Math.PI / 9]} />

          {/* Add Track Between Ramps */}
          {/* <Bridge start={bridgeStart} end={bridgeEnd} height={bridgeHeight} /> */}
        </Physics>
        <Track />
        <FollowCamera target={carRef} />
        <Tunnels carRef={carRef} />
      </Canvas>
    </div>
  );
};

export default Page;