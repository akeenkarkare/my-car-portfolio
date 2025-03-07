'use client';

import React from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Vector3, Quaternion } from 'three';

interface FollowCameraProps {
  target: React.RefObject<THREE.Object3D | null>;
}

const FollowCamera: React.FC<FollowCameraProps> = ({ target }) => {
  const { camera } = useThree();

  // Define the offset for your "chase cam" once
  // (assuming the car faces -Z, so +Z is behind it)
  const baseOffset = new Vector3(0, 2, -5);

  useFrame(() => {
    if (target.current) {
      // 1) Get car’s current position and rotation
      const carPosition = new Vector3();
      target.current.getWorldPosition(carPosition);

      const carQuaternion = new Quaternion();
      target.current.getWorldQuaternion(carQuaternion);

      // 2) Clone the offset each frame so we don’t rotate the same vector repeatedly
      const offset = baseOffset.clone();
      offset.applyQuaternion(carQuaternion);

      // 3) Add that offset to the car’s position for the desired camera position
      const desiredPosition = carPosition.clone().add(offset);

      // 4) Smoothly move the camera
      camera.position.lerp(desiredPosition, 0.25);

      // 5) Make the camera look at the car
      camera.lookAt(carPosition);
    }
  });

  return null;
};

export default FollowCamera;