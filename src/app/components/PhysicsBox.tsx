'use client';

import React from 'react';
import { useBox } from '@react-three/cannon';
import { Mesh } from 'three';

interface PhysicsBoxProps {
  position: [number, number, number];
  size?: [number, number, number];
  color?: string;
  mass?: number;
}

const PhysicsBox: React.FC<PhysicsBoxProps> = ({ 
  position, 
  size = [1, 1, 1],
  color = "#ff6b6b",
  mass = 0.5
}) => {
  const [ref] = useBox<Mesh>(() => ({
    mass,
    position,
    args: size,
    material: {
      friction: 0.4,
      restitution: 0.3,
    },
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default PhysicsBox;