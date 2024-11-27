import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import Register from '../../pages/Auth/Register';
import { validateRegistrationForm } from '../../utils/validation';
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

// Mock the actual toast config values
jest.mock('../../utils/toast.config', () => ({
  errorToast: {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      borderRadius: '8px',
      fontWeight: '500',
      background: '#f44336',
      color: 'white',
    }
  },
  successToast: {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      borderRadius: '8px',
      fontWeight: '500',
      background: '#4caf50',
      color: 'white',
    }
  }
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('Register Component Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderRegister = () => {
    return render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  };

  it('should show error toast for validation errors', async () => {
    const validationErrors = [
      { field: 'password', message: 'Password is too weak' }
    ];
    
    (validateRegistrationForm as jest.Mock).mockReturnValue(validationErrors);

    renderRegister();
    
    // Fill out the form with invalid data
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'T' } // Too short
    });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(validateRegistrationForm).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        'Please fix the validation errors',
        expect.objectContaining(errorToast)
      );
    });
  });

  it('should show success toast on successful registration', async () => {
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

    (validateRegistrationForm as jest.Mock).mockReturnValue([]);
    (authService.register as jest.Mock).mockResolvedValueOnce(mockResponse);

    renderRegister();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Test' }
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'User' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'Test123!@#' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'Test123!@#' }
    });

    // Submit the form
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Registration successful!',
        expect.objectContaining({
          ...successToast,
          autoClose: 2000,
        })
      );
    });
  });

  it('should show error toast when registration fails', async () => {
    (validateRegistrationForm as jest.Mock).mockReturnValue([]);
    (authService.register as jest.Mock).mockRejectedValueOnce(
      new Error('Registration failed')
    );

    renderRegister();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Test' }
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'User' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'Test123!@#' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'Test123!@#' }
    });

    // Submit the form
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Registration failed. Please try again.',
        expect.objectContaining(errorToast)
      );
    });
  });
}); 