interface AuthData {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

const AUTH_KEY = 'auth_data';

export const authStorage = {
  set: (data: AuthData): void => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  },
  
  get: (): AuthData | null => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },
  
  clear: (): void => {
    localStorage.removeItem(AUTH_KEY);
  }
}; 