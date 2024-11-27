import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const checkScroll = () => {
    if (window.scrollY > 100) {
      setIsVisible(true); // 스크롤 위치가 100px 이상이면 버튼을 보이게
    } else {
      setIsVisible(false); // 스크롤이 맨 위에 있으면 버튼을 숨김
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll); // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리
  }, []);

  return (
    isVisible && (
      <div style={{ position: "sticky", bottom: "20px", textAlign: "right" }}>
        <i
          className="fa-solid fa-arrow-up"
          onClick={scrollToTop}
          style={{
            padding: "8px 10px",
            fontSize: "16px",
            backgroundColor: "#000000",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        ></i>
      </div>
    )
  );
};

export default ScrollToTopButton;
