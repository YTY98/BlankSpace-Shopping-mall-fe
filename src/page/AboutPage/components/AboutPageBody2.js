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
                <div className="hover-text">"Value: BLANKSPACE is a shopping destination for men who value minimalism. We offer sleek and functional designs that stand out through simplicity, helping you refine your personal style. At BLANKSPACE, we believe in removing the unnecessary to focus on what truly matters, bringing minimalism into every aspect of your lifestyle."</div>
            </div>
            <div className="image-container">
                <img className="body2-image2" src="/image/AboutPageBody2_image.png" alt="Image 2" />
                <div className="hover-text">"Every man possesses a distinct sense of style, and BLANKSPACE aims to elevate that individuality by offering a curated selection of sleek and modern fashion pieces. Our collection empowers men to effortlessly express their unique style with confidence and sophistication."</div>
            </div>
            <div className="image-container">
                <img className="body2-image3" src="/image/AboutPageBody-image2.png" alt="Image 3" />
                <div className="hover-text">"BLANKSPACE believes in the power of fashion to define a man's vibe and presence. Our curated collection of sleek and modern designs goes beyond clothing — it’s a statement of your style and confidence. Discover your unique charm and create an unforgettable aura with BLANKSPACE."</div>
            </div>
        </div>

        </FadeUp>
      </div>
    );
  };
  
  export default AboutPageBody2;
