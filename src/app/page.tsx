'use client';

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { useRouter } from 'next/navigation';

import Car from './components/Car';
import Ground from './components/Ground';
import FollowCamera from './components/FollowCamera';
import Track from './components/Track';
import Border from './components/Border';
import TrackCurb from './components/TrackCurb';
import Forest from './components/Forest';
import TunnelTrigger from './components/TunnelTrigger';

const Page: React.FC = () => {
  const carRef = useRef<any>(null);
  return (
    <div style={{ height: '100vh', backgroundColor: 'lightblue', position: 'relative' }}>
      <Canvas shadows gl={{ alpha: true }} camera={{ position: [0, 2, -10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Physics>
          <Car setCarRef={(mesh) => (carRef.current = mesh)} />
          <Ground />
          <Border />
          <TrackCurb />
          <Forest />
        </Physics>
        <Track />
        <FollowCamera target={carRef} />
        {/* TunnelTrigger placed at [50,0,50] */}
        <TunnelTrigger
          carRef={carRef}
          position={[0, 0, 49.6]}
          radius={2}
          redirectPath="/projects"
          destinationLabel="Projects"
          promptLabel="Press E to Teleport"
        />
      </Canvas>
    </div>
  );
};

export default Page;