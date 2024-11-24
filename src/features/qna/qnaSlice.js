import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// Q&A 목록 가져오기
export const getQnAList = createAsyncThunk(
  "qna/getQnAList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/qna", { params: { ...query } });
      // console.log("API response data:", response.data);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data?.error || "Failed to fetch Q&A list");
      }

      const data = response.data.data || [];
      const totalPageNum = response.data.totalPageNum || 1;

      return { data, totalPageNum }; // 데이터와 전체 페이지 수를 반환
    } catch (error) {
      console.error("Error fetching QnA list:", error.message);
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);


// Q&A 상세 가져오기
export const getQnADetail = createAsyncThunk(
  "qna/getQnADetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/qna/${id}`);
      // console.log(response);
      if (response.status !== 200) throw new Error(response.error);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Q&A 생성
export const createQnA = createAsyncThunk(
  "qna/createQnA",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/qna", formData);

      // 상태 코드가 200 또는 201인 경우 성공으로 간주
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data?.error || "Failed to fetch Q&A list");
      }

      // response.data가 존재하는지 확인
      if (!response.data) throw new Error("Response data is undefined");

      // Q&A 생성 성공 시 알림 메시지
      dispatch(
        showToastMessage({ message: "Q&A 생성 완료", status: "success" })
      );

      // Q&A 목록을 다시 불러옴
      await dispatch(getQnAList({ page: 1 }));

      return response.data;
    } catch (error) {
      console.error("Failed to create Q&A:", error.message || error); // 더 구체적인 에러 로그
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// 답변 추가 (AnswerContent와 isAnswered 업데이트)
export const addAnswer = createAsyncThunk(
  "qna/addAnswer",
  async ({ id, answerContent }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/qna/${id}`, {
        AnswerContent: answerContent,
        isAnswered: true,
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data?.error || "Failed to add answer");
      }
      // console.log(response);
      return response.data; // 성공적으로 업데이트된 Q&A 데이터 반환
    } catch (error) {
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

const qnaSlice = createSlice({
  name: "qna",
  initialState: {
    qnaList: [],
    qnaDetail: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /********* getQnAList ****************************/

      .addCase(getQnAList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQnAList.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("Fetched QnA list:", action.payload); // 데이터 확인
        state.qnaList = action.payload;
      })
      .addCase(getQnAList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /********* getQnADetail *****************************/

      .addCase(getQnADetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQnADetail.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("Fetched QnaDetail: ", action.payload);
        state.qnaDetail = action.payload;
      })
      .addCase(getQnADetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /********** createQnA ********************************/

      .addCase(createQnA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQnA.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.qnaList)) {
          state.qnaList = [];
        }

        if (action.payload) {
          state.qnaList.push(action.payload);
        } else {
          console.error("Payload is not valid", action.payload);
        }
      })
      .addCase(createQnA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /************ addAnswer ********************************/

      .addCase(addAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.qnaDetail = action.payload; // Q&A 상세 정보 업데이트
      })
      .addCase(addAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export default qnaSlice.reducer;