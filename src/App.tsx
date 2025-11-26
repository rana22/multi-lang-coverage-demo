import React from 'react';
import { CoverageSummary, ProjectCoverage } from './types';
import { ProjectCoverageCard } from './components/ProjectCoverageCard';

const App: React.FC = () => {
  const [projects, setProjects] = React.useState<ProjectCoverage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState('');

  React.useEffect(() => {
    fetch('/coverage-summary.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load coverage-summary.json');
        return res.json();
      })
      .then((data: CoverageSummary) => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load coverage data');
        setLoading(false);
      });
  }, []);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.repo.toLowerCase().includes(filter.toLowerCase())
  );

  const avgCoverage =
    projects.length > 0
      ? projects.reduce((sum, p) => sum + p.coverage.lines, 0) / projects.length
      : 0;

  if (loading) {
    return <main style={{ padding: 24 }}>Loading coverage data…</main>;
  }

  if (error) {
    return <main style={{ padding: 24 }}>Error: {error}</main>;
  }

  return (
    <main
      style={{
        padding: 24,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        maxWidth: 960,
        margin: '0 auto',
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>Test Coverage Dashboard</h1>
        <p style={{ margin: 0, color: '#555' }}>
          Coverage overview for multiple React apps (data from CI).
        </p>
      </header>

      <section
        style={{
          display: 'flex',
          gap: 16,
          marginBottom: 24,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: '#777' }}>Apps tracked</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{projects.length}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#777' }}>Average line coverage</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>
            {avgCoverage.toFixed(1)}%
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <input
            type="text"
            placeholder="Filter by name or repo…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: 4,
              border: '1px solid #ccc',
              minWidth: 220,
            }}
          />
        </div>
      </section>

      <section>
        {filtered.length === 0 ? (
          <p>No apps match the current filter.</p>
        ) : (
          filtered.map((project) => (
            <ProjectCoverageCard key={project.id} project={project} />
          ))
        )}
      </section>
    </main>
  );
};

export default App;
