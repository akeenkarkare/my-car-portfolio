'use client';

import React, { useMemo } from 'react';
import { ExtrudeGeometry, Shape, CatmullRomCurve3, Vector3 } from 'three';

const Track: React.FC = () => {
  const geometry = useMemo(() => {
    // Define the cross-section of the track so its bottom is at y=0
    const roadWidth = 0.1;
    const halfWidth = roadWidth / 2;
    const roadThickness = 10; // Adjust thickness if desired

    const shape = new Shape();
    // Bottom edge at y=0, top edge at y=0.1
    shape.moveTo(-halfWidth, 0);
    shape.lineTo(halfWidth, 0);
    shape.lineTo(halfWidth, roadThickness);
    shape.lineTo(-halfWidth, roadThickness);
    shape.closePath(); // Ensure the shape is closed

    // Define a closed curve at y=0 for the track path
    const curve = new CatmullRomCurve3(
      [
        new Vector3(0, 0, -30),
        new Vector3(20, 0, -10),
        new Vector3(20, 0, 0),
        new Vector3(15, 0, 10),
        new Vector3(5, 0, 20),
        new Vector3(-5, 0, 35),
        new Vector3(-20, 0, 5),
        new Vector3(-5, 0, -5),
      ],
      true // closed curve
    );

    const extrudeSettings = {
      steps: 1000,
      extrudePath: curve,
      bevelEnabled: true,
    };

    // Create the extruded geometry without additional translation
    const geom = new ExtrudeGeometry(shape, extrudeSettings);

    return geom;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

export default Track;