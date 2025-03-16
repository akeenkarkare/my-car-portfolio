'use client';

import React, { useMemo } from 'react';
import { ExtrudeGeometry, Shape, CatmullRomCurve3, Vector3 } from 'three';

const Track: React.FC = () => {
  const geometry = useMemo(() => {
    const roadWidth = 0.1; // Track width
    const halfWidth = roadWidth / 2;
    const roadThickness = 10; // Track thickness (height)

    // Define the shape of the track (cross-section)
    const shape = new Shape();
    shape.moveTo(-halfWidth, 0);
    shape.lineTo(halfWidth, 0);
    shape.lineTo(halfWidth, roadThickness);
    shape.lineTo(-halfWidth, roadThickness);
    shape.closePath(); // Close the shape to complete the rectangle

    // Define the track path using a CatmullRomCurve3 (smooth curve)
    const curve = new CatmullRomCurve3(
      [
        new Vector3(0, 0, -30),  // Start of the track
        new Vector3(20, 0, -10),
        new Vector3(20, 0, 0),
        new Vector3(15, 0, 10),
        new Vector3(5, 0, 20),
        new Vector3(-5, 0, 35),
        new Vector3(-20, 0, 5),
        new Vector3(-5, 0, -5),  // End of the track (connect back to the start)
      ],
      true // Close the curve to make the track a loop
    );

    const extrudeSettings = {
      steps: 200,
      depth: roadThickness,
      bevelEnabled: false,
    };

    const geometry = new ExtrudeGeometry(shape, { ...extrudeSettings, extrudePath: curve });
    return geometry;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

export default Track;