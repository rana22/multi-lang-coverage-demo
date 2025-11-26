// react-app/src/App.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ProjectCoverageCard } from './ProjectCoverageCard';

describe('App', () => {
  it('renders dashboard title', () => {
    render(<App />);
    expect(
      screen.getByText(/Multi-language Coverage Dashboard/i)
    ).toBeInTheDocument();
  });

  it('renders at least one project card', () => {
    render(<App />);
    const cards = screen.getAllByTestId('coverage-card');
    expect(cards.length).toBeGreaterThan(0);
  });
});

describe('ProjectCoverageCard', () => {
  it('shows the project name and coverage', () => {
    render(
      <ProjectCoverageCard
        name="Java Spring API"
        language="Java"
        coverage={85}
      />
    );

    expect(screen.getByText(/Java Spring API/)).toBeInTheDocument();
    expect(screen.getByText(/Language: Java/)).toBeInTheDocument();

    const value = screen.getByTestId('coverage-value');
    expect(value).toHaveTextContent('85%');
  });

  it('uses red color for low coverage', () => {
    render(
      <ProjectCoverageCard
        name="Python Worker"
        language="Python"
        coverage={40}
      />
    );

    const value = screen.getByTestId('coverage-value') as HTMLSpanElement;
    expect(value.style.color).toBe('red');
  });
});
