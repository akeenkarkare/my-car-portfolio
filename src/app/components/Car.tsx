'use client';

import React, { useState, useEffect } from 'react';
import { useBox } from '@react-three/cannon';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useThree as useThreeFiber } from '@react-three/fiber';

interface CarProps {
  setCarRef: (obj: Mesh) => void;
}

const Car: React.FC<CarProps> = ({ setCarRef }) => {
  const [ref, api] = useBox<Mesh>(() => ({
    mass: 1,
    position: [0, 0.25, 0],
    args: [1, 0.5, 2],
    angularFactor: [0, 1, 0],
    angularDamping: 0.9,
    linearDamping: 0.9,
    allowSleep: false,
    material: { friction: 1, restitution: 0.5 },
  }));

  const { camera } = useThree();
  // When ref.current becomes available, pass it to the parent
  useEffect(() => {
    if (ref.current) {
      setCarRef(ref.current);
    }
  }, [ref.current, setCarRef]);

  const [keys, setKeys] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key in keys) {
        setKeys((prev) => ({ ...prev, [e.key]: true }));
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key in keys) {
        setKeys((prev) => ({ ...prev, [e.key]: false }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keys]);

  useFrame(() => {
    const forwardForce = 50;
    const torqueForce = 5;
    
    if (ref.current) {
      // Compute the car's world position.
      const carPos = new Vector3();
      ref.current.getWorldPosition(carPos);
      
      // Compute the desired forward direction as the vector from the camera to the car.
      // Since the camera is behind the car, this vector points in the car's "driving" direction.
      const desiredForward = carPos.clone().sub(camera.position);
      // Remove the vertical component so the force is purely horizontal.
      desiredForward.y = 0;
      desiredForward.normalize();
    
      // Up arrow applies force in the desired forward direction.
      if (keys.ArrowUp) {
        const force = desiredForward.clone().multiplyScalar(forwardForce);
        api.applyForce([force.x, force.y, force.z], [0, 0, 0]);
      }
      // Down arrow applies force in the reverse of that direction.
      if (keys.ArrowDown) {
        const force = desiredForward.clone().negate().multiplyScalar(forwardForce);
        api.applyForce([force.x, force.y, force.z], [0, 0, 0]);
      }
    }
    
    // Left/right apply torque for turning.
    if (keys.ArrowLeft) {
      api.applyTorque([0, torqueForce, 0]);
    }
    if (keys.ArrowRight) {
      api.applyTorque([0, -torqueForce, 0]);
    }
  });

  return (
    <mesh ref={ref as any} castShadow>
      <boxGeometry args={[1, 0.5, 2]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

export default Car;
function useThree() {
  const { camera } = useThreeFiber();
  return { camera };
}

