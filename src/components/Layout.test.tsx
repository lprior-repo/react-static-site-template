import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Layout from './Layout';

const renderLayout = () => {
  return render(
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

describe('Layout', () => {
  it('renders the header component', () => {
    renderLayout();

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders the main content area', () => {
    renderLayout();

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the footer component', () => {
    renderLayout();

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    renderLayout();

    const header = screen.getByRole('banner');
    const main = screen.getByRole('main');
    const footer = screen.getByRole('contentinfo');

    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('applies correct CSS classes for layout', () => {
    renderLayout();

    const container = screen.getByRole('main').parentElement;
    expect(container).toHaveClass('min-h-screen', 'flex', 'flex-col');

    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex-grow');
  });

  it('includes site navigation in header', () => {
    renderLayout();

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('includes site title link in header', () => {
    renderLayout();

    expect(screen.getByText('React Static Site')).toBeInTheDocument();
  });

  it('includes navigation links in header', () => {
    renderLayout();

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('includes copyright in footer', () => {
    renderLayout();

    const copyrightElements = screen.getAllByText((_content, element) => {
      return (
        element?.textContent?.includes('React Static Site Template. All rights reserved') ?? false
      );
    });
    expect(copyrightElements[0]).toBeInTheDocument();
  });

  it('includes social links in footer', () => {
    renderLayout();

    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Twitter' })).toBeInTheDocument();
  });
});
