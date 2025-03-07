'use client';

import React from 'react';
import { useBox } from '@react-three/cannon';
import { Mesh } from 'three';

const Border: React.FC = () => {
  const groundSize = 100; // Your ground plane is 100x100
  const halfGround = groundSize / 2;
  const wallHeight = 5;
  const wallThickness = 1;

  // North wall (along the top edge, z = -halfGround)
  const [northRef] = useBox<Mesh>(() => ({
    type: 'Static',
    position: [0, wallHeight / 2, -halfGround],
    args: [groundSize, wallHeight, wallThickness],
  }));

  // South wall (along the bottom edge, z = +halfGround)
  const [southRef] = useBox<Mesh>(() => ({
    type: 'Static',
    position: [0, wallHeight / 2, halfGround],
    args: [groundSize, wallHeight, wallThickness],
  }));

  // East wall (along the right edge, x = +halfGround)
  const [eastRef] = useBox<Mesh>(() => ({
    type: 'Static',
    position: [halfGround, wallHeight / 2, 0],
    args: [wallThickness, wallHeight, groundSize],
  }));

  // West wall (along the left edge, x = -halfGround)
  const [westRef] = useBox<Mesh>(() => ({
    type: 'Static',
    position: [-halfGround, wallHeight / 2, 0],
    args: [wallThickness, wallHeight, groundSize],
  }));

  return (
    <>
      <mesh ref={northRef as any} receiveShadow castShadow>
        <boxGeometry args={[groundSize, wallHeight, wallThickness]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh ref={southRef as any} receiveShadow castShadow>
        <boxGeometry args={[groundSize, wallHeight, wallThickness]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh ref={eastRef as any} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, wallHeight, groundSize]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh ref={westRef as any} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, wallHeight, groundSize]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </>
  );
};

export default Border;