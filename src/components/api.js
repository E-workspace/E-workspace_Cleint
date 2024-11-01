import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL_MS1; // Set your API URL

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/api/users`);
  return response.data;
};
