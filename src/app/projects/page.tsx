'use client';

import React from 'react';
import { useRouter } from 'next/navigation';


export default function ProjectsPage() {
  const router = useRouter();
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>My Projects</h1>
      <p>This is a sample page for debugging navigation to /projects.</p>
      <button
        onClick={() => router.push('/')}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          marginTop: '1rem',
          cursor: 'pointer',
        }}
      >
        Back to Main
      </button>
    </main>
  );
}