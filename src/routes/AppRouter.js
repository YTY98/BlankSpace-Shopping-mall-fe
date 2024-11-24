import React from "react";
import { Route, Routes } from "react-router";
import AdminOrderPage from "../page/AdminOrderPage/AdminOrderPage";
import AdminProduct from "../page/AdminProductPage/AdminProductPage";
import CartPage from "../page/CartPage/CartPage";
import Login from "../page/LoginPage/LoginPage";
import OrderCompletePage from "../page/OrderCompletePage/OrderCompletePage";
import PaymentPage from "../page/PaymentPage/PaymentPage";
import ProductAll from "../page/LandingPage/LandingPage";
import ProductDetail from "../page/ProductDetailPage/ProductDetailPage";
import RegisterPage from "../page/RegisterPage/RegisterPage";
import PrivateRoute from "./PrivateRoute";
import CollectionPage from "../page/CollectionPage";
import ShopPage from "../page/ShopPage";
import NoticePage from "../page/NoticePage/NoticePage";
import NoticeDetailPage from "../page/NoticeDetailPage/NoticeDetailPage";
import WritePage from '../page/WritePage/WritePage';
import AdminNoticePage from '../page/AdminNoticePage/AdminNoticePage';
import AdminDashBoardPage from "../page/AdminDashBoardPage/AdminDashBoardPage";
import QueryPage from "../page/QueryPage/QueryPage";
import Qna from "../page/Q&APage";
import AnswerPage from "../page/AnswerPage/AnswerPage";
import MyPage from "../page/MyPage/MyPage";
import MyOrderPage from "../page/MyPage/component/MyOrderPage";
import MyProfilePage from "../page/MyPage/component/MyProfilePage";
import MyWishlistPage from "../page/MyPage/component/MyWishlistPage";
import MyMileagePage from "../page/MyPage/component/MyMileagePage";
import MyMembershipPage from "../page/MyPage/component/MyMembershipPage";
import MyQnaPage from "../page/MyPage/component/MyQnaPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductAll />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/qa" element={<Qna />} />
      <Route path="/qa/:id" element={<AnswerPage />} />
      <Route element={<PrivateRoute permissionLevel="customer" />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<OrderCompletePage />} />
        <Route path="/account/purchase" element={<MyPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/notice/:id" element={<NoticeDetailPage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/product/:id/Query" element={<QueryPage />}/>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/order" element={<MyOrderPage />} />
        <Route path="/mypage/profile" element={<MyProfilePage />} />
        <Route path="/mypage/wishlist" element={<MyWishlistPage />} />
        <Route path="/mypage/mileage" element={<MyMileagePage />} />
        <Route path="/mypage/membership" element={<MyMembershipPage />} />
        <Route path="/mypage/qna" element={<MyQnaPage />} />
      </Route>
      <Route element={<PrivateRoute permissionLevel="admin" />}>
        <Route path="/admin/management" element={<AdminDashBoardPage/>} />
        <Route path="/admin/product" element={<AdminProduct />} />
        <Route path="/admin/order" element={<AdminOrderPage />} />
        <Route path="/admin/notices" element={<AdminNoticePage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;

