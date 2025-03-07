'use client';

import React from 'react';
import { usePlane } from '@react-three/cannon';
import { Mesh } from 'three';

const Ground: React.FC = () => {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    // Set the ground's material properties
    material: { friction: 0.001, restitution: 0.5 },
  }));

  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="lightgreen" />
    </mesh>
  );
};

export default Ground;