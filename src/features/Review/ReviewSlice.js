import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

//전체리뷰
export const getAllReviews = createAsyncThunk(
  "reviews/getAllReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/reviews");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "전체 리뷰 불러오기 실패");
    }
  }
);
// 리뷰 목록 가져오기
export const getReviews = createAsyncThunk(
  "reviews/getReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reviews/${productId}`);
      console.log("response: ", response.data)
      return response.data ; 
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
  async ({productId, ...formData}, { rejectWithValue }) => {
    try {
      console.log("Sending review data:", formData); // 확인용

      const response = await api.post(`/reviews`, formData, {
        headers: {
          "Content-Type": "application/json", // JSON 형식 명시
        },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to submit review");
      }

      return response.data; // 작성된 리뷰 데이터 반환
    } catch (error) {
      console.error("Error in createReview:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "리뷰 삭제 실패");
    }
  }
);


const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [
     
    ],
    loading: false,
    error: null,
  },
  reducers: {
   
  },
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
      }) 
      // 전체 리뷰 불러오기
      .addCase(getAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 리뷰 삭제
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r._id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.error = action.payload;
      });

  },
});

export default reviewSlice.reducer;
