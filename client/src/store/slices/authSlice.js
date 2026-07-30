import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Initial state loaded from localStorage
const getSavedUser = () => {
  try {
    const saved = localStorage.getItem('learnix_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getSavedToken = () => {
  return localStorage.getItem('learnix_token') || null;
};

const initialUser = getSavedUser();
const initialToken = getSavedToken();

const initialState = {
  user: initialUser,
  token: initialToken,
  role: initialUser?.role || null,
  isAuthenticated: !!(initialUser && initialToken),
  isLoading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      const authenticatedUser = {
        ...data.user,
        id: data.user._id || data.user.id,
      };
      localStorage.setItem('learnix_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('learnix_token', data.token);
      return { user: authenticatedUser, token: data.token };
    } catch (err) {
      const message = typeof err === 'string' ? err : (err?.message || err?.response?.data?.message || 'Login failed');
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, role = 'student' }, { rejectWithValue }) => {
    try {
      const data = await authService.register({ name, email, password, role });
      const authenticatedUser = {
        ...data.user,
        id: data.user._id || data.user.id,
      };
      localStorage.setItem('learnix_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('learnix_token', data.token);
      return { user: authenticatedUser, token: data.token };
    } catch (err) {
      const message = typeof err === 'string' ? err : (err?.message || err?.response?.data?.message || 'Registration failed');
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.role = action.payload?.role || null;
      state.isAuthenticated = !!(action.payload && state.token);
      if (action.payload) {
        localStorage.setItem('learnix_user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('learnix_user');
      }
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!(state.user && action.payload);
      if (action.payload) {
        localStorage.setItem('learnix_token', action.payload);
      } else {
        localStorage.removeItem('learnix_token');
      }
    },
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('learnix_user');
      localStorage.removeItem('learnix_token');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user?.role || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user?.role || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, setToken, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
