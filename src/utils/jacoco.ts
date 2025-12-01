import { CoverageMetrics } from "../types";

function parseJacocoXml(xmlText: string): CoverageMetrics {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'application/xml');

  const counters = Array.from(doc.getElementsByTagName('counter'));
  const coverage: CoverageMetrics = {};

  const typeMap: Record<string, keyof CoverageMetrics> = {
    INSTRUCTION: 'statements',
    LINE: 'lines',
    BRANCH: 'branches',
    METHOD: 'functions',
  };

  const pct = (missed: number, covered: number) => {
    const total = missed + covered;
    if (!total) return 0;
    return (covered / total) * 100;
  };

  for (const c of counters) {
    const type = c.getAttribute('type') || '';
    const key = typeMap[type];
    if (!key) continue;

    const missed = Number(c.getAttribute('missed') || '0');
    const covered = Number(c.getAttribute('covered') || '0');

    coverage[key] = pct(missed, covered);
  }

  return coverage;
};
