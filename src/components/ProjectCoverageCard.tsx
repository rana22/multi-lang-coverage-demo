// import React from 'react';
// import { ProjectCoverage } from '../types';

// interface Props {
//   project: ProjectCoverage;
// }

// function getColor(pct: number): string {
//   if (pct >= 90) return '#16a34a'; // green-600
//   if (pct >= 75) return '#f59e0b'; // amber-500
//   return '#dc2626';               // red-600
// }

// export const ProjectCoverageCard: React.FC<Props> = ({ project }) => {
//   const { name, repo, coverage } = project;
//   const overall = coverage.lines ?? 0;
//   const overallColor = getColor(overall);

//   return (
//     <article
//       style={{
//         borderRadius: 12,
//         padding: 20,
//         background: 'white',
//         border: '1px solid rgba(148,163,184,0.35)', // slate-400/35
//         boxShadow: '0 8px 20px rgba(15,23,42,0.04)', // soft
//         transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
//       }}
//       onMouseEnter={(e) => {
//         const el = e.currentTarget as HTMLElement;
//         el.style.transform = 'translateY(-2px)';
//         el.style.boxShadow = '0 14px 30px rgba(15,23,42,0.10)';
//         el.style.borderColor = 'rgba(59,130,246,0.4)'; // blue-500/40
//       }}
//       onMouseLeave={(e) => {
//         const el = e.currentTarget as HTMLElement;
//         el.style.transform = 'translateY(0)';
//         el.style.boxShadow = '0 8px 20px rgba(15,23,42,0.04)';
//         el.style.borderColor = 'rgba(148,163,184,0.35)';
//       }}
//     >
//       {/* Header row */}
//       <header
//         style={{
//           display: 'flex',
//           alignItems: 'flex-start',
//           gap: 12,
//           marginBottom: 16,
//         }}
//       >
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <h2
//             style={{
//               margin: 0,
//               fontSize: 18,
//               fontWeight: 600,
//               color: '#0f172a', // slate-900
//               textOverflow: 'ellipsis',
//               overflow: 'hidden',
//               whiteSpace: 'nowrap',
//             }}
//             title={name}
//           >
//             {name}
//           </h2>
//           {repo && (
//             <p
//               style={{
//                 margin: '4px 0 0',
//                 fontSize: 12,
//                 color: '#64748b', // slate-500
//                 textOverflow: 'ellipsis',
//                 overflow: 'hidden',
//                 whiteSpace: 'nowrap',
//               }}
//               title={repo}
//             >
//               {repo}
//             </p>
//           )}
//         </div>

//         {/* Overall pill */}
//         <div
//           style={{
//             padding: '4px 10px',
//             borderRadius: 999,
//             border: `1px solid ${overallColor}`,
//             color: overallColor,
//             fontSize: 12,
//             fontWeight: 600,
//             background: 'rgba(15,23,42,0.02)',
//             whiteSpace: 'nowrap',
//           }}
//         >
//           {overall.toFixed(1)}% lines
//         </div>
//       </header>

//       {/* Progress bar */}
//       <div style={{ marginBottom: 12 }}>
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             fontSize: 11,
//             color: '#64748b',
//             marginBottom: 4,
//           }}
//         >
//           <span>Line coverage</span>
//           <span>{overall.toFixed(1)}%</span>
//         </div>
//         <div
//           style={{
//             width: '100%',
//             height: 8,
//             borderRadius: 999,
//             background: '#e2e8f0', // slate-200
//             overflow: 'hidden',
//           }}
//         >
//           <div
//             style={{
//               width: `${Math.min(100, Math.max(0, overall))}%`,
//               height: '100%',
//               background: overallColor,
//               transition: 'width 160ms ease-out',
//             }}
//           />
//         </div>
//       </div>

//       {/* Metrics badges */}
//       <section
//         style={{
//           display: 'flex',
//           flexWrap: 'wrap',
//           gap: 8,
//           marginTop: 8,
//         }}
//       >
//         <Metric label="Statements" value={coverage.statements} />
//         <Metric label="Branches" value={coverage.branches} />
//         <Metric label="Functions" value={coverage.functions} />
//         <Metric label="Lines" value={coverage.lines} />
//       </section>
//     </article>
//   );
// };

// interface MetricProps {
//   label: string;
//   value: number;
// }

