'use client';

import React, { useRef, useState } from 'react';
import { Text, Billboard } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

interface ProjectZoneProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  project: {
    title: string;
    description: string;
    tech: string[];
    color: string;
    icon: string;
    url?: string;
  };
  carRef: React.MutableRefObject<Mesh | null>;
  onEnter: (project: any) => void;
  onExit: () => void;
}

const ProjectZone: React.FC<ProjectZoneProps> = ({ 
  position, 
  rotation = [0, 0, 0],
  project,
  carRef,
  onEnter,
  onExit
}) => {
  const [isNear, setIsNear] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const floatRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!carRef.current) return;
    
    // Check distance to car
    const carPos = new Vector3();
    carRef.current.getWorldPosition(carPos);
    const zonePos = new Vector3(...position);
    const distance = carPos.distanceTo(zonePos);
    
    // Trigger when car is close
    if (distance < 6) {
      if (!hasTriggered) {
        setIsNear(true);
        setHasTriggered(true);
        onEnter(project);
      }
    } else {
      if (hasTriggered && distance > 9) {
        setIsNear(false);
        setHasTriggered(false);
        onExit();
      }
    }
    
    // Floating animation for the icon
    if (floatRef.current) {
      floatRef.current.position.y = position[1] + 3 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      floatRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Ground platform */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[8, 0.2, 8]} />
        <meshStandardMaterial color={project.color} />
      </mesh>
      
      {/* Glowing pillars */}
      <mesh position={[-3, 1.5, -3]} castShadow>
        <boxGeometry args={[0.5, 3, 0.5]} />
        <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={isNear ? 0.5 : 0.2} />
      </mesh>
      <mesh position={[3, 1.5, -3]} castShadow>
        <boxGeometry args={[0.5, 3, 0.5]} />
        <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={isNear ? 0.5 : 0.2} />
      </mesh>
      <mesh position={[-3, 1.5, 3]} castShadow>
        <boxGeometry args={[0.5, 3, 0.5]} />
        <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={isNear ? 0.5 : 0.2} />
      </mesh>
      <mesh position={[3, 1.5, 3]} castShadow>
        <boxGeometry args={[0.5, 3, 0.5]} />
        <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={isNear ? 0.5 : 0.2} />
      </mesh>
      
      {/* Floating project icon/emoji */}
      <Billboard ref={floatRef}>
        <Text
          fontSize={2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {project.icon}
        </Text>
      </Billboard>
      
      {/* Project title */}
      <Billboard position={[0, 1.5, 0]}>
        <Text
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {project.title}
        </Text>
      </Billboard>
    </group>
  );
};

export default ProjectZone;