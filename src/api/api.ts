import axios from 'axios';

// Set the base API URL for the backend server
export const API_URL = 'https://expense-server-xk53.onrender.com/api/';
// For local development, you might switch to: const API_URL = 'http://localhost:5000/api/';

// Configure axios to send cookies with requests, which is necessary for credentials-based CORS
axios.defaults.withCredentials = true;

// Helper function to extract error messages safely
const extractErrorMessage = (error: any): string => {
  return error?.response?.data?.message || error.message || 'An unknown error occurred';
};

// Sign up a user
export const signupUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}auth/signup`, userData);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error) || 'Error signing up user');
  }
};

// Log in a user
export const loginUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}auth/login`, userData);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error) || 'Error logging in user');
  }
};

// Fetch expenses for a specific date
export const fetchExpensesByDate = async (date: string) => {
  try {
    const response = await axios.get(`${API_URL}expenses/${date}`, {
      withCredentials: true, // Ensures cookies are sent
    });
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error) || 'Error fetching expenses');
  }
};

// Add a new expense for a specific date
export const addExpense = async (expenseData: any) => {
  try {
    const response = await axios.post(`${API_URL}expenses`, expenseData);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error) || 'Error adding expense');
  }
};
