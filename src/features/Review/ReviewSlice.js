import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// 리뷰 목록 가져오기
export const getReviews = createAsyncThunk(
  "reviews/getReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reviews/${productId}`);
      return response.data.data || []; // 리뷰 데이터 반환, 없으면 빈 배열
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

// 리뷰 작성
export const createReview = createAsyncThunk(
  "reviews/createReview",
  async ({ productId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/reviews`, { productId, ...formData });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to submit review");
      }
      return response.data; // 작성된 리뷰 데이터 반환
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 리뷰 가져오기
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 리뷰 작성
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = [action.payload, ...state.reviews]; // 새로운 리뷰 추가
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
