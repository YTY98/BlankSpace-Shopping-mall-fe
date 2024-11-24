// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import { showToastMessage } from "../common/uiSlice";
// // import api from "../../utils/api";
// // import { initialCart } from "../cart/cartSlice";

// // // 회원 목록 가져오기 Thunk 액션
// // export const getUserList = createAsyncThunk("user/getUserList", async (_, { rejectWithValue }) => {
// //   try {
// //     const response = await api.get("/users"); // 회원 목록을 가져오는 API
// //     return response.data; // 데이터를 반환
// //   } catch (error) {
// //     return rejectWithValue(error.response.data);
// //   }
// // });

// // export const loginWithEmail = createAsyncThunk(
// //   "user/loginWithEmail",
// //   async ({ email, password }, { rejectWithValue }) => {
// //     try {
// //       const response = await api.post("/auth/login", { email, password });
// //       //성공
// //       // Loginpage
// //       // token 저장 1. local storage 2. session storage
// //       sessionStorage.setItem("token", response.data.token);
// //       return response.data;
// //     } catch (error) {
// //       //실패
// //       // 실패 시 생긴 에러값을 reducer에 저장
// //       return rejectWithValue(error.error);
// //     }
// //   }
// // );

// // export const loginWithGoogle = createAsyncThunk(
// //   "user/loginWithGoogle",
// //   async (token, { rejectWithValue }) => {
// //     try {
// //       const response = await api.post("/auth/google", { token });
// //       sessionStorage.setItem("token", response.data.token);
// //       return response.data.user;
// //     } catch (error) {
// //       return rejectWithValue(error.error);
// //     }
// //   }
// // );

// // export const logout = createAsyncThunk(
// //   "user/logout",
// //   async (_, { dispatch }) => {
// //     sessionStorage.removeItem("token");
// //     dispatch(initialCart());
// //     dispatch(
// //       showToastMessage({
// //         message: "로그아웃을 완료했습니다!",
// //         status: "info",
// //       })
// //     );
// //   }
// // );

// // export const registerUser = createAsyncThunk(
// //   "user/registerUser",
// //   async (
// //     { email, name, password, navigate },
// //     { dispatch, rejectWithValue }
// //   ) => {
// //     try {
// //       const response = await api.post("/user", { email, name, password });
// //       //성공
// //       // 1. 성공 토스트 메세지 보여주기
// //       dispatch(
// //         showToastMessage({
// //           message: "회원가입에 성공했습니다!",
// //           status: "success",
// //         })
// //       );
// //       // 2. 로그인 페이지로 리다이렉트
// //       navigate("/login");

// //       return response.data.data;
// //     } catch (error) {
// //       //실패
// //       // 1. 실패 토스트 메세지를 보여준다
// //       dispatch(
// //         showToastMessage({
// //           message: "회원가입에 실패했습니다!",
// //           status: "error",
// //         })
// //       );
// //       // 2. 에러값을 저장한다
// //       return rejectWithValue(error.error);
// //     }
// //   }
// // );

// // export const loginWithToken = createAsyncThunk(
// //   "user/loginWithToken",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await api.get("/user/me");
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(error.error);
// //     }
// //   }
// // );

