import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import Login from '../../pages/Auth/Login';
import { validateLoginForm } from '../../utils/validation';
import * as authService from '../../services/auth.service';
import { errorToast, successToast } from '../../utils/toast.config';

// Mock dependencies
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  },
  ToastContainer: jest.fn().mockReturnValue(null)
}));

jest.mock('../../utils/validation');
jest.mock('../../services/auth.service');

describe('Login Component Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it('should show error toast for validation errors', async () => {
    const validationErrors = [
      { field: 'email', message: 'Invalid email format' }
    ];
    
    (validateLoginForm as jest.Mock).mockReturnValue(validationErrors);

    renderLogin();
    
    // Fill out the form with invalid data
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(validateLoginForm).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        'Please fix the validation errors',
        expect.objectContaining(errorToast)
      );
    });
  });

  it('should show success toast on successful login', async () => {
    const mockResponse = {
      token: 'fake-token',
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      }
    };

    (validateLoginForm as jest.Mock).mockReturnValue([]);
    (authService.login as jest.Mock).mockResolvedValueOnce(mockResponse);

    renderLogin();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'ValidPass123!' }
    });

    // Submit the form
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Login successful! Redirecting...',
        expect.objectContaining({
          ...successToast,
          autoClose: 2000
        })
      );
    });
  });

  it('should show error message for invalid credentials', async () => {
    (validateLoginForm as jest.Mock).mockReturnValue([]);
    (authService.login as jest.Mock).mockRejectedValueOnce(
      new Error('Invalid credentials')
    );

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'WrongPass123!' }
    });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Invalid email or password',
        expect.objectContaining(errorToast)
      );
    });
  });

  it('should disable submit button while loading', async () => {
    (validateLoginForm as jest.Mock).mockReturnValue([]);
    (authService.login as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'ValidPass123!' }
    });

    fireEvent.submit(screen.getByRole('form'));

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Logging in...')).toBeInTheDocument();
  });
}); 