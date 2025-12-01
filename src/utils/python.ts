import { ProjectCoverage } from "../types";

// coverage.py JSON -> unified coverage
export function parseCoveragePyJson(json: any): ProjectCoverage['coverage'] {
  const totals = json?.totals || {};
  const pctLines = typeof totals.percent_covered === 'number'
    ? totals.percent_covered
    : 0;

  // coverage.py does not directly expose "statements/branches/functions %" unless
  // you calculate them; for now we map:
  // - lines: percent_covered
  // - statements: approx = percent_covered
  // - branches/functions: left as 0 or same if you like
  return {
    lines: pctLines,
    statements: pctLines,
    branches: 0,
    functions: 0,
  };
}