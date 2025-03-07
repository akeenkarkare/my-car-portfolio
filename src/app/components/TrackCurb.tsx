'use client';

import React, { useMemo } from 'react';
import { CatmullRomCurve3, Vector3, TubeGeometry, TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { useTrimesh } from '@react-three/cannon';

const TrackCurbs: React.FC = () => {
    const texture = useLoader(TextureLoader, '/textures/red-white-stripe.png');

    // Define the inside edge points of your track.
    const insidePoints = [
      new Vector3(0, 0, -30),
      new Vector3(20, 0, -10),
      new Vector3(20, 0, 0),
      new Vector3(15, 0, 10),
      new Vector3(5, 0, 20),
      new Vector3(-5, 0, 35),
      new Vector3(-20, 0, 5),
      new Vector3(-5, 0, -5),
    ];
  
    // Create a closed curve for the inside edge.
    const insideCurve = useMemo(() => {
      return new CatmullRomCurve3(insidePoints, true);
    }, []);
  
    // Function to generate a curb geometry by offsetting the inside curve.
    // offsetDistance < 0 => curb is inside
    // offsetDistance >= 0 => curb is outside or aligned
    const generateCurbGeometry = (curve: CatmullRomCurve3, offsetDistance: number) => {
      const divisions = 400;
      const offsetPoints: Vector3[] = [];
      for (let i = 0; i <= divisions; i++) {
        const t = i / divisions;
        const point = curve.getPoint(t);
        const tangent = curve.getTangent(t);
        // Compute the 2D normal in the XZ plane
        const normal = new Vector3(-tangent.z, 0, tangent.x).normalize();
        // Offset the point by the desired distance
        const offsetPoint = point.clone().add(normal.multiplyScalar(offsetDistance));
        offsetPoints.push(offsetPoint);
      }
  
      // Create a new closed curve from the offset points
      const offsetCurve = new CatmullRomCurve3(offsetPoints, true);
  
      // Build a tube geometry along that offset curve
      const tubularSegments = 200;
      const tubeRadius = 0.2; // Adjust curb thickness as needed
      const radialSegments = 12;
      const closed = true;
      const geom = new TubeGeometry(offsetCurve, tubularSegments, tubeRadius, radialSegments, closed);
  
      // Recompute normals and bounding box (good practice)
      geom.computeVertexNormals();
      geom.computeBoundingBox();
  
      return geom;
    };
  
    // Generate the inside and outside curb geometries
    const insideCurbGeometry = useMemo(() => generateCurbGeometry(insideCurve, -10), [insideCurve]);
    const outsideCurbGeometry = useMemo(() => generateCurbGeometry(insideCurve, 0), [insideCurve]);
  
    return (
      <>
        {/* Inside curb */}
        <mesh geometry={insideCurbGeometry} castShadow receiveShadow>
          <meshStandardMaterial map={texture} />
        </mesh>
        {/* Outside curb */}
        <mesh geometry={outsideCurbGeometry} castShadow receiveShadow>
          <meshStandardMaterial map={texture} />
        </mesh>
      </>
    );
};

export default TrackCurbs;