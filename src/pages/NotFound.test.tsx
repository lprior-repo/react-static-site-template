import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, expect, it } from 'vitest';
import NotFound from './NotFound';

const renderNotFound = () => {
  return render(
    <BrowserRouter>
      <HelmetProvider>
        <NotFound />
      </HelmetProvider>
    </BrowserRouter>
  );
};

describe('NotFound', () => {
  it('renders the 404 error code', () => {
    renderNotFound();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('displays the main error heading', () => {
    renderNotFound();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('shows the error message', () => {
    renderNotFound();
    expect(
      screen.getByText("Sorry, we couldn't find the page you're looking for.")
    ).toBeInTheDocument();
  });

  it('provides a link back to home', () => {
    renderNotFound();

    const homeLink = screen.getByRole('link', { name: 'Go back home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('provides a link to contact support', () => {
    renderNotFound();

    const contactLink = screen.getByRole('link', { name: /Contact support/ });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('has proper semantic structure', () => {
    renderNotFound();

    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('Page not found');

    // Check that both navigation links are present
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });

  it('displays the error code prominently', () => {
    renderNotFound();

    const errorCode = screen.getByText('404');
    expect(errorCode).toHaveClass('text-blue-600');
  });

  it('uses appropriate styling for the error page', () => {
    renderNotFound();

    const homeButton = screen.getByRole('link', { name: 'Go back home' });
    expect(homeButton).toHaveClass('bg-blue-600');
  });

  it('includes arrow indicator for contact link', () => {
    renderNotFound();

    const contactLink = screen.getByRole('link', { name: /Contact support/ });
    expect(contactLink.textContent).toContain('→');
  });
});
