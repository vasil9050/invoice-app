import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/v1';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register/registerUser`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login/loginUser`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

export const isUserAuthenticated = () => {
  let token = window.localStorage.getItem('authToken');
  let result;
  if (token !== null) {
    result = true;
  } else {
    result = false;
  }
  return result;
};
