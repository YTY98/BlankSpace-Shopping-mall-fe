import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/product", { params: query });
      if (response.status !== 200) throw new Error(response.error);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/${id}`);
      if (response.status !== 200) throw new Error(response.error);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const convertedWashMethods = formData.washMethods.map((value) => {
        if (typeof value === 'object') return value;
        return {
          label: value,
          value: value
        };
      });

      const response = await api.post("/product", { ...formData, washMethods: convertedWashMethods });
      if (response.status !== 200) throw new Error(response.error);

      dispatch(showToastMessage({ message: "상품 생성 완료", status: "success" }));
      dispatch(getProductList({ page: 1 }));

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/product/${id}`);
      if (response.status !== 200) throw new Error(response.error);
      dispatch(showToastMessage({ message: "상품 삭제 완료", status: "success" }));
      dispatch(getProductList({ page: 1 }));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
    try {
      const convertedWashMethods = formData.washMethods.map((value) => {
        if (typeof value === 'object') return value;
        return {
          label: value,
          value: value
        };
      });

      const response = await api.put(`/product/${id}`, { ...formData, washMethods: convertedWashMethods });
      if (response.status !== 200) throw new Error(response.error);

      dispatch(showToastMessage({ message: "상품 수정 완료", status: "success" }));
      dispatch(getProductList({ page: 1 }));

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: {
      id: null,
      name: "",
      height: null,
      weight: null,
      washMethods: [],
    },
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getProductList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload.data.map((product) => ({
          ...product,
          height: product.height || null,
          weight: product.weight || null,
          washMethods: product.washMethods || [],
        }));
        state.error = "";
        state.totalPageNum = action.payload.totalPageNum;
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        state.success = true;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getProductDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.selectedProduct = {
          ...action.payload,
          washMethods: action.payload.washMethods || [],
        };
        state.loading = false;
        state.error = "";
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedProduct, setFilteredList, clearError } = productSlice.actions;
export default productSlice.reducer;

