'use client';

import React from 'react';
import PhysicsBox from './PhysicsBox';

const DestructibleObjects: React.FC = () => {
  return (
    <>
      {/* Stack of boxes near the start */}
      <PhysicsBox position={[-20, 0.5, 5]} color="#ff6b6b" />
      <PhysicsBox position={[-20, 1.5, 5]} color="#4ecdc4" />
      <PhysicsBox position={[-20, 2.5, 5]} color="#ffe66d" />
      
      {/* Pyramid formation */}
      <PhysicsBox position={[10, 0.5, 15]} size={[1.2, 1, 1.2]} color="#ff6b6b" />
      <PhysicsBox position={[11.2, 0.5, 15]} size={[1.2, 1, 1.2]} color="#4ecdc4" />
      <PhysicsBox position={[10.6, 1.5, 15]} size={[1.2, 1, 1.2]} color="#ffe66d" />
      
      {/* Scattered boxes */}
      <PhysicsBox position={[0, 0.5, -20]} color="#a8e6cf" />
      <PhysicsBox position={[15, 0.5, -5]} color="#ffd3b6" />
      <PhysicsBox position={[-10, 0.5, 20]} color="#ffaaa5" />
      
      {/* Wall of boxes to crash through */}
      <PhysicsBox position={[5, 0.5, 0]} color="#ff6b6b" mass={0.3} />
      <PhysicsBox position={[5, 0.5, 1]} color="#4ecdc4" mass={0.3} />
      <PhysicsBox position={[5, 0.5, -1]} color="#ffe66d" mass={0.3} />
      <PhysicsBox position={[5, 1.5, 0]} color="#a8e6cf" mass={0.3} />
      <PhysicsBox position={[5, 1.5, 1]} color="#ffd3b6" mass={0.3} />
      <PhysicsBox position={[5, 1.5, -1]} color="#ffaaa5" mass={0.3} />
      
      {/* Large boxes as obstacles */}
      <PhysicsBox position={[-5, 1, 10]} size={[2, 2, 2]} color="#95e1d3" mass={1} />
      <PhysicsBox position={[20, 0.75, 5]} size={[1.5, 1.5, 1.5]} color="#f38181" mass={0.8} />
      
      {/* Barrel-like cylinders (using boxes for now) */}
      <PhysicsBox position={[-15, 0.6, -10]} size={[1.2, 1.2, 1.2]} color="#aa96da" mass={0.6} />
      <PhysicsBox position={[-14, 0.6, -10]} size={[1.2, 1.2, 1.2]} color="#fcbad3" mass={0.6} />
      <PhysicsBox position={[-16, 0.6, -10]} size={[1.2, 1.2, 1.2]} color="#ffffd2" mass={0.6} />
    </>
  );
};

export default DestructibleObjects;