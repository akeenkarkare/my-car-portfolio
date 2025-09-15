'use client';

import React from 'react';
import ProjectZone from './ProjectZone';
import { Mesh } from 'three';

interface ProjectShowcaseProps {
  carRef: React.MutableRefObject<Mesh | null>;
  onProjectEnter: (project: any) => void;
  onProjectExit: () => void;
}

const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ carRef, onProjectEnter, onProjectExit }) => {
  const projects = [
    {
      id: 'asteroid',
      title: 'Asteroid Bot',
      description: 'Discord bot serving 70K+ users across 200+ servers',
      tech: ['Python', 'Discord.py', 'Heroku'],
      color: '#5865F2',
      icon: '🤖',
      url: 'https://github.com/akeenkarkare', // Update with actual project URL
      position: [35, 0, 30] as [number, number, number],
      rotation: [0, -Math.PI / 4, 0] as [number, number, number],
    },
    {
      id: 'exoplanet',
      title: 'AI Exoplanet Detector',
      description: 'ML model using JWST data to classify exoplanets',
      tech: ['Python', 'TensorFlow', 'Scikit-learn'],
      color: '#FF6B6B',
      icon: '🪐',
      url: 'https://github.com/akeenkarkare', // Update with actual project URL
      position: [-40, 0, 35] as [number, number, number],
      rotation: [0, Math.PI / 4, 0] as [number, number, number],
    },
    {
      id: 'stockalerter',
      title: 'StockAlerter',
      description: 'Real-time stock monitoring with technical indicators',
      tech: ['Python', 'Pandas', 'NumPy'],
      color: '#4ECDC4',
      icon: '📈',
      url: 'https://github.com/akeenkarkare', // Update with actual project URL
      position: [45, 0, -20] as [number, number, number],
      rotation: [0, Math.PI / 2, 0] as [number, number, number],
    },
    {
      id: 'yeetcode',
      title: 'YeetCode',
      description: 'Gamified LeetCode platform with leaderboards & duels',
      tech: ['React', 'Node.js', 'MongoDB'],
      color: '#95E1D3',
      icon: '🎮',
      url: 'https://github.com/akeenkarkare', // Update with actual project URL
      position: [30, 0, -45] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
    },
    {
      id: 'stunite',
      title: 'Stunite',
      description: 'Social matching app for Stony Brook students',
      tech: ['React Native', 'Supabase', 'JavaScript'],
      color: '#F38181',
      icon: '🎓',
      url: 'https://github.com/akeenkarkare', // Update with actual project URL
      position: [-45, 0, -25] as [number, number, number],
      rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    },
  ];

  return (
    <>
      {projects.map(project => (
        <ProjectZone
          key={project.id}
          position={project.position}
          rotation={project.rotation}
          project={project}
          carRef={carRef}
          onEnter={() => onProjectEnter(project)}
          onExit={onProjectExit}
        />
      ))}
    </>
  );
};

export default ProjectShowcase;

export const getProjects = () => [
  { id: 'asteroid', icon: '🤖' },
  { id: 'exoplanet', icon: '🪐' },
  { id: 'stockalerter', icon: '📈' },
  { id: 'yeetcode', icon: '🎮' },
  { id: 'stunite', icon: '🎓' },
];