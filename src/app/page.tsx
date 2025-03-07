'use client';

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import Car from './components/Car';
import Ground from './components/Ground';
import FollowCamera from './components/FollowCamera';

const Page: React.FC = () => {
  // We'll store the car's mesh (Object3D) here.
  const carRef = useRef<any>(null);

  return (
    <Canvas shadows gl={{ alpha: true }} camera={{ position: [0, 2, -10], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Physics>
        <Car setCarRef={(mesh) => (carRef.current = mesh)} />
        <Ground />
      </Physics>
      <FollowCamera target={carRef} />
    </Canvas>
  );
};

export default Page;