import React from 'react';
import { ProjectCoverage } from '../types';

interface Props {
  project: ProjectCoverage;
}

function getColor(pct: number): string {
  if (pct >= 90) return 'green';
  if (pct >= 75) return 'orange';
  return 'red';
}

export const ProjectCoverageCard: React.FC<Props> = ({ project }) => {
  const { name, repo, coverage } = project;
  const overall = coverage.lines;

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0 }}>{name}</h2>
          <p style={{ margin: '4px 0', color: '#555', fontSize: 13 }}>{repo}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: getColor(overall),
            }}
          >
            {overall.toFixed(1)}%
          </div>
          <div style={{ fontSize: 12, color: '#777' }}>Lines covered</div>
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 8,
          fontSize: 13,
        }}
      >
        <Metric label="Statements" value={coverage.statements} />
        <Metric label="Branches" value={coverage.branches} />
        <Metric label="Functions" value={coverage.functions} />
        <Metric label="Lines" value={coverage.lines} />
      </div>
    </div>
  );
};

interface MetricProps {
  label: string;
  value: number;
}

const Metric: React.FC<MetricProps> = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 12, color: '#777' }}>{label}</div>
    <div style={{ fontWeight: 500 }}>{value.toFixed(1)}%</div>
  </div>
);
