// react-app/src/App.tsx
import React from 'react';
import { ProjectCoverageCard } from './ProjectCoverageCard';

interface Project {
  name: string;
  language: string;
  coverage: number;
}

const demoProjects: Project[] = [
  { name: 'Java Spring API', language: 'Java', coverage: 78 },
  { name: 'Node Express Service', language: 'Node.js', coverage: 65 },
  { name: 'React Dashboard', language: 'JavaScript', coverage: 88 },
  { name: 'Python Worker', language: 'Python', coverage: 55 },
];

const App: React.FC = () => {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Multi-language Coverage Dashboard</h1>
      <p>
        Demo view of coverage for Java, Node.js, React, and Python projects.
      </p>
      <div style={{ marginTop: 24 }}>
        {demoProjects.map((p) => (
          <ProjectCoverageCard
            key={p.name}
            name={p.name}
            language={p.language}
            coverage={p.coverage}
          />
        ))}
      </div>
    </main>
  );
};

export default App;
