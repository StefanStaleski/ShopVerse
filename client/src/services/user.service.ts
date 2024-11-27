import { authStorage } from '../utils/auth.storage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}

interface UpdateProfileResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }
}

export const updateProfile = async (data: UpdateProfileData): Promise<UpdateProfileResponse> => {
  const token = authStorage.get()?.token;

  try {
    if (data.newPassword) {
      const passwordResponse = await fetch(`${API_URL}/profile/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        })
      });

      if (!passwordResponse.ok) {
        const errorData = await passwordResponse.json();
        throw new Error(errorData.error || 'Failed to update password');
      }
    }

    const { currentPassword, newPassword, ...profileData } = data;
    const response = await fetch(`${API_URL}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to update profile');
    }

    return responseData;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
}; 