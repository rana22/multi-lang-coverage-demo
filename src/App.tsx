import React from 'react';
import { COVERAGE_SOURCES } from './config/projects';
import { ProjectCoverageCard } from './components/ProjectCoverageCard';
import { parseJacocoXml } from './utils/jacoco';
import { parseCoveragePyJson } from './utils/python';

export interface CoverageMetrics {
  lines?: number;
  statements?: number;
  branches?: number;
  functions?: number;
}

interface CoveragePayload {
  projectId: string;
  name?: string;
  language?: string;
  repo?: string;
  reportUrl?: string;     // link to HTML coverage report
  coverage?: CoverageMetrics;
  generatedAt?: string;
  commit?: string;
  total?: any;
  isMarkdown?: boolean;
  fileType?: string;
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
            if (src?.language === 'python') {
              const res = await fetch(src.url, { cache: 'no-store' });
              if (!res.ok) throw new Error(`coverage.py JSON fetch failed: ${res.status}`);
              const data = await res.json();
              const cov = parseCoveragePyJson(data);
              results.push({
                projectId: src.id,
                name: src.name,
                repo: src.repo,
                language: src.language ?? 'python',
                reportUrl: src.url,
                coverage: cov,
              });
              continue;
            }

            if(src?.fileType === 'xml') {
              const res = await fetch(src.url, { cache: 'no-store' });
              if (!res.ok) {
                throw new Error(`JaCoCo XML fetch failed for ${src.id}: ${res.status}`);
              }
              const xmlText = await res.text();
              const cov = parseJacocoXml(xmlText);

              results.push({
                ...src,
                reportUrl:  src.url,     // link to HTML coverage report
                generatedAt: '',
                projectId: src.id,
                name: src.name,
                repo: src.repo,
                language: src.language ?? 'java',
                // link to full HTML report if you have it (optional)
                coverage: cov,
              });
              continue

            }
            const res = await fetch(src.url, { cache: 'no-store' });
            if (!res.ok) throw new Error(`Failed ${src.id}: ${res.status}`);
            const data = (await res.json()) as CoveragePayload;
            console.log(data);
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
            isMarkdown: p.isMarkdown,
            reportUrl: p.reportUrl,
            fileType: p.fileType,
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

// import React from 'react';
// import { COVERAGE_SOURCES } from './config/projects';
// import { ProjectCoverageCard } from './components/ProjectCoverageCard';

// interface CoveragePayloadFromJson {
//   total: any;
//   // other fields from JSON...
// }

// interface ProjectState {
//   projectId: string;
//   name: string;
//   repo: string;
//   language?: string;
//   reportUrl?: string;
//   coverage: {
//     lines?: number;
//     statements?: number;
//     branches?: number;
//     functions?: number;
//   };
// }

// const App: React.FC = () => {
//   const [projects, setProjects] = React.useState<ProjectState[]>([]);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState<string | null>(null);
//   const [filter, setFilter] = React.useState('');

//   React.useEffect(() => {
//     async function load() {
//       try {
//         const results: ProjectState[] = [];

//         for (const src of COVERAGE_SOURCES) {
//           const isJson = src.url.endsWith('.json');

//           if (isJson) {
//             // React / JS/TS apps with JSON coverage
//             try {
//               const res = await fetch(src.url, { cache: 'no-store' });
//               if (!res.ok) throw new Error(`Failed ${src.id}: ${res.status}`);
//               const data = (await res.json()) as CoveragePayloadFromJson;

//               results.push({
//                 projectId: src.id,
//                 name: src.name,
//                 repo: src.repo,
//                 language: src.language,
//                 reportUrl: src.url, // optional: still link to JSON or another HTML from JSON
//                 isMarkdown: data.isMarkdown,
//                 coverage: {
//                   lines: data?.total?.lines?.pct ?? 0,
//                   statements: data?.total?.statements?.pct ?? 0,
//                   branches: data?.total?.branches?.pct ?? 0,
//                   functions: data?.total?.functions?.pct ?? 0,
//                 },
//               });
//             } catch (e) {
//               console.error('Error loading coverage JSON for', src.id, e);
//             }
//           } else {
//             // Java / others with HTML-only coverage
//             results.push({
//               projectId: src.id,
//               name: src.name,
//               repo: src.repo,
//               language: src.language,
//               reportUrl: src.url,
//               coverage: {}, // no numeric metrics
//             });
//           }
//         }

//         setProjects(results);
//         setLoading(false);
//       } catch (e: any) {
//         console.error(e);
//         setError('Failed to load coverage data');
//         setLoading(false);
//       }
//     }

//     load();
//   }, []);

//   const avgCoverage =
//     projects.filter((p) => typeof p.coverage.lines === 'number').length > 0
//       ? projects
//           .filter((p) => typeof p.coverage.lines === 'number')
//           .reduce((sum, p) => sum + (p.coverage.lines || 0), 0) /
//         projects.filter((p) => typeof p.coverage.lines === 'number').length
//       : 0;

//   if (loading) {
//     return (
//       <div
//         style={{
//           minHeight: '100vh',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
//           color: '#475569',
//         }}
//       >
//         Loading coverage…
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         style={{
//           minHeight: '100vh',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
//           color: '#b91c1c',
//         }}
//       >
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         minHeight: '100vh',
//         background: '#f1f5f9',
//         fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
//       }}
//     >
//       <main
//         style={{
//           maxWidth: 1100,
//           margin: '0 auto',
//           padding: '24px 16px 40px',
//         }}
//       >
//         {/* header & filter identical to previous styled version, keeping it short here */}
//         <section
//           style={{
//             background: 'white',
//             borderRadius: 16,
//             padding: 20,
//             marginBottom: 24,
//             border: '1px solid #e2e8f0',
//             boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
//           }}
//         >
//           <div
//             style={{
//               display: 'flex',
//               flexWrap: 'wrap',
//               gap: 16,
//               alignItems: 'center',
//               marginBottom: 16,
//             }}
//           >
//             <div style={{ flex: '1 1 220px', minWidth: 0 }}>
//               <h1
//                 style={{
//                   margin: 0,
//                   fontSize: 24,
//                   fontWeight: 650,
//                   color: '#0f172a',
//                 }}
//               >
//                 Multi-Project Coverage Dashboard
//               </h1>
//               <p
//                 style={{
//                   margin: '4px 0 0',
//                   fontSize: 13,
//                   color: '#64748b',
//                 }}
//               >
//                 Aggregated unit test coverage across React, Java, and Python
//                 services.
//               </p>
//             </div>

//             <div
//               style={{
//                 display: 'flex',
//                 gap: 16,
//                 flexWrap: 'wrap',
//               }}
//             >
//               <Stat label="Projects" value={projects.length.toString()} />
//               <Stat
//                 label="Avg line coverage"
//                 value={`${avgCoverage.toFixed(1)}%`}
//               />
//             </div>
//           </div>

//           <div style={{ marginTop: 8 }}>
//             <label
//               style={{
//                 fontSize: 12,
//                 color: '#64748b',
//                 display: 'block',
//                 marginBottom: 4,
//               }}
//             >
//               Filter by name, repo, or id
//             </label>
//             <input
//               type="text"
//               placeholder="e.g. admin, api, worker…"
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               style={{
//                 width: '100%',
//                 maxWidth: 360,
//                 padding: '8px 10px',
//                 borderRadius: 999,
//                 border: '1px solid #cbd5f5',
//                 fontSize: 13,
//                 outline: 'none',
//                 boxShadow: '0 0 0 1px transparent',
//                 background: '#ffffff',
//               }}
//               onFocus={(e) => {
//                 e.currentTarget.style.boxShadow =
//                   '0 0 0 1px rgba(59,130,246,0.6)';
//                 e.currentTarget.style.borderColor = 'rgba(59,130,246,0.7)';
//               }}
//               onBlur={(e) => {
//                 e.currentTarget.style.boxShadow = '0 0 0 1px transparent';
//                 e.currentTarget.style.borderColor = '#cbd5f5';
//               }}
//             />
//           </div>
//         </section>

//         <section
//           style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
//             gap: 16,
//           }}
//         >
//             {projects.map((p) => (
//               <ProjectCoverageCard
//                 key={p.projectId}
//                 project={{
//                   id: p.projectId,
//                   name: p.name,
//                   repo: p.repo,
//                   language: p.language,
//                   reportUrl: p.reportUrl,
//                   coverage: p.coverage,
//                 }}
//               />
//             ))}
//         </section>
//       </main>
//     </div>
//   );
// };

// interface StatProps {
//   label: string;
//   value: string;
// }

// const Stat: React.FC<StatProps> = ({ label, value }) => (
//   <div
//     style={{
//       minWidth: 120,
//       padding: '8px 12px',
//       borderRadius: 12,
//       background: '#f8fafc',
//       border: '1px solid #e2e8f0',
//     }}
//   >
//     <div
//       style={{
//         fontSize: 11,
//         fontWeight: 500,
//         color: '#64748b',
//         textTransform: 'uppercase',
//         letterSpacing: '0.03em',
//       }}
//     >
//       {label}
//     </div>
//     <div
//       style={{
//         fontSize: 18,
//         fontWeight: 600,
//         color: '#0f172a',
//         marginTop: 2,
//       }}
//     >
//       {value}
//     </div>
//   </div>
// );

// export default App;
