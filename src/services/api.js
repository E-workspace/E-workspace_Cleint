// src/services/api.js
import axios from 'axios';

const API_URL = 'https://e-workspace-server-v1-ms-1.onrender.com/api/auth';

axios.defaults.withCredentials = true;

// Function to fetch CSRF token
export const getCsrfToken = async () => {
    const response = await axios.get('https://e-workspace-server-v1-ms-1.onrender.com/api/csrf-token');
    return response.data.csrfToken;
};

// Register API
export const register = async (userData) => {
    const csrfToken = await getCsrfToken();
    const response = await axios.post(`${API_URL}/register`, userData, {
        headers: {
            'csrf-token': csrfToken,
        },
    });
    return response.data;
};

// Verify OTP API
export const verifyOtp = async (otpData) => {
    const csrfToken = await getCsrfToken();
    const response = await axios.post(`${API_URL}/verify-otp`, otpData, {
        headers: {
            'csrf-token': csrfToken,
        },
    });
    return response.data;
};

// Login API
export const login = async (userData) => {
    const csrfToken = await getCsrfToken();
    try {
        const response = await axios.post(`${API_URL}/login`, userData, {
            headers: {
                'csrf-token': csrfToken,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Login failed');
    }
};
