interface ValidationError {
  field: string;
  message: string;
}

export const validatePassword = (password: string): boolean => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;
};

export const validateName = (name: string): boolean => {
  return /^[A-Za-z]{2,}$/.test(name);
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateRegistrationForm = (formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!validateName(formData.firstName)) {
    errors.push({
      field: 'firstName',
      message: 'First name must be at least 2 characters long and contain only letters'
    });
  }

  if (!validateName(formData.lastName)) {
    errors.push({
      field: 'lastName',
      message: 'Last name must be at least 2 characters long and contain only letters'
    });
  }

  if (!validateEmail(formData.email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address'
    });
  }

  if (!validatePassword(formData.password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character'
    });
  }

  if (formData.password !== formData.confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'Passwords do not match'
    });
  }

  return errors;
}; 