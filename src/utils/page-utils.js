import axios from 'axios';
const API_BASE_URL = 'http://localhost:3001/api/v1';

export const fileUpload = async (fileData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/page/uploadxl`, fileData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

export const getProduct = () => {
  try {
    const response = axios.get(`${API_BASE_URL}/page/productData`, {});
    console.log(response);
    return response;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

export const submitInvoice = (obj) => {
  try {
    const response = axios.post(`${API_BASE_URL}/page/invoice`, obj);
    console.log(response);
    return response;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

export const getInvoice = () => {
  try {
    const response = axios.get(`${API_BASE_URL}/page/getinvoice`, {});
    console.log(response);
    return response;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

export const deleteInvoice = (id) => {
  try {
    const response = axios.delete(`${API_BASE_URL}/page/deleteInvoice/${id}`, {});
    console.log(response);
    return response;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};