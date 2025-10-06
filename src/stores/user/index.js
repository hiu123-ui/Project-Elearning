import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LocalStorage, keyLocalStorage } from '../../ultil/localStorage';
import { userService } from '../../service/userService';
import { toast } from 'react-toastify';

// Async thunk cho cập nhật thông tin với API thực tế
export const updateUserInfo = createAsyncThunk(
  'user/updateUserInfo',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.userSlice.infoUser?.accessToken;
      
      if (!token) {
        return rejectWithValue('Không tìm thấy token xác thực');
      }

      // Tạo payload không chứa accessToken (API không cần)
      const payload = { 
        taiKhoan: userData.taiKhoan,
        matKhau: userData.matKhau || '',
        hoTen: userData.hoTen,
        soDT: userData.soDT,
        maNhom: userData.maNhom,
        email: userData.email,
        maLoaiNguoiDung: userData.maLoaiNguoiDung
      };

      const response = await userService.updateUserInfo(payload);
      
      // Kết hợp thông tin mới với token cũ
      const updatedUserInfo = {
        ...response.data,
        accessToken: token // Giữ nguyên token
      };
      
      console.log('Cập nhật thành công:', updatedUserInfo);
      return updatedUserInfo;
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      return rejectWithValue(
        error.message || 
        'Cập nhật thông tin thất bại'
      );
    }
  }
);

// Async thunk để refresh thông tin user - ĐÃ SỬA LỖI
export const refreshUserInfo = createAsyncThunk(
  'user/refreshInfo',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { infoUser } = getState().userSlice;
      if (!infoUser?.taiKhoan) {
        throw new Error('Không tìm thấy thông tin user');
      }

      // Sử dụng getUserInfo thay vì getUserDetail (nếu API có)
      const response = await userService.getUserInfo();
      const refreshedInfo = {
        ...response.data,
        accessToken: infoUser.accessToken // Giữ nguyên token
      };
      
      return refreshedInfo;
    } catch (error) {
      console.error('Lỗi refresh user info:', error);
      // Fallback: sử dụng getUserDetail nếu getUserInfo không tồn tại
      try {
        const { infoUser } = getState().userSlice;
        const response = await userService.getUserDetail(infoUser.taiKhoan);
        const refreshedInfo = {
          ...response.data,
          accessToken: infoUser.accessToken
        };
        return refreshedInfo;
      } catch (fallbackError) {
        return rejectWithValue('Làm mới thông tin thất bại');
      }
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
  updateSuccess: false,
  refreshLoading: false
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
    },
    // Thêm reducer để cập nhật partial info
    updatePartialInfo: (state, action) => {
      if (state.infoUser) {
        state.infoUser = { ...state.infoUser, ...action.payload };
        LocalStorage.set(keyLocalStorage.INFO_USER, state.infoUser);
      }
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
      // Xử lý refresh thông tin
      .addCase(refreshUserInfo.pending, (state) => {
        state.refreshLoading = true;
      })
      .addCase(refreshUserInfo.fulfilled, (state, action) => {
        state.refreshLoading = false;
        state.infoUser = action.payload;
        LocalStorage.set(keyLocalStorage.INFO_USER, action.payload);
        toast.info('🔄 Đã làm mới thông tin');
      })
      .addCase(refreshUserInfo.rejected, (state, action) => {
        state.refreshLoading = false;
        console.error('Refresh user info failed:', action.payload);
        toast.error('❌ Làm mới thông tin thất bại');
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
  logout,
  updatePartialInfo
} = userSlice.actions;

export default userSlice.reducer;