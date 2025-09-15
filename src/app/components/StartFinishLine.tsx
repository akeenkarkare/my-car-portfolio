'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import { Mesh } from 'three';

const StartFinishLine: React.FC = () => {
  const flagRef = useRef<Mesh>(null);
  const textRef = useRef<Mesh>(null);
  
  // Position at spawn point
  const position: [number, number, number] = [-25, 0, 5];
  
  useFrame((state) => {
    // Animate the text floating
    if (textRef.current) {
      textRef.current.position.y = 4 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
    // Rotate the flag marker
    if (flagRef.current) {
      flagRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Checkered finish line on ground */}
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        {/* White base */}
        <mesh>
          <planeGeometry args={[12, 8]} />
          <meshStandardMaterial color="white" />
        </mesh>
        
        {/* Black squares for checkered pattern */}
        {[...Array(6)].map((_, i) => (
          [...Array(4)].map((_, j) => (
            (i + j) % 2 === 0 && (
              <mesh key={`${i}-${j}`} position={[i * 2 - 5, j * 2 - 3, 0.01]}>
                <planeGeometry args={[2, 2]} />
                <meshStandardMaterial color="black" />
              </mesh>
            )
          ))
        ))}
      </group>

      {/* Glowing ring to show the trigger area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[8, 10, 32]} />
        <meshStandardMaterial 
          color="#00ff00" 
          transparent 
          opacity={0.3}
          emissive="#00ff00"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Pole markers on sides */}
      <mesh position={[-6, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[6, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Checkered flags on poles */}
      <mesh position={[-6, 4, 0]} ref={flagRef}>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[6, 4, 0]}>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Floating START/FINISH text */}
      <Billboard ref={textRef} position={[0, 4, 0]}>
        <Text
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.15}
          outlineColor="black"
        >
          START / FINISH
        </Text>
      </Billboard>

      {/* Arrow pointing down */}
      <Billboard position={[0, 2.5, 0]}>
        <Text
          fontSize={2}
          color="#00ff00"
          anchorX="center"
          anchorY="middle"
        >
          ⬇
        </Text>
      </Billboard>

      {/* Instructions */}
      <Billboard position={[0, 6, 0]}>
        <Text
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="black"
        >
          Drive through here to start/finish lap
        </Text>
      </Billboard>
    </group>
  );
};

export default StartFinishLine;