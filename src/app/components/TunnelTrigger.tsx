'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Vector3, Shape, ExtrudeGeometry } from 'three';
import { useRouter } from 'next/navigation';
import { Text } from '@react-three/drei';

interface TunnelTriggerProps {
  carRef: React.RefObject<THREE.Object3D | null>;
  position: [number, number, number];
  radius?: number;
  redirectPath?: string;
  destinationLabel?: string;
  promptLabel?: string;
}

const TunnelTrigger: React.FC<TunnelTriggerProps> = ({
  carRef,
  position,
  radius = 2,
  redirectPath = '/projects',
  destinationLabel = 'Projects',
  promptLabel = 'Press E to Teleport',
}) => {
  const router = useRouter();
  const [inTunnel, setInTunnel] = useState(false);
  // Use state to hold the computed geometry so that re-render occurs when it's ready.
  const [tunnelGeometry, setTunnelGeometry] = useState<ExtrudeGeometry | null>(null);
  const triggeredRef = useRef(false);

  // Create the semicircular tunnel geometry once.
  useEffect(() => {
    console.log("[TunnelTrigger] Computing tunnel geometry with radius:", radius);
    const shape = new Shape();
    // Create a semicircle (arc from 0 to PI). Flat side will be at the bottom.
    shape.absarc(0, 0, radius, 0, Math.PI, false);
    // Close the shape by drawing a line along the flat edge.
    shape.lineTo(-radius, 0);
    const extrudeSettings = {
      steps: 1,
      depth: 0.2,
      bevelEnabled: false,
    };
    const geom = new ExtrudeGeometry(shape, extrudeSettings);
    // Rotate so the flat side faces upward (adjust as needed).
    geom.rotateY(Math.PI);
    console.log("[TunnelTrigger] Tunnel geometry computed:", geom);
    setTunnelGeometry(geom);
  }, [radius]);

  // Each frame, check the distance from the car to the tunnel center.
  useFrame(() => {
    if (!carRef.current) return;
    const carPos = new Vector3();
    carRef.current.getWorldPosition(carPos);
    const tunnelCenter = new Vector3(...position);
    const dist = carPos.distanceTo(tunnelCenter);
    console.log("[TunnelTrigger] Distance to tunnel center:", dist);
    const isInside = dist < radius;
    if (isInside !== inTunnel) {
      console.log("[TunnelTrigger] Tunnel state changed. isInside:", isInside);
      setInTunnel(isInside);
      if (!isInside) {
        triggeredRef.current = false;
        console.log("[TunnelTrigger] Car left tunnel. Resetting trigger.");
      }
    }
  });

  // Listen for "E" key presses when inside the tunnel.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (inTunnel && !triggeredRef.current && e.key.toLowerCase() === 'e') {
        console.log("[TunnelTrigger] 'E' key pressed inside tunnel. Triggering teleport.");
        e.preventDefault();
        e.stopPropagation();
        triggeredRef.current = true;
        router.push(redirectPath);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inTunnel, router, redirectPath]);

  return (
    <group position={position}>
      {/* Tunnel Mesh */}
      {tunnelGeometry ? (
        <mesh geometry={tunnelGeometry}>
          <meshStandardMaterial color="black" />
        </mesh>
      ) : (
        // Temporary mesh to indicate geometry is not ready
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      )}
      {/* Destination label always visible above the tunnel */}
      <Text
        position={[0, radius + 1, -0.118]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth="2%"
        outlineColor="#000"
        rotation={[0, Math.PI, 0]}
      >
        {destinationLabel}
      </Text>
      {/* Prompt text appears when inside the tunnel */}
      {inTunnel && (
        <Text
          position={[0, radius + 0.2, -0.118]}
          fontSize={0.4}
          color="yellow"
          anchorX="center"
          anchorY="middle"
          outlineWidth="2%"
          outlineColor="#000"
          rotation={[0, Math.PI, 0]}
        >
          {promptLabel}
        </Text>
      )}
    </group>
  );
};

export default TunnelTrigger;