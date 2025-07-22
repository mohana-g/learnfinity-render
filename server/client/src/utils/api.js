import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend base URL
});

// Add a function to test the API connection
export const fetchTestMessage = async () => {
  try {
    const response = await API.get('/test');
    return response.data;
  } catch (error) {
    console.error('Error fetching test message:', error);
    return null;
  }
};

export default API;
