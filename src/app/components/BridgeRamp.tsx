'use client';

import React from 'react';
import { useBox } from '@react-three/cannon';
import { Mesh } from 'three';

interface BridgeRampProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
  width?: number;
  height?: number;
}

const BridgeRamp: React.FC<BridgeRampProps> = ({ 
  position, 
  rotation = [0, 0, 0],
  length = 8,
  width = 8,
  height = 0.5
}) => {
  const [ref] = useBox<Mesh>(() => ({
    type: 'Static',
    position,
    rotation,
    args: [length, height, width],
  }));

  return (
    <mesh ref={ref} receiveShadow castShadow>
      <boxGeometry args={[length, height, width]} />
      <meshStandardMaterial color="#A0A0A0" />
    </mesh>
  );
};

export default BridgeRamp;