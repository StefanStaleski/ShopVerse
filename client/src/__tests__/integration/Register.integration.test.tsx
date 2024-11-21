import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../../pages/Auth/Register';
import * as authService from '../../services/auth.service';
import { act } from 'react';

// Mock dependencies
jest.mock('../../services/auth.service');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('Register Integration Tests', () => {
  const mockUser = {
    firstName: 'Test',
    lastName: 'User',
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

  const renderRegister = () => {
    return render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  };

  it('should complete full registration flow successfully', async () => {
    const mockResponse = {
      token: 'fake-token',
      user: {
        id: '1',
        ...mockUser,
        role: 'user'
      }
    };
    
    (authService.register as jest.Mock).mockResolvedValueOnce(mockResponse);

    renderRegister();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: mockUser.firstName }
      });
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: mockUser.lastName }
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: mockUser.email }
      });
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: mockUser.password }
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: mockUser.password }
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /register/i }));
    });

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        password: mockUser.password
      });

      const storedAuth = JSON.parse(localStorage.getItem('auth_data') || '{}');
      expect(storedAuth).toEqual(mockResponse);
    });
  });

  it('should handle network errors during registration', async () => {
    (authService.register as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error')
    );

    renderRegister();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: mockUser.firstName }
      });
      fireEvent.change(screen.getByLabelText(/Last Name/i), {
        target: { value: mockUser.lastName }
      });
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: mockUser.email }
      });
      fireEvent.change(screen.getByLabelText(/^Password/i), {
        target: { value: mockUser.password }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: mockUser.password }
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Register'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });
}); 