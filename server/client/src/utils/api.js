import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Your backend base URL
});

// Add a function to test the API connection
export const fetchTestMessage = async () => {
  try {
    const response = await API.get('/api/test');
    return response.data;
  } catch (error) {
    console.error('Error fetching test message:', error);
    return null;
  }
};

export default API;
