import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  beforeEach(() => {
    // Mock Date to ensure consistent year in tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the footer element', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('displays the copyright notice with current year', () => {
    render(<Footer />);

    // Use getAllByText and check first element since it might render multiple times
    const copyrightElements = screen.getAllByText((content, element) => {
      return (
        element?.textContent?.includes('React Static Site Template. All rights reserved') ?? false
      );
    });
    expect(copyrightElements[0]).toBeInTheDocument();
  });

  it('displays GitHub social link', () => {
    render(<Footer />);

    const githubLink = screen.getByRole('link', { name: 'GitHub' });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays Twitter social link', () => {
    render(<Footer />);

    const twitterLink = screen.getByRole('link', { name: 'Twitter' });
    expect(twitterLink).toBeInTheDocument();
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com');
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has proper accessibility labels for social links', () => {
    render(<Footer />);

    const githubLink = screen.getByRole('link', { name: 'GitHub' });
    const twitterLink = screen.getByRole('link', { name: 'Twitter' });

    expect(githubLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();
  });

  it('contains SVG icons for social links', () => {
    render(<Footer />);

    const githubSvg = screen.getByRole('link', { name: 'GitHub' }).querySelector('svg');
    const twitterSvg = screen.getByRole('link', { name: 'Twitter' }).querySelector('svg');

    expect(githubSvg).toBeInTheDocument();
    expect(twitterSvg).toBeInTheDocument();
  });

  it('uses current year dynamically', () => {
    render(<Footer />);

    // Check that the year is included in the copyright text
    const currentYear = new Date().getFullYear();
    const copyrightElements = screen.getAllByText((content, element) => {
      return (
        element?.textContent?.includes(
          `${currentYear} React Static Site Template. All rights reserved`
        ) ?? false
      );
    });
    expect(copyrightElements[0]).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-gray-800');

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2); // GitHub and Twitter
  });

  it('applies correct styling classes', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-gray-800');

    const githubLink = screen.getByRole('link', { name: 'GitHub' });
    expect(githubLink).toHaveClass('text-gray-400', 'hover:text-gray-300');

    const twitterLink = screen.getByRole('link', { name: 'Twitter' });
    expect(twitterLink).toHaveClass('text-gray-400', 'hover:text-gray-300');
  });
});
