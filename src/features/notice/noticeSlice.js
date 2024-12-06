import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// 기본 공지사항 목록을 가져오는 비동기 작업
export const fetchNotices = createAsyncThunk('notices/fetchNotices', async (searchQuery) => {
  const { page, title } = searchQuery;
  const response = await api.get(`/notices`, {
    params: {
      page,
      title: title || '', // title이 없는 경우 빈 문자열로 설정
    },
  });

  return response.data;
});


// 검색된 공지사항 목록을 가져오는 비동기 작업
export const searchNotices = createAsyncThunk(
  'notices/searchNotices',
  async ({ searchType = 'title', keyword = '', page = 1, limit = 10 }) => {
    const response = await api.get('/notices', {
      params: { searchType, keyword, page, limit }
    });
    return response.data;
  }
);

// 관리자를 위한 검색된 공지사항 목록을 가져오는 비동기 작업
export const adminsearchNotices = createAsyncThunk(
  "notices/adminsearchNotices",
  async ({ searchType = "title", keyword = "", page = 1, limit = 10 }) => {
    // keyword가 객체인 경우 title 속성을 가져오고, 문자열인 경우 그대로 사용
    const keywordValue =
      typeof keyword === "string" ? keyword : keyword.title || "";

    const response = await api.get("/notices", {
      params: {
        searchType,
        keyword: keywordValue, // keyword를 문자열로 설정
        page,
        limit,
      },
    });
    return response.data;
  }
);

//공지사항 추가하는 비동기작업
export const addNotice = createAsyncThunk(
  "notice/addNotice",
  async (noticeData) => {
    const response = await api.post("/notices", noticeData);
    return response.data;
  }
);


// 공지사항 수정하는 비동기 작업
export const updateNotice = createAsyncThunk('notices/updateNotice', async ({ id, notice }) => {
  console.log(id);
  const response = await api.put(`/notices/${id}`, notice);
  console.log("Updated notice:", response.data);
  return response.data;
});

// 공지사항 삭제하는 비동기 작업
export const deleteNotice = createAsyncThunk('notices/deleteNotice', async (id) => {
  await api.delete(`/notices/${id}`);
  return id;  // 삭제된 공지사항의 ID를 반환
});

const noticeSlice = createSlice({
  name: 'notices',
  initialState: {
    notices: [],
    status: 'idle',
    error: null,
    totalCount: 0,  // 전체 공지사항 수
    currentPage: 1, // 현재 페이지
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notices = action.payload.notices; // 공지사항 리스트
        state.totalPageNum = action.payload.totalPageNum || 1; // 최소 1페이지 보장
        state.currentPage = action.payload.currentPage || 1; // 현재 페이지 업데이트
      })
      
      .addCase(fetchNotices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNotice.fulfilled, (state, action) => {
        state.notices.push(action.payload);
      })
      .addCase(addNotice.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateNotice.fulfilled, (state, action) => {
        const index = state.notices.findIndex(notice => notice._id === action.payload._id);
        if (index !== -1) {
          state.notices[index] = action.payload;
        }
      })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.notices = state.notices.filter(notice => notice._id !== action.payload);
      })
      .addCase(searchNotices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchNotices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notices = action.payload.notices;
        state.totalPageNum = action.payload.totalPageNum || 0; // totalPageNum이 없을 경우 기본값 설정
        state.currentPage = action.payload.currentPage || 1; // 현재 페이지도 업데이트
      })
      .addCase(searchNotices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(adminsearchNotices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(adminsearchNotices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notices = action.payload.notices;
        state.totalCount = action.payload.totalCount; // 전체 공지사항 수 업데이트
      })
      .addCase(adminsearchNotices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default noticeSlice.reducer;