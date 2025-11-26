// react-app/src/ProjectCoverageCard.tsx
import React from 'react';

export interface ProjectCoverageCardProps {
  name: string;
  language: string;
  coverage: number; // 0–100
}

export const ProjectCoverageCard: React.FC<ProjectCoverageCardProps> = ({
  name,
  language,
  coverage,
}) => {
  const color =
    coverage >= 80 ? 'green' : coverage >= 50 ? 'orange' : 'red';

  return (
    <div
      data-testid="coverage-card"
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <h2>{name}</h2>
      <p>Language: {language}</p>
      <p>
        Coverage:{' '}
        <span style={{ color }} data-testid="coverage-value">
          {coverage}%
        </span>
      </p>
    </div>
  );
};
