import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/cart", { size, productId: id, qty: 1 });
      if (response.status >= 200 && response.status < 300) {
        dispatch(
          showToastMessage({
            message: "카트에 아이템이 추가됐습니다!",
            status: "success",
          })
        );
        return response.data.cartItemQty;
      }
      throw new Error(response.error);
    } catch (error) {
      const errorMessage = error.message || error.data?.error || "카트에 아이템 추가 실패";
      dispatch(
        showToastMessage({
          message: errorMessage,
          status: "error",
        })
      );
      return rejectWithValue(errorMessage);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart");
      if (response.status !== 200) throw new Error(response.error);
      return response.data.data;
    } catch (error) {
      //dispatch(showToastMessage({ message: error, status: "error" }));
      return rejectWithValue(error.error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/cart/${id}`);
      if (response.status !== 200) throw new Error(response.error);
      dispatch(getCartList()); // 삭제 후 전체 카트 목록 다시 가져오기
      return response.data.cartItemQty;
    } catch (error) {
      dispatch(showToastMessage({ message: error, status: "error" }));

      return rejectWithValue(error);
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${id}`, { qty: value });
      if (response.status !== 200) throw new Error(response.error);
      // if (response.status !== 200) throw new Error(response.statusText || "An error occurred");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart/qty");
      if (response.status !== 200) throw new Error(response.error);
      return response.data.qty;
    } catch (error) {
      dispatch(showToastMessage({ message: error, status: "error" }));

      return rejectWithValue(error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartList = action.payload;
        state.cartItemCount = action.payload.length; // cartList의 길이로 갱신
        state.totalPrice = action.payload.reduce(
          (total, item) => total + item.productId.price * item.qty,
          0
        );
      })
      .addCase(getCartList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        const updatedItems = action.payload;
        const updatedItem = updatedItems[0];
        const index = state.cartList.findIndex(
          (item) =>
            item.productId &&
            item.productId._id === updatedItem.productId._id &&
            item.size === updatedItem.size
        );

        if (index !== -1) {
          state.cartList[index] = updatedItem;
        } else {
          console.warn("해당하는 아이템을 찾을 수 없습니다:", updatedItem);
        }

        state.totalPrice = state.cartList.reduce(
          (total, item) =>
            total + (item.productId ? item.productId.price * item.qty : 0),
          0
        );
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cartItemCount = action.payload;
      })
      .addCase(getCartQty.fulfilled, (state, action) => {
        state.cartItemCount = action.payload;
      });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
