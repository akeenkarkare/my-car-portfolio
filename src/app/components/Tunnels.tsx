'use client';

import React from 'react';
import * as THREE from 'three';
import TunnelTrigger from './TunnelTrigger';

interface TunnelsProps {
  carRef: React.RefObject<THREE.Object3D | null>;
}

const Tunnels: React.FC<TunnelsProps> = ({ carRef }) => {
  // Define an array of tunnel configurations.
  const tunnelData = [
    {
      position: [0, 0, 49.6] as [number, number, number],
      radius: 2,
      redirectPath: '/projects',
      destinationLabel: 'Projects',
      promptLabel: 'Press E to Teleport',
      rotation: [0, 0, 0] as [number, number, number],
    },
    {
      position: [49.6, 0, 0] as [number, number, number],
      radius: 2,
      redirectPath: '/experience',
      destinationLabel: 'Previous Experience',
      promptLabel: 'Press E to Teleport',
      rotation: [0, Math.PI / 2, 0] as [number, number, number],
    },
    {
      position: [-49.6, 0, 0] as [number, number, number],
      radius: 2,
      redirectPath: '/contact',
      destinationLabel: 'Contact Info',
      promptLabel: 'Press E to Teleport',
      rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    },
    {
        position: [0, 0, -49.6] as [number, number, number],
        radius: 2,
        redirectPath: '/resume',
        destinationLabel: 'Download Resume',
        promptLabel: 'Press E to Download',
        rotation: [0, Math.PI, 0] as [number, number, number],
      }
  ];

  return (
    <>
      {tunnelData.map((tunnel, index) => (
        <TunnelTrigger
          key={index}
          carRef={carRef}
          position={tunnel.position}
          radius={tunnel.radius}
          redirectPath={tunnel.redirectPath}
          destinationLabel={tunnel.destinationLabel}
          promptLabel={tunnel.promptLabel}
          rotation={tunnel.rotation}
        />
      ))}
    </>
  );
};

export default Tunnels;