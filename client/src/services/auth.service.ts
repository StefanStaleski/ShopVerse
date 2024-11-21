interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const register = async (data: RegisterData): Promise<RegisterResponse> => {
  try {
    console.log('Sending registration data:', data);
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log('Registration response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.error || 'Registration failed');
    }

    return responseData;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}; 