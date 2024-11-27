import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../common/component/Sidebar";
import Navbar from "../common/component/Navbar";
import ToastMessage from "../common/component/ToastMessage";
import { loginWithToken } from "../features/user/userSlice";
import { getCartQty } from "../features/cart/cartSlice";
import LandingPageHeader from "../page/LandingPage/components/LandingPageHeader";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isLandingPage = location.pathname === "/";

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(loginWithToken());
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(getCartQty());
    }
  }, [user, dispatch]);
  
  return (
    <div>
      <ToastMessage />
      {location.pathname.includes("admin") ? (
        <Row className="vh-100">
          <Col xs={12} md={3} className="sidebar mobile-sidebar">
            <Sidebar />
          </Col>
          <Col xs={12} md={9}>
            {children}
          </Col>
        </Row>
      ) : (
        <>
          {/* 랜딩 페이지만 전용 헤더를 호출하도록 변경 */}
          {isLandingPage ? <LandingPageHeader user={user} /> : <Navbar user={user} />}
          {/* <Navbar user={user} /> */}
          
          {children}
        </>
      )}
    </div>
  );
};

export default AppLayout;
