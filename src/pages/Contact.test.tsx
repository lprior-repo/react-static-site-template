import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Contact from './Contact';

// Mock alert to avoid actual alerts in tests
const mockAlert = vi.fn();
global.alert = mockAlert;

// Mock console.log to test form submission
const mockConsoleLog = vi.fn();
global.console.log = mockConsoleLog;

const renderContact = () => {
  return render(
    <HelmetProvider>
      <Contact />
    </HelmetProvider>
  );
};

describe('Contact', () => {
  beforeEach(() => {
    mockAlert.mockClear();
    mockConsoleLog.mockClear();
  });

  it('renders the contact form', () => {
    renderContact();

    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText(/Have questions about the template/)).toBeInTheDocument();
  });

  it('displays all form fields', () => {
    renderContact();

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
  });

  it('allows user to fill out the form', async () => {
    const user = userEvent.setup();
    renderContact();

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const messageInput = screen.getByLabelText(/Message/i);

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a test message');

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(messageInput).toHaveValue('This is a test message');
  });

  it('submits the form with correct data', async () => {
    const user = userEvent.setup();
    renderContact();

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole('button', { name: 'Send Message' });

    await user.type(nameInput, 'Jane Smith');
    await user.type(emailInput, 'jane@example.com');
    await user.type(messageInput, 'Hello from the test!');

    await user.click(submitButton);

    await waitFor(
      () => {
        expect(mockConsoleLog).toHaveBeenCalledWith('Form submitted:', {
          name: 'Jane Smith',
          email: 'jane@example.com',
          message: 'Hello from the test!',
        });
      },
      { timeout: 3000 }
    );

    await waitFor(
      () => {
        expect(mockAlert).toHaveBeenCalledWith('Thank you for your message! This is a demo form.');
      },
      { timeout: 3000 }
    );
  });

  it('has a working form that can be submitted', async () => {
    const user = userEvent.setup();
    renderContact();

    const form = screen.getByRole('button', { name: 'Send Message' }).closest('form');
    expect(form).toBeInTheDocument();

    // Fill out required fields
    await user.type(screen.getByLabelText(/Name/i), 'Test User');
    await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Message/i), 'Test message');

    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test message')).toBeInTheDocument();
  });

  it('displays additional contact information', () => {
    renderContact();

    expect(screen.getByText('Other Ways to Reach Us')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();

    const githubLink = screen.getByRole('link', { name: /View the source code/ });
    expect(githubLink).toHaveAttribute('href', 'https://github.com');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has proper form validation attributes', () => {
    renderContact();

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const messageInput = screen.getByLabelText(/Message/i);

    expect(nameInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(messageInput).toHaveAttribute('required');
  });

  it('has proper semantic structure', () => {
    renderContact();

    const mainHeading = screen.getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('Contact Us');

    const form = screen.getByRole('button', { name: 'Send Message' }).closest('form');
    expect(form).toBeInTheDocument();

    // Check for description list content
    expect(screen.getByText('Other Ways to Reach Us')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
  });
});
