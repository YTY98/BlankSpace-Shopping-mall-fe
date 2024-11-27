import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Footer = () => {

  /* 모바일 코드 */
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // 화면 크기가 768px 이하일 경우 모바일로 간주
      setIsMobile(window.innerWidth <= 768);
    };

    // 컴포넌트가 마운트되었을 때 실행
    handleResize();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 리사이즈 이벤트 리스너 제거 (컴포넌트 언마운트 시)
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* 랜딩페이지에서만 보이게 */
  const location = useLocation();
  const showScrollToTopButton = location.pathname === "/";

  /* Scroll To Top 기능 */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const menuList = [
    { name: "이용 약관", link: "/term" },
    { name: "개인정보 처리방침", link: "/per" },
    { name: "이용 안내", link: "/service" },
    { name: "배송/환불 규정", link: "/send" },
    { name: "입점 문의", link: "/store" }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="first-line">
          <img
            src="/image/blankspace-logo.png"
            width="120px"
            height="40px"
            alt="Logo"
          />
          <div>
            <ul className="sns-area">
              <a className="sns-link" href="https://www.naver.com" target="_blank" rel="noopener noreferrer">
                <li className="sns-icon">
                  <i className="fa-solid fa-n"></i>
                </li>
              </a>
              <a className="sns-link" href="https://www.naver.com" target="_blank" rel="noopener noreferrer">
                <li className="sns-icon">
                  <i className="fa-brands fa-instagram"></i>
                </li>
              </a>
              <a className="sns-link" href="https://www.naver.com" target="_blank" rel="noopener noreferrer">
                <li className="sns-icon last">
                  <i className="fa-brands fa-youtube"></i>
                </li>
              </a>
            </ul>
          </div>
        </div>

        <div className="second-line">
          <div className="second-line-container">
            <ul className="menus">
              {menuList.map((menu, index) => (
                <li key={index}>
                  <Link to={menu.link}>{menu.name}</Link>
                </li>
              ))}
            </ul>
            <ul className="company-info">
              <li onclick>회사명: BLANKSPACE</li>
              <li>사업자등록번호: 220-11-1234</li>
            </ul>
            <div>주소: 경상북도 경산시 대학로 280</div>
            <ul className="company-contact">
              <li>TEL: 010-9955-5354</li>
              <li>대표: 양태영</li>
              <li>FAX: 042-1234-5678</li>
              <li>E-MAIL: blankspace@naver.com</li>
            </ul>
            <div className="second-line-container-bottom">
              <div className="vision">
                미니멀한 패션을 추구하는 편집샵은 고객들에게 심플하면서도 세련된 스타일을 제안하며, 감각적이고 독창적인 분위기를 제공합니다.
              </div>
              <div className="slogan">
                Where Minimal Meets Infinite Possibilities
              </div>
              <div>(c) blankspace</div>
            </div>
          </div>
          <div className="info">
            <div className="phone-number">
              <div>고객센터</div>
              <div>053-123-4567</div>
            </div>

            <div className="work-hour">
              <div>
                <span>평일</span> 오전 10시 ~ 오후 5시
              </div>
              <div>
                <span>점심</span> 오후 12시 ~ 오후 2시
              </div>
              <div>
                <span>평일</span> 주말/공휴일
              </div>
            </div>
          </div>
        </div>

        {/* Scroll To Top Button */}
        {isMobile && showScrollToTopButton && (
          <div>
            <i
              className="fa-solid fa-arrow-up"
              onClick={scrollToTop}
              style={{
                position: "absolute",
                top: "10%",
                right: "0%",
                transform: "translate(-50%, -50%)",
                padding: "8px 10px",
                fontSize: "16px",
                backgroundColor: "#000000",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            ></i>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;