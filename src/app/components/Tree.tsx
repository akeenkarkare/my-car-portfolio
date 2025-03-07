'use client';

import React from 'react';
import { Group } from 'three';
import { useCompoundBody } from '@react-three/cannon';

interface TreeProps {
  position?: [number, number, number];
}

const Tree: React.FC<TreeProps> = ({ position = [0, 0, 0] }) => {
  // Create a static compound body for the tree:
  // A trunk: a cylinder of radius 0.5 and height 3, centered at [0, 1.5, 0]
  // Foliage: a sphere of radius 1.5, centered at [0, 3.5, 0]
  const [ref] = useCompoundBody(() => ({
    mass: 0,
    position,
    shapes: [
      { type: 'Cylinder', args: [0.5, 0.5, 3, 8], position: [0, 1.5, 0] },
      { type: 'Sphere', args: [1.5], position: [0, 3.5, 0] },
    ],
    material: { friction: 0.5, restitution: 0.5 },
  }));

  return (
    <group ref={ref}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 3, 8]} />
        <meshStandardMaterial color="brown" />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 3.5, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </group>
  );
};

export default Tree;