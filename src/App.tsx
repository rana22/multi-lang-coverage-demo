import React from 'react';
import { COVERAGE_SOURCES } from './config/projects';
import { ProjectCoverageCard } from './components/ProjectCoverageCard';

interface CoveragePayload {
  projectId: string;
  name: string;
  language: string;
  repo: string;
  coverage: {
    lines: number;
    statements: number;
    branches: number;
    functions: number;
  };
  generatedAt?: string;
  commit?: string;
  total: any
}

const App: React.FC = () => {
  const [projects, setProjects] = React.useState<CoveragePayload[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const results: CoveragePayload[] = [];

        for (const src of COVERAGE_SOURCES) {
          try {
            const res = await fetch(src.url, { cache: 'no-store' });
            if (!res.ok) throw new Error(`Failed ${src.id}: ${res.status}`);
            const data = (await res.json()) as CoveragePayload;
            results.push({
              ...src,
              ...data,
              coverage: {
                lines: data?.total?.lines?.pct,
                statements: data?.total?.statements?.pct,
                branches: data?.total?.branches?.pct,
                functions: data?.total?.functions?.pct,
              }
            });
          } catch (e) {
            console.error('Error loading coverage for', src.id, e);
          }
        }
        console.log(results);
        setProjects(results);
        setLoading(false);
      } catch (e: any) {
        console.error(e);
        setError('Failed to load coverage data');
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <main style={{ padding: 24 }}>Loading coverage…</main>;
  if (error) return <main style={{ padding: 24 }}>Error: {error}</main>;

  // Render cards from `projects`
  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1>Multi-project Coverage Dashboard</h1>
      <p>React, Java, Python coverage aggregated from project-specific CI.</p>
      {projects.map((p) => (
        <ProjectCoverageCard
          key={p.projectId}
          project={{
            id: p.projectId,
            name: p.name,
            repo: p.repo,
            coverage: p.coverage,
          }}
        />
      ))}
    </main>
  );
};

export default App;
