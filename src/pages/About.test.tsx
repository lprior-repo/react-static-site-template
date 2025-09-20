import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { describe, expect, it } from 'vitest';
import About from './About';

const renderAbout = () => {
  return render(
    <HelmetProvider>
      <About />
    </HelmetProvider>
  );
};

describe('About', () => {
  it('renders the main heading', () => {
    renderAbout();
    expect(screen.getByText('Built for Modern Development')).toBeInTheDocument();
  });

  it('displays the page subtitle', () => {
    renderAbout();
    expect(screen.getByText('About This Template')).toBeInTheDocument();
  });

  it('shows the introduction text', () => {
    renderAbout();
    expect(
      screen.getByText(/This React static site template provides everything you need/)
    ).toBeInTheDocument();
  });

  it('displays all key features', () => {
    renderAbout();

    expect(screen.getByText('TypeScript Integration.')).toBeInTheDocument();
    expect(screen.getByText('Vite Build System.')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive Testing.')).toBeInTheDocument();
    expect(screen.getByText('AWS Infrastructure.')).toBeInTheDocument();
  });

  it('shows architecture section', () => {
    renderAbout();
    expect(screen.getByText('Architecture')).toBeInTheDocument();
    expect(
      screen.getByText(/The template follows a clean, modular architecture/)
    ).toBeInTheDocument();
  });

  it('shows deployment section', () => {
    renderAbout();
    expect(screen.getByText('Deployment')).toBeInTheDocument();
    expect(
      screen.getByText(/Deployment is handled through a comprehensive CI\/CD pipeline/)
    ).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    renderAbout();

    // Check for main headings
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('Built for Modern Development');

    // Check for section headings
    const keyFeaturesHeading = screen.getByRole('heading', { level: 2, name: 'Key Features' });
    expect(keyFeaturesHeading).toBeInTheDocument();

    const architectureHeading = screen.getByRole('heading', { level: 2, name: 'Architecture' });
    expect(architectureHeading).toBeInTheDocument();

    const deploymentHeading = screen.getByRole('heading', { level: 2, name: 'Deployment' });
    expect(deploymentHeading).toBeInTheDocument();
  });

  it('contains feature list with proper structure', () => {
    renderAbout();

    const featureList = screen.getByRole('list');
    expect(featureList).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
  });
});
