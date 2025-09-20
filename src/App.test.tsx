import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from './App';

const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

describe('App', () => {
  it('renders without crashing', () => {
    renderApp();
    expect(screen.getByText('React Static Site Template')).toBeInTheDocument();
  });

  it('displays the main navigation', () => {
    renderApp();

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('displays the hero section on home page', () => {
    renderApp();

    expect(screen.getByText('React Static Site Template')).toBeInTheDocument();
    expect(screen.getByText(/production-ready react static site template/i)).toBeInTheDocument();
  });

  it('has proper document structure', () => {
    renderApp();

    // Check for header
    expect(screen.getByRole('banner')).toBeInTheDocument();

    // Check for main content
    expect(screen.getByRole('main')).toBeInTheDocument();

    // Check for footer
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});