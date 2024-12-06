import React, { useState, useEffect } from "react";
import FadeUp from "../Animations/FadeUp.js";
import "../Style/LandingPage.css"

const LandingPageContent = () => {

    // 이미지 목록
    const images = [
        '/image/landingpageim0021.png',
        '/image/landingpageim0022.png',
        '/image/landingpageim027.png',
        '/image/landingpageim0024.png',
        '/image/landingpageim0025.png',
        '/image/LandingPage-intro1-1.png',
        '/image/landingpageim-025.png',
        '/image/landingpage026.png',
        '/image/landing026.png',
        '/image/Collection10.png',
        '/image/landingpageim026.png',
        '/image/Collection12.png'
    ];

    // 보여줄 사진 개수
    const [visibleCount, setVisibleCount] = useState(6);

    // 창 크기에 따라 보여줄 사진 개수
    const updateVisibleCount = () => {
        if (window.innerWidth < 600) { // 모바일. 600px.
            setVisibleCount(6);
        } else { // 태블릿, 데스크탑
            setVisibleCount(12);
        }
    };

    // 창 크기가 변함에 따라 updateVisibleCount 재조정
    useEffect(() => {
        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);

        return () => {
            window.removeEventListener('resize', updateVisibleCount);
        };
    }, []);

    // 사진 더보기 버튼
    const showMore = () => {
        setVisibleCount(visibleCount + 6);
    };    

    return (
    <div>
        <div className='content-outer-flex'>
            <FadeUp>
                <h1 className='content-header-1'>BLANKSPACE</h1>
                <div className='content-inner-flex-1'>
                    <img className='content-image-1' src='/image/LandingPage-content-1.png' />
                    <img className='content-image-2' src='/image/LandingPage-content-2.png' />
                </div>
                <hr className='content-horizental-line' />
            </FadeUp>
            <FadeUp>
                <div className='content-inner-flex-2'>
                    <div>
                        <h5 className='content-header-2'>Follow us as we create special moments together.</h5>
                        <h2 className='content-header-3'>@BLANKSPACE</h2>
                    </div>
                    
                    <div className="content-grid">
                        {images.slice(0, visibleCount).map((src, index) => (
                            <img key={index} className="content-grid-item" src={src} alt={`Collection ${index + 1}`} />
                        ))}
                    </div>

                    {visibleCount < images.length && (
                        <button className="content-image-show-more-button" onClick={showMore}>더보기</button>
                    )}
                </div>
            </FadeUp>
        </div>
    </div>
  );
};

export default LandingPageContent;
