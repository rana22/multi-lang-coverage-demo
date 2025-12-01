export interface CoverageMetrics {
  lines?: number;
  statements?: number;
  branches?: number;
  functions?: number;
}

export interface ProjectCoverage {
  id: string;
  name: string;
  repo: string;
  coverage: CoverageMetrics;
  total: any;
}

export interface CoverageSummary {
  generatedAt?: string;
  projects: ProjectCoverage[];
}
