'use client';

import React, { useMemo } from 'react';
import { ExtrudeGeometry, Shape, CatmullRomCurve3, Vector3 } from 'three';

interface BridgeProps {
  start: [number, number, number];  // Start point of the bridge
  end: [number, number, number];    // End point of the bridge
  height: number;  // Height of the bridge
}

const Bridge: React.FC<BridgeProps> = ({ start, end, height }) => {
  // Create the shape of the track (cross-section)
  const roadWidth = 0.1;
  const halfWidth = roadWidth / 2;
  const roadThickness = 10; // Track thickness (height)

  const shape = new Shape();
  shape.moveTo(-halfWidth, 0);
  shape.lineTo(halfWidth, 0);
  shape.lineTo(halfWidth, roadThickness);
  shape.lineTo(-halfWidth, roadThickness);
  shape.closePath(); // Close the shape for extrusion

  // Define the path of the bridge using CatmullRomCurve3
  const curve = new CatmullRomCurve3(
        [
           new Vector3(20, 0, -10),  // Start of the bridge
           new Vector3(10, 2, -5)
        ],
        false // Close the curve to make the track a loop
      );

  // Define extrude settings for the geometry
  const extrudeSettings = {
    steps: 100, // Number of segments along the path
    extrudePath: curve, // Path along which the shape will be extruded
    bevelEnabled: true, // Enable bevel for rounded edges
  };

  // Create the extruded geometry for the bridge
  const geometry = new ExtrudeGeometry(shape, extrudeSettings);

  return (
    <mesh geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

export default Bridge;