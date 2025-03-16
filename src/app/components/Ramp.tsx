'use client';

import React from 'react';
import { useBox } from '@react-three/cannon';
import { Mesh } from 'three';

interface RampProps {
  position: [number, number, number];
  rotation: [number, number, number];  // Rotation to tilt the ramp
}

const Ramp: React.FC<RampProps> = ({ position, rotation }) => {
  const [ref] = useBox<Mesh>(() => ({
    position,
    args: [10, 7, 5],  // Ramp size, adjust to make it bigger or smaller
    rotation,
    type: 'Static',  // Static object so it doesn't move
    material: { friction: 0.001, restitution: 0.5 },
  }));

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <boxGeometry attach="geometry" args={[10, 7, 5]} /> {/* Create a box geometry to simulate the ramp */}
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

export default Ramp;