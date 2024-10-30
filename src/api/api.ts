import axios from 'axios';

// const API_URL = process.env.API_URL
export const API_URL = 'https://expense-server-xk53.onrender.com/api/';
// const API_URL = 'http://localhost:5000/api/'; 
// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

// Sign up a user
export const signupUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}auth/signup`, userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error signing up user');
  }
};

// Log in a user
export const loginUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}auth/login`, userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error logging in user');
  }
};

// Fetch expenses for a specific date
export const fetchExpensesByDate = async (date: string) => {
  try {
    const response = await axios.get(`${API_URL}expenses/${date}`, {
      withCredentials: true, 
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error fetching expenses');
  }
};

// Add a new expense for a specific date
export const addExpense = async (expenseData: any) => {
  try {
    const response = await axios.post(`${API_URL}expenses`, expenseData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error adding expense');
  }
};
