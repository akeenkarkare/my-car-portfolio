'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DustParticlesProps {
  carRef: React.MutableRefObject<THREE.Mesh | null>;
}

const DustParticles: React.FC<DustParticlesProps> = ({ carRef }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 100;
  
  const [positions, sizes, velocities, lifetimes] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -100;
      positions[i * 3 + 2] = 0;
      sizes[i] = 0;
      lifetimes[i] = 0;
    }
    
    return [positions, sizes, velocities, lifetimes];
  }, []);

  const particleIndex = useRef(0);
  const lastCarPos = useRef(new THREE.Vector3());
  
  useFrame((state, delta) => {
    if (!particlesRef.current || !carRef.current) return;
    
    const geometry = particlesRef.current.geometry;
    const positionsAttr = geometry.attributes.position as THREE.BufferAttribute;
    const sizesAttr = geometry.attributes.size as THREE.BufferAttribute;
    
    const carPos = new THREE.Vector3();
    carRef.current.getWorldPosition(carPos);
    
    const velocity = carPos.clone().sub(lastCarPos.current);
    const speed = velocity.length() / delta;
    
    // Emit new particles if car is moving
    if (speed > 5) {
      for (let i = 0; i < 2; i++) {
        const idx = particleIndex.current % particleCount;
        
        positions[idx * 3] = carPos.x + (Math.random() - 0.5) * 0.5;
        positions[idx * 3 + 1] = 0.1;
        positions[idx * 3 + 2] = carPos.z + (Math.random() - 0.5) * 0.5;
        
        velocities[idx * 3] = (Math.random() - 0.5) * 2 - velocity.x * 0.5;
        velocities[idx * 3 + 1] = Math.random() * 2 + 1;
        velocities[idx * 3 + 2] = (Math.random() - 0.5) * 2 - velocity.z * 0.5;
        
        sizes[idx] = Math.random() * 10 + 5;
        lifetimes[idx] = 1;
        
        particleIndex.current++;
      }
    }
    
    // Update existing particles
    for (let i = 0; i < particleCount; i++) {
      if (lifetimes[i] > 0) {
        positions[i * 3] += velocities[i * 3] * delta;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;
        
        velocities[i * 3 + 1] -= 3 * delta; // gravity
        
        lifetimes[i] -= delta * 0.5;
        sizes[i] = (Math.random() * 10 + 5) * lifetimes[i];
        
        if (lifetimes[i] <= 0) {
          positions[i * 3 + 1] = -100;
          sizes[i] = 0;
        }
      }
    }
    
    positionsAttr.needsUpdate = true;
    sizesAttr.needsUpdate = true;
    
    lastCarPos.current.copy(carPos);
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#8B7355"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

export default DustParticles;