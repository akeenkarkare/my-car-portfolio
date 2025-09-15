'use client';

import React, { useRef, useState } from 'react';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard, Torus } from '@react-three/drei';

interface ContactPortal {
  id: string;
  label: string;
  icon: string;
  color: string;
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
}

interface ContactPortalsProps {
  carRef: React.MutableRefObject<Mesh | null>;
}

const ContactPortals: React.FC<ContactPortalsProps> = ({ carRef }) => {
  const [triggeredPortals, setTriggeredPortals] = useState<Set<string>>(new Set());
  const portalRefs = useRef<{ [key: string]: Mesh | null }>({});

  const portals: ContactPortal[] = [
    {
      id: 'github',
      label: 'GitHub',
      icon: '💻',
      color: '#333333',
      url: 'https://github.com/akeenkarkare',
      position: [0, 0, -30],
      rotation: [Math.PI / 2, 0, 0],
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: '🔗',
      color: '#0077B5',
      url: 'https://www.linkedin.com/in/akeenkarkare', // Update with your LinkedIn
      position: [25, 0, 15],
      rotation: [Math.PI / 2, 0, Math.PI / 4],
    },
    {
      id: 'email',
      label: 'Email',
      icon: '📧',
      color: '#EA4335',
      url: 'mailto:akeen.karkare@stonybrook.edu',
      position: [-30, 0, 0],
      rotation: [Math.PI / 2, 0, Math.PI / 2],
    },
    {
      id: 'resume',
      label: 'Resume',
      icon: '📄',
      color: '#4CAF50',
      url: '/Akeen%20Resume%20MAIN.pdf', // This will need to be served from public folder
      position: [15, 0, -15],
      rotation: [Math.PI / 2, 0, -Math.PI / 4],
    },
  ];

  useFrame((state) => {
    if (!carRef.current) return;

    const carPos = new Vector3();
    carRef.current.getWorldPosition(carPos);

    portals.forEach((portal) => {
      const portalPos = new Vector3(...portal.position);
      const distance = carPos.distanceTo(portalPos);

      // Check if car passes through portal (within 3 units)
      if (distance < 3 && !triggeredPortals.has(portal.id)) {
        setTriggeredPortals(prev => new Set([...prev, portal.id]));
        
        // Open the link
        if (portal.id === 'resume') {
          // For resume, trigger download
          const link = document.createElement('a');
          link.href = portal.url;
          link.download = 'Akeen_Resume.pdf';
          link.click();
        } else {
          window.open(portal.url, '_blank');
        }

        // Reset after 3 seconds to allow re-triggering
        setTimeout(() => {
          setTriggeredPortals(prev => {
            const newSet = new Set(prev);
            newSet.delete(portal.id);
            return newSet;
          });
        }, 3000);
      }

      // Animate portal rotation
      const portalRef = portalRefs.current[portal.id];
      if (portalRef) {
        portalRef.rotation.z = state.clock.elapsedTime * 0.5;
      }
    });
  });

  return (
    <>
      {portals.map((portal) => (
        <group key={portal.id} position={portal.position}>
          {/* Portal ring */}
          <Torus
            ref={(ref) => (portalRefs.current[portal.id] = ref)}
            args={[3, 0.5, 16, 32]}
            rotation={portal.rotation}
          >
            <meshStandardMaterial 
              color={portal.color} 
              emissive={portal.color} 
              emissiveIntensity={triggeredPortals.has(portal.id) ? 1 : 0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </Torus>

          {/* Inner glow effect */}
          <Torus
            args={[2.5, 0.3, 16, 32]}
            rotation={portal.rotation}
          >
            <meshStandardMaterial 
              color={portal.color} 
              emissive={portal.color} 
              emissiveIntensity={0.8}
              transparent
              opacity={0.6}
            />
          </Torus>

          {/* Portal label */}
          <Billboard position={[0, 5, 0]}>
            <Text
              fontSize={1}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.1}
              outlineColor={portal.color}
            >
              {portal.label}
            </Text>
          </Billboard>

          {/* Portal icon */}
          <Billboard position={[0, 3.5, 0]}>
            <Text
              fontSize={1.5}
              anchorX="center"
              anchorY="middle"
            >
              {portal.icon}
            </Text>
          </Billboard>

          {/* Ground indicator circle */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <ringGeometry args={[2.5, 3.5, 32]} />
            <meshStandardMaterial 
              color={portal.color} 
              transparent 
              opacity={0.3}
              emissive={portal.color}
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      ))}
    </>
  );
};

export default ContactPortals;