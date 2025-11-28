// import React from 'react';
// import { ProjectCoverage } from '../types';

// interface Props {
//   project: ProjectCoverage;
// }

// function getColor(pct: number): string {
//   if (pct >= 90) return 'green';
//   if (pct >= 75) return 'orange';
//   return 'red';
// }

// export const ProjectCoverageCard: React.FC<Props> = ({ project }) => {
//   const { name, repo, coverage } = project;
//   const overall = coverage.lines;

//   return (
//     <div
//       style={{
//         border: '1px solid #ddd',
//         borderRadius: 8,
//         padding: 16,
//         marginBottom: 16,
//         boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
//       }}
//     >
//       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//         <div>
//           <h2 style={{ margin: 0 }}>{name}</h2>
//           <p style={{ margin: '4px 0', color: '#555', fontSize: 13 }}>{repo}</p>
//         </div>
//         <div style={{ textAlign: 'right' }}>
//           <div
//             style={{
//               fontSize: 24,
//               fontWeight: 600,
//               color: getColor(overall),
//             }}
//           >
//             {overall.toFixed(1)}%
//           </div>
//           <div style={{ fontSize: 12, color: '#777' }}>Lines covered</div>
//         </div>
//       </div>

//       <div
//         style={{
//           marginTop: 12,
//           display: 'grid',
//           gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
//           gap: 8,
//           fontSize: 13,
//         }}
//       >
//         <Metric label="Statements" value={coverage.statements} />
//         <Metric label="Branches" value={coverage.branches} />
//         <Metric label="Functions" value={coverage.functions} />
//         <Metric label="Lines" value={coverage.lines} />
//       </div>
//     </div>
//   );
// };

// interface MetricProps {
//   label: string;
//   value: number;
// }

// const Metric: React.FC<MetricProps> = ({ label, value }) => (
//   <div>
//     <div style={{ fontSize: 12, color: '#777' }}>{label}</div>
//     <div style={{ fontWeight: 500 }}>{value.toFixed(1)}%</div>
//   </div>
// );

import React from 'react';
import { ProjectCoverage } from '../types';

interface Props {
  project: ProjectCoverage;
}

function getColor(pct: number): string {
  if (pct >= 90) return '#16a34a'; // green-600
  if (pct >= 75) return '#f59e0b'; // amber-500
  return '#dc2626';               // red-600
}

export const ProjectCoverageCard: React.FC<Props> = ({ project }) => {
  const { name, repo, coverage } = project;
  const overall = coverage.lines ?? 0;
  const overallColor = getColor(overall);

  return (
    <article
      style={{
        borderRadius: 12,
        padding: 20,
        background: 'white',
        border: '1px solid rgba(148,163,184,0.35)', // slate-400/35
        boxShadow: '0 8px 20px rgba(15,23,42,0.04)', // soft
        transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-2px)';
        el.style.boxShadow = '0 14px 30px rgba(15,23,42,0.10)';
        el.style.borderColor = 'rgba(59,130,246,0.4)'; // blue-500/40
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = '0 8px 20px rgba(15,23,42,0.04)';
        el.style.borderColor = 'rgba(148,163,184,0.35)';
      }}
    >
      {/* Header row */}
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              color: '#0f172a', // slate-900
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
            title={name}
          >
            {name}
          </h2>
          {repo && (
            <p
              style={{
                margin: '4px 0 0',
                fontSize: 12,
                color: '#64748b', // slate-500
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
              title={repo}
            >
              {repo}
            </p>
          )}
        </div>

        {/* Overall pill */}
        <div
          style={{
            padding: '4px 10px',
            borderRadius: 999,
            border: `1px solid ${overallColor}`,
            color: overallColor,
            fontSize: 12,
            fontWeight: 600,
            background: 'rgba(15,23,42,0.02)',
            whiteSpace: 'nowrap',
          }}
        >
          {overall.toFixed(1)}% lines
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: '#64748b',
            marginBottom: 4,
          }}
        >
          <span>Line coverage</span>
          <span>{overall.toFixed(1)}%</span>
        </div>
        <div
          style={{
            width: '100%',
            height: 8,
            borderRadius: 999,
            background: '#e2e8f0', // slate-200
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, overall))}%`,
              height: '100%',
              background: overallColor,
              transition: 'width 160ms ease-out',
            }}
          />
        </div>
      </div>

      {/* Metrics badges */}
      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 8,
        }}
      >
        <Metric label="Statements" value={coverage.statements} />
        <Metric label="Branches" value={coverage.branches} />
        <Metric label="Functions" value={coverage.functions} />
        <Metric label="Lines" value={coverage.lines} />
      </section>
    </article>
  );
};

interface MetricProps {
  label: string;
  value: number;
}

const Metric: React.FC<MetricProps> = ({ label, value }) => (
  <div
    style={{
      borderRadius: 999,
      padding: '4px 10px',
      background: '#f8fafc', // slate-50
      border: '1px solid #e2e8f0',
      fontSize: 11,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: '#0f172a',
    }}
  >
    <span style={{ color: '#64748b' }}>{label}</span>
    <span style={{ fontWeight: 600 }}>
      {Number.isFinite(value) ? value.toFixed(1) : '0.0'}%
    </span>
  </div>
);