// const Metric: React.FC<MetricProps> = ({ label, value }) => (
//   <div
//     style={{
//       borderRadius: 999,
//       padding: '4px 10px',
//       background: '#f8fafc', // slate-50
//       border: '1px solid #e2e8f0',
//       fontSize: 11,
//       display: 'flex',
//       alignItems: 'center',
//       gap: 6,
//       color: '#0f172a',
//     }}
//   >
//     <span style={{ color: '#64748b' }}>{label}</span>
//     <span style={{ fontWeight: 600 }}>
//       {Number.isFinite(value) ? value.toFixed(1) : '0.0'}%
//     </span>
//   </div>
// );

import React from 'react';
import { ProjectCoverage } from '../types';
import XMLView from './XMLView';

interface Props {
  project: ProjectCoverage;
}

function getColor(pct: number): string {
  if (pct >= 90) return '#16a34a'; // green-600
  if (pct >= 75) return '#f59e0b'; // amber-500
  return '#dc2626';               // red-600
}

const languageLabel = (lang?: string) => {
  if (!lang) return 'Unknown';
  switch (lang.toLowerCase()) {
    case 'java':
      return 'Java (Spring Boot)';
    case 'react':
    case 'typescript':
    case 'javascript':
      return 'React';
    case 'python':
      return 'Python';
    default:
      return lang;
  }
};

export const ProjectCoverageCard: React.FC<Props> = ({ project }) => {
  const { 
    name, 
    repo, 
    coverage, 
    language, 
    reportUrl, 
    isMarkdown = false,
    fileType
  } = project;

  const overall = coverage.lines;
  const hasNumericCoverage = typeof overall === 'number';
  const overallColor = hasNumericCoverage ? getColor(overall!) : '#6b7280';

  return (
    <article
      style={{
        borderRadius: 12,
        padding: 20,
        background: 'white',
        border: '1px solid rgba(148,163,184,0.35)',
        boxShadow: '0 8px 20px rgba(15,23,42,0.04)',
        transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-2px)';
        el.style.boxShadow = '0 14px 30px rgba(15,23,42,0.10)';
        el.style.borderColor = 'rgba(59,130,246,0.4)';
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
              color: '#0f172a',
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
                color: '#64748b',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
              title={repo}
            >
              {repo}
            </p>
          )}
          {/* Language pill */}
          {language && (
            <span
              style={{
                display: 'inline-block',
                marginTop: 6,
                padding: '2px 8px',
                borderRadius: 999,
                border: '1px solid #e2e8f0',
                fontSize: 11,
                color: '#475569',
                background: '#f8fafc',
              }}
            >
              {languageLabel(language)}
            </span>
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
          {hasNumericCoverage ? `${overall!.toFixed(1)}% lines` : 'Coverage N/A'}
        </div>
      </header>

      {/* Progress bar / message */}
      {hasNumericCoverage ? (
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
            <span>{overall!.toFixed(1)}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: 8,
              borderRadius: 999,
              background: '#e2e8f0',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.max(0, overall!))}%`,
                height: '100%',
                background: overallColor,
                transition: 'width 160ms ease-out',
              }}
            />
          </div>
        </div>
      ) : (
        <p
          style={{
            fontSize: 12,
            color: '#6b7280',
            marginBottom: 12,
          }}
        >
          Numeric coverage not available; see full HTML report.
        </p>
      )}

      {/* Metrics badges (only if we have numbers) */}
      {hasNumericCoverage && (
        <section
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 8,
            marginBottom: 12,
          }}
        >
          <Metric label="Statements" value={coverage.statements} />
          <Metric label="Branches" value={coverage.branches} />
          <Metric label="Functions" value={coverage.functions} />
          <Metric label="Lines" value={coverage.lines} />
        </section>
      )}

      {/* Link to HTML report */}
      {reportUrl && (
        <div style={{ marginTop: 8 }}>
          <a
            href={reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              padding: '6px 10px',
              borderRadius: 999,
              border: '1px solid #3b82f6',
              color: '#1d4ed8',
              textDecoration: 'none',
            }}
          >
            View coverage report
            <span style={{ fontSize: 10 }}>↗</span>
          </a>
        </div>
      )}
    </article>
  );
};

interface MetricProps {
  label: string;
  value?: number;
}

const Metric: React.FC<MetricProps> = ({ label, value }) => (
  <div
    style={{
      borderRadius: 999,
      padding: '4px 10px',
      background: '#f8fafc',
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
      {typeof value === 'number' ? value.toFixed(1) : 'N/A'}%
    </span>
  </div>
);

