import { createSlice } from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: number;
  role: string; 
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
const parseJSON = <T>(value: string | null): T | null => {
  try {
    if (!value || value === 'undefined' || value === 'null') return null;
    return JSON.parse(value);
  } catch (err) {
    console.warn('Failed to parse JSON from localStorage:', value);
    return null;
  }
};

const userFromStorage = localStorage.getItem('user');
const tokenFromStorage = localStorage.getItem('token');

const initialState: AuthState = {
  user: userFromStorage ? parseJSON(userFromStorage) : null,
  token: tokenFromStorage || null,
  isAuthenticated: !!userFromStorage && !!tokenFromStorage, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ name: string; token: string; role: string }>) => {
      const { name, token, role } = action.payload;
      state.user = { id: '', name, role }; 
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem('user', JSON.stringify({ id: '', name, role }));
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
