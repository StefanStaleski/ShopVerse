import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { authStorage } from '../../utils/auth.storage';
import { successToast, errorToast } from '../../utils/toast.config';
import DashboardHeader from '../../components/common/Header/DashboardHeader';
import { CircularProgress } from '@mui/material';
import { updateProfile } from '../../services/user.service';

const AccountContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const AccountSection = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  width: 100%;
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
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.8rem 1.5rem;
  background-color: ${props => props.variant === 'secondary' ? 'transparent' : '#ff6b00'};
  color: ${props => props.variant === 'secondary' ? '#ff6b00' : 'white'};
  border: ${props => props.variant === 'secondary' ? '2px solid #ff6b00' : 'none'};
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#fff1e6' : '#ff8533'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const AccountStatus = styled.span<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  background-color: ${props => props.isActive ? '#e6f4ea' : '#fce8e8'};
  color: ${props => props.isActive ? '#137333' : '#c5221f'};
`;

const AccountManagement: React.FC = () => {
  const navigate = useNavigate();
  const userData = authStorage.get()?.user;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!authStorage.get()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEditing) return;

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email'];
    const errors: { [key: string]: string } = {};
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate password if changing
    if (formData.newPassword || formData.confirmNewPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required to change password';
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        errors.confirmNewPassword = 'Passwords do not match';
      }
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      toast.error('Please fix the validation errors', errorToast);
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        ...(formData.newPassword ? {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        } : {})
      };

      const response = await updateProfile(updateData);
      
      // Update local storage with new user data
      const currentAuth = authStorage.get();
      if (currentAuth) {
        authStorage.set({
          ...currentAuth,
          user: response.user
        });
      }

      toast.success('Profile updated successfully!', successToast);
      setIsEditing(false);
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message || 'Failed to update profile';
        toast.error(errorMessage, errorToast);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <>
      <DashboardHeader />
      <AccountContainer>
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
        
        <AccountSection>
          <SectionTitle>
            Account Information
            <AccountStatus isActive={true}>
              Active
            </AccountStatus>
          </SectionTitle>
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  disabled={!isEditing}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  disabled={!isEditing}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  disabled={!isEditing}
                />
              </FormGroup>

              {isEditing && (
                <>
                  <FormGroup>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange('currentPassword')}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="newPassword">New Password (Optional)</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange('newPassword')}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      value={formData.confirmNewPassword}
                      onChange={handleChange('confirmNewPassword')}
                    />
                  </FormGroup>
                </>
              )}

              <ButtonGroup>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <CircularProgress size="small" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </form>
          ) : (
            <>
              <form>
                <FormGroup>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange('firstName')}
                    disabled={!isEditing}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange('lastName')}
                    disabled={!isEditing}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    disabled={!isEditing}
                  />
                </FormGroup>

                {isEditing && (
                  <>
                    <FormGroup>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange('currentPassword')}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="newPassword">New Password (Optional)</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange('newPassword')}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                      <Input
                        id="confirmNewPassword"
                        type="password"
                        value={formData.confirmNewPassword}
                        onChange={handleChange('confirmNewPassword')}
                      />
                    </FormGroup>
                  </>
                )}
              </form>
              <ButtonGroup>
                <Button 
                  type="button"
                  onClick={handleEditClick}
                >
                  Edit Profile
                </Button>
              </ButtonGroup>
            </>
          )}
        </AccountSection>
      </AccountContainer>
    </>
  );
};

export default AccountManagement; 