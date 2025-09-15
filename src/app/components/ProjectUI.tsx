'use client';

import React from 'react';

interface ProjectUIProps {
  activeProject: any;
  visitedProjects: Set<string>;
  totalProjects: number;
  projectIcons: Array<{ id: string; icon: string }>;
  onOpenProject: () => void;
}

const ProjectUI: React.FC<ProjectUIProps> = ({ 
  activeProject, 
  visitedProjects, 
  totalProjects,
  projectIcons,
  onOpenProject
}) => {
  return (
    <>
      {/* UI Overlay */}
      {activeProject && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '350px',
            border: `2px solid ${activeProject.color}`,
            zIndex: 1000,
            fontFamily: 'monospace',
          }}
        >
          <h2 style={{ margin: '0 0 10px 0', color: activeProject.color }}>
            {activeProject.icon} {activeProject.title}
          </h2>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
            {activeProject.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {activeProject.tech.map((tech: string) => (
              <span
                key={tech}
                style={{
                  background: activeProject.color,
                  padding: '3px 8px',
                  borderRadius: '5px',
                  fontSize: '12px',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
          {activeProject.url && (
            <div 
              style={{ 
                marginTop: '15px', 
                padding: '10px', 
                background: activeProject.color,
                borderRadius: '5px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              onClick={onOpenProject}
            >
              <strong>Press E to View Project →</strong>
            </div>
          )}
        </div>
      )}
      
      {/* Progress Counter */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          zIndex: 1000,
          fontFamily: 'monospace',
        }}
      >
        <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
          Projects Discovered
        </h3>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          {visitedProjects.size} / {totalProjects}
        </div>
        <div style={{ marginTop: '10px' }}>
          {projectIcons.map(p => (
            <span
              key={p.id}
              style={{
                fontSize: '20px',
                marginRight: '5px',
                opacity: visitedProjects.has(p.id) ? 1 : 0.3,
              }}
            >
              {p.icon}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectUI;