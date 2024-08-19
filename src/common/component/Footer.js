import React from "react";

const Footer = () => {
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
              <li className="sns-icon">
                <i className="fa-brands fa-twitter"></i>
              </li>
              <li className="sns-icon">
                <i className="fa-brands fa-instagram"></i>
              </li>
              <li className="sns-icon last">
                <i className="fa-brands fa-facebook"></i>
              </li>
            </ul>
          </div>
        </div>

        <div className="second-line">
          <div className="second-line-container">
            <ul className="menus">
              <li>이용약관</li>
              <li>개인정보 처리방침</li>
              <li>서비스 이용약관</li>
              <li>배송/환불 규정</li>
              <li>입점 문의</li>
            </ul>
            <ul className="company-info">
              <li>회사명: BLANKSPACE</li>
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
      </div>
    </footer>
  );
};

export default Footer;