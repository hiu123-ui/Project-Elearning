import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LocalStorage, keyLocalStorage } from '../../ultil/localStorage';
import { userService } from '../../service/userService';
import { toast } from 'react-toastify';

// Async thunk cho cập nhật thông tin với API thực tế
export const updateUserInfo = createAsyncThunk(
  'user/updateInfo',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userService.updateUserInfo(userData);
      
      // Kết hợp thông tin mới với accessToken cũ
      const updatedUserInfo = {
        ...response.data,
        accessToken: userData.accessToken // Giữ lại token cũ
      };
      
      return updatedUserInfo;
    } catch (error) {
      return rejectWithValue(error.message || 'Cập nhật thông tin thất bại');
    }
  }
);

// Async thunk cho đăng ký
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userService.register(userData);
      return response.data;
    } catch (error) {
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
  registerSuccess: false,
  updateLoading: false,
  updateSuccess: false
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
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    logout: (state) => {
      state.infoUser = null;
      LocalStorage.remove(keyLocalStorage.INFO_USER);
      toast.info('Đã đăng xuất');
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý cập nhật thông tin
      .addCase(updateUserInfo.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.infoUser = action.payload;
        state.error = null;
        LocalStorage.set(keyLocalStorage.INFO_USER, action.payload);
        toast.success('🎉 Cập nhật thông tin thành công!');
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = false;
        state.error = action.payload;
        toast.error(`❌ ${action.payload}`);
      })
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

export const { 
  setInfoUser, 
  clearRegisterSuccess, 
  clearError, 
  clearUpdateSuccess,
  logout 
} = userSlice.actions;

export default userSlice.reducer;