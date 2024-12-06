import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars, faBox, faSearch, faShoppingBag, faAngleLeft, faKey } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/user/userSlice";
import { getCartList } from "../../../features/cart/cartSlice";
import "../Style/LandingPageHeader.css";

const LandingPageHeader = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItemCount } = useSelector((state) => state.cart);
  const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [width, setWidth] = useState(0);
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    dispatch(getCartList());
  }, [dispatch]);

  useEffect(() => {
    const landingPage = document.getElementById("landing-page");
    const landingPageHeader = document.getElementById("landing-page-display-flex");
    if (!landingPage) {
      console.warn("landing-page element not found");
      return;
    }

    if (isBlurred) {
      landingPage.classList.add("blurred");
      landingPageHeader.classList.add("blurred");
    } else {
      landingPage.classList.remove("blurred");
      landingPageHeader.classList.remove("blurred");
    }
  }, [isBlurred]);

  const menuList = [
    { name: "Shop", link: "/shop" },
    { name: "Collection", link: "/collection" },
    { name: "Notice", link: "/notice" },
    { name: "Q/A", link: "/qa" },
    { name: "About", link: "/about" }
  ];

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") {
        return navigate("/");
      }
      navigate(`?name=${event.target.value}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const openSidebar = () => {
    setWidth(250);
    setIsBlurred(true);
  };

  const closeSidebar = () => {
    setWidth(0);
    setIsBlurred(false);
  };

  return (
    <div className="landing-page-header">
      <div className="side-menu" style={{ width: width, border: "0px solid"}}>
        <button className="closebtn" onClick={closeSidebar}>
          &times;
        </button>

        <div className="side-menu-list" id="menu-list">
          {menuList.map((menu, index) => (
            <button key={index} onClick={() => navigate(menu.link)}>{menu.name}</button>
          ))}
        </div>
      </div>

      <div className="landing-page-nav-header">
        <div className="landing-page-burger-menu">
          <FontAwesomeIcon icon={faBars} onClick={openSidebar} />
        </div>

        <div>
          <div id="landing-page-display-flex">
            {user ? (
              <div onClick={handleLogout} className="landing-page-nav-icon">
                <FontAwesomeIcon icon={faAngleLeft} />
                {!isMobile && (
                  <span style={{ cursor: "pointer" }}>로그아웃</span>
                )}
              </div>
            ) : (
              <div onClick={() => navigate("/login")} className="landing-page-nav-icon">
                <FontAwesomeIcon icon={faKey} />
                {!isMobile && <span style={{ cursor: "pointer" }}>로그인</span>}
              </div>
            )}
            {user ? (
              <div onClick={() => navigate("/mypage")}className="landing-page-nav-icon"> {/* 내 정보 추가 */}
              <FontAwesomeIcon icon={faUser} />
              {!isMobile && (
                <span style={{ cursor: "pointer" }}>내 정보</span>
              )}
            </div>
            ) : (<div></div>)}

            <div onClick={() => navigate("/cart")} className="landing-page-nav-icon">
              <FontAwesomeIcon icon={faShoppingBag} />
              {!isMobile && (
                <span style={{ cursor: "pointer" }}>{`쇼핑백(${cartItemCount || 0})`}</span>
              )}
            </div>
            {/* <div
              onClick={() => navigate("/account/purchase")}
              className="landing-page-nav-icon"
            >
              <FontAwesomeIcon icon={faBox} />
              {!isMobile && <span style={{ cursor: "pointer" }}>내 주문</span>}
            </div> */}
            {/* {isMobile && (
              <div className="nav-icon" onClick={() => setShowSearchBox(true)}>
                <FontAwesomeIcon icon={faSearch} />
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* admin link */}
      <div className="minwoobabo" style={{width: "100%", display: "flex", justifyContent: "right"}}>
      {user && user.level === "admin" && (
        <Link to="/admin/management?page=1" className="admin-page-link">
          Admin page
        </Link>
      )}
      </div>
    </div>
  );
};

export default LandingPageHeader;
