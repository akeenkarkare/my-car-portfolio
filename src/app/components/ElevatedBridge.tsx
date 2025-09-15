'use client';

import React from 'react';
import { useBox } from '@react-three/cannon';
import { Mesh } from 'three';

interface ElevatedBridgeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
  width?: number;
  thickness?: number;
}

const ElevatedBridge: React.FC<ElevatedBridgeProps> = ({ 
  position, 
  rotation = [0, 0, 0],
  length = 20,
  width = 8,
  thickness = 0.5
}) => {
  const [ref] = useBox<Mesh>(() => ({
    type: 'Static',
    position,
    rotation,
    args: [length, thickness, width],
  }));

  return (
    <mesh ref={ref} receiveShadow castShadow>
      <boxGeometry args={[length, thickness, width]} />
      <meshStandardMaterial color="#8B7355" />
    </mesh>
  );
};

export default ElevatedBridge;