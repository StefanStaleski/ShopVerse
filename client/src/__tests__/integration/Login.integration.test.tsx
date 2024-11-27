import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react';
import Login from '../../pages/Auth/Login';
import * as authService from '../../services/auth.service';
import { toast } from 'react-toastify';

jest.mock('../../services/auth.service');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  },
  ToastContainer: jest.fn().mockReturnValue(null)
}));

describe('Login Integration Tests', () => {
  const mockUser = {
    email: 'test@example.com',
    password: 'Test123!@#'
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it('should complete full login flow successfully', async () => {
    const mockResponse = {
      token: 'fake-token',
      user: {
        id: '1',
        email: mockUser.email,
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      }
    };
    
    (authService.login as jest.Mock).mockResolvedValueOnce(mockResponse);

    renderLogin();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: mockUser.email }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: mockUser.password }
      });
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('form'));
    });

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(toast.success).toHaveBeenCalledWith(
        'Login successful! Redirecting...',
        expect.any(Object)
      );
      const storedAuth = JSON.parse(localStorage.getItem('auth_data') || '{}');
      expect(storedAuth).toEqual(mockResponse);
    });
  });

  it('should handle invalid credentials', async () => {
    (authService.login as jest.Mock).mockRejectedValueOnce(
      new Error('Invalid credentials')
    );

    renderLogin();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: mockUser.email }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'wrongpassword' }
      });
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('form'));
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Invalid email or password',
        expect.any(Object)
      );
    });
  });

  it('should handle validation errors', async () => {
    renderLogin();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'invalid-email' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'short' }
      });
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('form'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during login', async () => {
    (authService.login as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    renderLogin();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: mockUser.email }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: mockUser.password }
      });
    });

    fireEvent.submit(screen.getByRole('form'));

    expect(screen.getByText(/Logging in.../i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
}); 