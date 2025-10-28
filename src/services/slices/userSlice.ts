/* eslint-disable */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { loginUserApi } from '@api';
import { getUserApi } from '@api';
import { registerUserApi } from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { updateUserApi } from '@api';
import { logoutApi } from '@api';

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }) => {
    const data = await loginUserApi(credentials);
    
    if (data.success) {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      return data.user;
    }
    throw new Error('error');
  }
);

export const getUser = createAsyncThunk(
  'user/getUser', 
  async () => {
    const data = await getUserApi();
    return data.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: { name: string; email: string; password: string }) => {
    const data = await registerUserApi(userData);
    return data.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: { name: string; email: string; password?: string }) => {
    const data = await updateUserApi(userData);
    return data.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async () => {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null as TUser | null,
    isLoading: false,
    error: null as string | null
  },
  reducers: {
    clearUser: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export const userSliceReducer = userSlice.reducer;
export const { clearUser } = userSlice.actions;