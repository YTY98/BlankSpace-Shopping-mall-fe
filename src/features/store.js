import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import uiSlice from "./common/uiSlice";
import productSlice from "./product/productSlice";
import cartSlice from "./cart/cartSlice";
import orderSlice from "./order/orderSlice";
import noticeReducer from './notice/noticeSlice'; 
import qnaSlice from "./qna/qnaSlice";
import reviewSlice from './Review/ReviewSlice'
const store = configureStore({
  reducer: {
    user: userSlice,
    product: productSlice,
    reviews: reviewSlice, 
    cart: cartSlice,
    ui: uiSlice,
    order: orderSlice,
    notice: noticeReducer,
    qna: qnaSlice
  },
});


export default store;