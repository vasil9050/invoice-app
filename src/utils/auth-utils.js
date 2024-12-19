import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1"; // Replace with your backend URL

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register/registerUser`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Network Error" };
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login/loginUser`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Network Error" };
    }
};
