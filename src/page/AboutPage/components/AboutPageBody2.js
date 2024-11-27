import React from "react";
import FadeUp from "../Animations/FadeUp.js";
import "../style/about.css";


const AboutPageBody2 = () => {

    return (
      <div>
        <FadeUp>
        <div className="body2-flex">
            <div className="image-container">
                <img className="body2-image1" src="/image/AboutPage-body2-1.png" alt="Image 1" />
                <div className="hover-text">이미지 1 설명</div>
            </div>
            <div className="image-container">
                <img className="body2-image2" src="/image/AboutPage-body2-2.png" alt="Image 2" />
                <div className="hover-text">이미지 2 설명</div>
            </div>
            <div className="image-container">
                <img className="body2-image3" src="/image/AboutPage-body2-3.png" alt="Image 3" />
                <div className="hover-text">이미지 3 설명</div>
            </div>
        </div>

        </FadeUp>
      </div>
    );
  };
  
  export default AboutPageBody2;
