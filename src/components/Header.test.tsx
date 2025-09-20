import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Header from './Header';

const renderHeader = (initialEntries = ['/']) => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header', () => {
  it('renders the site title', () => {
    renderHeader();
    expect(screen.getByText('React Static Site')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderHeader();

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('has proper navigation structure', () => {
    renderHeader();

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4); // Site title + 3 nav links
  });

  it('includes mobile menu button', () => {
    renderHeader();

    const mobileMenuButton = screen.getByRole('button', { name: /open menu/i });
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it('has accessible navigation', () => {
    renderHeader();

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // Check that all links have proper text
    const homeLink = screen.getByRole('link', { name: /home/i });
    const aboutLink = screen.getByRole('link', { name: /about/i });
    const contactLink = screen.getByRole('link', { name: /contact/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });
});