// // const userSlice = createSlice({
// //   name: "user",
// //   initialState: {
// //     user: null,
// //     loading: false,
// //     loginError: null,
// //     registrationError: null,
// //     success: false,
// //   },
// //   reducers: {
// //     clearErrors: (state) => {
// //       state.loginError = null;
// //       state.registrationError = null;
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(registerUser.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(registerUser.fulfilled, (state) => {
// //         state.loading = false;
// //         state.registrationError = null;
// //         state.success = true;
// //       })
// //       .addCase(registerUser.rejected, (state, action) => {
// //         state.registrationError = action.payload;
// //         state.loading = false;
// //       })
// //       .addCase(loginWithEmail.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(loginWithEmail.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.user = action.payload.user;
// //         state.loginError = null;
// //       })
// //       .addCase(loginWithEmail.rejected, (state, action) => {
// //         state.loading = false;
// //         state.loginError = action.payload;
// //       })
// //       .addCase(loginWithToken.fulfilled, (state, action) => {
// //         state.user = action.payload.user;
// //         state.loading = false;
// //       })
// //       .addCase(loginWithToken.rejected, (state) => {
// //         state.loading = false;
// //       })
// //       .addCase(logout.fulfilled, () => {
// //         return {
// //           user: null,
// //           loading: false,
// //           loginError: null,
// //           registrationError: null,
// //           success: false,
// //         };
// //       })
// //       .addCase(loginWithGoogle.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(loginWithGoogle.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.user = action.payload;
// //         state.loginError = null;
// //       })
// //       .addCase(loginWithGoogle.rejected, (state, action) => {
// //         state.loading = false;
// //         state.loginError = action.payload;
// //       });
// //   },
// // });
// // export const { clearErrors } = userSlice.actions;
// // export default userSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { showToastMessage } from "../common/uiSlice";
// import api from "../../utils/api";
// import { initialCart } from "../cart/cartSlice";

// // 회원 목록 가져오기 Thunk 액션
// export const getUserList = createAsyncThunk("user/getUserList", async (_, { rejectWithValue }) => {
//   try {
//     const response = await api.get("/users"); // 회원 목록을 가져오는 API
//     return response.data; // 데이터를 반환
//   } catch (error) {
//     return rejectWithValue(error.response ? error.response.data : error.message);
//   }
// });

// export const loginWithEmail = createAsyncThunk(
//   "user/loginWithEmail",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/auth/login", { email, password });
//       sessionStorage.setItem("token", response.data.token); // 세션 스토리지에 토큰 저장
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response ? error.response.data : error.message);
//     }
//   }
// );

// export const loginWithGoogle = createAsyncThunk(
//   "user/loginWithGoogle",
//   async (token, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/auth/google", { token });
//       sessionStorage.setItem("token", response.data.token);
//       return response.data.user;
//     } catch (error) {
//       return rejectWithValue(error.response ? error.response.data : error.message);
//     }
//   }
// );

// export const logout = createAsyncThunk(
//   "user/logout",
//   async (_, { dispatch }) => {
//     sessionStorage.removeItem("token");
//     dispatch(initialCart()); // 카트 상태 초기화
//     dispatch(
//       showToastMessage({
//         message: "로그아웃을 완료했습니다!",
//         status: "info",
//       })
//     );
//   }
// );

// export const registerUser = createAsyncThunk(
//   "user/registerUser",
//   async ({ email, name, password, navigate }, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await api.post("/user", { email, name, password });
//       dispatch(
//         showToastMessage({
//           message: "회원가입에 성공했습니다!",
//           status: "success",
//         })
//       );
//       navigate("/login"); // 회원가입 후 로그인 페이지로 리다이렉트
//       return response.data.data;
//     } catch (error) {
//       dispatch(
//         showToastMessage({
//           message: "회원가입에 실패했습니다!",
//           status: "error",
//         })
//       );
//       return rejectWithValue(error.response ? error.response.data : error.message);
//     }
//   }
// );

// export const loginWithToken = createAsyncThunk(
//   "user/loginWithToken",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get("/user/me");
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response ? error.response.data : error.message);
//     }
//   }
// );

// const userSlice = createSlice({
//   name: "user",
//   initialState: {
//     user: null,
//     userList: [], // 회원 목록
//     loading: false,
//     loginError: null,
//     registrationError: null,
//     success: false,
//   },
//   reducers: {
//     clearErrors: (state) => {
//       state.loginError = null;
//       state.registrationError = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(registerUser.fulfilled, (state) => {
//         state.loading = false;
//         state.registrationError = null;
//         state.success = true;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.registrationError = action.payload;
//         state.loading = false;
//       })
//       .addCase(loginWithEmail.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(loginWithEmail.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.loginError = null;
//       })
//       .addCase(loginWithEmail.rejected, (state, action) => {
//         state.loading = false;
//         state.loginError = action.payload;
//       })
//       .addCase(loginWithToken.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.loading = false;
//       })
//       .addCase(loginWithToken.rejected, (state) => {
//         state.loading = false;
//       })
//       .addCase(logout.fulfilled, (state) => {
//         state.user = null;
//         state.loading = false;
//         state.loginError = null;
//         state.registrationError = null;
//         state.success = false;
//       })
//       .addCase(loginWithGoogle.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(loginWithGoogle.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.loginError = null;
//       })
//       .addCase(loginWithGoogle.rejected, (state, action) => {
//         state.loading = false;
//         state.loginError = action.payload;
//       })
//       .addCase(getUserList.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getUserList.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userList = action.payload;
//       })
//       .addCase(getUserList.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearErrors } = userSlice.actions;
// export default userSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
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
      sessionStorage.setItem("token", response.data.token);
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
      sessionStorage.setItem("token", response.data.token);
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
    sessionStorage.removeItem("token");
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
      const token = sessionStorage.getItem("token"); // 토큰 가져오기
      if (!token) throw new Error("Authentication token is missing");

      const response = await api.get("/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.user; // API에서 반환된 사용자 데이터
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({ currentPassword }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Authentication token is missing");

      await api.delete("/user/delete", {
        headers: { Authorization: `Bearer ${token}` },
        data: { currentPassword },
      });

      sessionStorage.removeItem("token"); // 토큰 삭제
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
      const token = sessionStorage.getItem("token");
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
      });
  },
});

export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
