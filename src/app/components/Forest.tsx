'use client';

import React from 'react';
import Tree from './Tree';

const Forest: React.FC = () => {
  // Define tree positions (you can adjust these as needed)
  const treePositions: [number, number, number][] = [
    [10, 0, 10],
    [-10, 0, -40],
    [15, 0, -15],
    [-8, 0, 5],
    [30, 0, 20],
    [20, 0, 40],
    [-45, 0, -5],
  ];

  return (
    <>
      {treePositions.map((pos, index) => (
        <Tree key={index} position={pos} />
      ))}
    </>
  );
};

export default Forest;