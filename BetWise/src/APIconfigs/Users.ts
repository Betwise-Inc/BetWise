import axios from "axios";

// Set your API base URL
const API_URL = "https://backwise-end-2.onrender.com/api/users";

// User Type
export type User = {
  _id: string;
  email: string;
  isAdmin: boolean;
};

export const createUser = async (email: string) => {
  const response = await axios.post(API_URL, {
    email: email,
    isAdmin: false
  });
  return response.data;
};

export const getUserByEmail = async (email: string) => {
  const response = await axios.get(API_URL);
  return response.data.find((user: any) => user.email === email);
};
// Get all users
export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get a user by ID
export const getUserById = async (id: string): Promise<User> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Update a user's isAdmin value
export const updateUser = async (id: string, isAdmin: boolean) => {
  const response = await axios.put(`${API_URL}/${id}`, { isAdmin });
  return response.data;
};

// Delete a user by ID
export const deleteUser = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
