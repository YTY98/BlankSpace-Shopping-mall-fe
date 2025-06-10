import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { setAuthToken } from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";
import { initialCart } from "../cart/cartSlice";

// 회원 목록 가져오기 Thunk 액션
export const getUserList = createAsyncThunk("user/getUserList", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// 이메일 로그인 Thunk 액션
export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      setAuthToken(response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// 구글 로그인 Thunk 액션
export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/google", { token });
      setAuthToken(response.data.token);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// 토큰으로 로그인 Thunk 액션
export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// 로그아웃 Thunk 액션
export const logout = createAsyncThunk(
  "user/logout",
  async (_, { dispatch }) => {
    setAuthToken(null);
    dispatch(initialCart());
    dispatch(
      showToastMessage({
        message: "로그아웃을 완료했습니다!",
        status: "info",
      })
    );
  }
);

// 회원가입 Thunk 액션
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ email, name, password, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/user", { email, name, password });
      dispatch(
        showToastMessage({
          message: "회원가입에 성공했습니다!",
          status: "success",
        })
      );
      navigate("/login");
      return response.data.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "회원가입에 실패했습니다!",
          status: "error",
        })
      );
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token is missing");

      const response = await api.get("/user/me");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({ currentPassword }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token is missing");

      await api.delete("/user/delete", {
        headers: { Authorization: `Bearer ${token}` },
        data: { currentPassword },
      });

      setAuthToken(null);
      return null;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async ({ name, newPassword, currentPassword }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token is missing");

      const response = await api.put(
        "/user/update",
        { name, newPassword, currentPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.user; // 업데이트된 사용자 정보 반환
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "user/addToWishlist",
  async ({ productId }, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token is missing");

      const userId = getState().user.user._id; // 현재 사용자 ID
      const response = await api.post(
        `/user/${userId}/wishlist`,
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.wishlist; // 업데이트된 wishlist 반환
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const updateMembership = createAsyncThunk(
  "user/updateMembership",
  async ({ userId, membership }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token is missing");

      const response = await api.put(
        `/user/${userId}`,
        { membership },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Slice 생성
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    userList: [],
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload;
        state.loading = false;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(loginWithToken.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.loginError = null;
        state.registrationError = null;
        state.success = false;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.loginError = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(getUserList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload;
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // 상태 업데이트
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.user.wishlist = action.payload; // wishlist 업데이트
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMembership.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMembership.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user && state.user._id === action.payload._id) {
          state.user = action.payload;
        }
        state.userList = state.userList.map(user =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateMembership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
