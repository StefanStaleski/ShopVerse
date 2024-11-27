import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../../services/auth.service';
import { successToast, errorToast } from '../../utils/toast.config';
import { authStorage } from '../../utils/auth.storage';
import { validateLoginForm } from '../../utils/validation';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 2rem;
`;

const LoginForm = styled.form`
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 93%;
  padding: 0.8rem;
  border: 1.5px solid #e1e1e1;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #ff6b00;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const SubmitButton = styled.button<{ isLoading?: boolean }>`
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.isLoading ? '#ffa366' : '#ff6b00'};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: ${props => props.isLoading ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${props => props.isLoading ? '#ffa366' : '#ff8533'};
    transform: ${props => props.isLoading ? 'none' : 'translateY(-1px)'};
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.3rem;
  display: block;
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;

  a {
    color: #ff6b00;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateLoginForm(formData);
    
    if (validationErrors.length > 0) {
      const errorMap = validationErrors.reduce((acc, error) => ({
        ...acc,
        [error.field]: error.message
      }), {});
      
      setErrors(errorMap);
      toast.error('Please fix the validation errors', errorToast);
      return;
    }
    
    setErrors({});
    setIsLoading(true);

    try {
      const response = await login(formData);
      authStorage.set(response);
      
      toast.success('Login successful! Redirecting...', {
        ...successToast,
        autoClose: 2000,
        onClose: () => {
          navigate('/dashboard');
        }
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      if (error instanceof Error) {
        let errorMessage = 'Login failed. Please try again.';
        
        switch (error.message) {
          case 'Invalid credentials':
            errorMessage = 'Invalid email or password';
            break;
          case 'Account is inactive':
            errorMessage = 'Your account is inactive. Please contact support.';
            break;
        }
        
        setErrors({ submit: errorMessage });
        toast.error(errorMessage, errorToast);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <LoginContainer>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <LoginForm role="form" onSubmit={handleSubmit}>
        <FormTitle>Welcome Back</FormTitle>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            required
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            required
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </FormGroup>
        <SubmitButton type="submit" isLoading={isLoading} disabled={isLoading}>
          {isLoading ? (
            <>
              <LoadingSpinner />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </SubmitButton>
        <RegisterLink>
          Don't have an account? <a href="/register">Register here</a>
        </RegisterLink>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login; 