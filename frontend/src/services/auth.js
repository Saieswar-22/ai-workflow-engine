import api from './api';

export const authService = {
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 expects username
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
  
  signup: async (email, password, fullName) => {
    const response = await api.post('/auth/signup', {
      email,
      password,
      full_name: fullName,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.post('/auth/test-token');
    return response.data;
  }
};
