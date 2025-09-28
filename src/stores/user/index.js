import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LocalStorage, keyLocalStorage } from '../../ultil/localStorage';
import { userService } from '../../service/userService';
import { toast } from 'react-toastify';

// Async thunk cho đăng ký
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userService.register(userData);
      return response.data;
    } catch (error) {
      // Xử lý lỗi chi tiết hơn
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.content || error.response.data.message || 'Đăng ký thất bại';
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue('Đã xảy ra lỗi kết nối khi đăng ký');
    }
  }
);

// Async thunk cho đăng nhập
export const loginUser = createAsyncThunk(
  'user/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userService.login(userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.content || error.response.data.message || 'Đăng nhập thất bại';
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue('Đã xảy ra lỗi kết nối khi đăng nhập');
    }
  }
);

const initialState = {
  infoUser: LocalStorage.get(keyLocalStorage.INFO_USER),
  loading: false,
  error: null,
  registerSuccess: false
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setInfoUser: (state, action) => {
      state.infoUser = action.payload;
      LocalStorage.set(keyLocalStorage.INFO_USER, action.payload);
    },
    clearRegisterSuccess: (state) => {
      state.registerSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.infoUser = null;
      LocalStorage.remove(keyLocalStorage.INFO_USER);
      toast.info('Đã đăng xuất');
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý đăng ký
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registerSuccess = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registerSuccess = false;
        state.error = action.payload;
      })
      // Xử lý đăng nhập
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.infoUser = action.payload;
        state.error = null;
        LocalStorage.set(keyLocalStorage.INFO_USER, action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setInfoUser, clearRegisterSuccess, clearError, logout } = userSlice.actions;
export default userSlice.reducer;