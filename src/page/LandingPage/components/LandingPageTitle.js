import React from "react";
import FadeUp from "../Animations/FadeUp.js";
import "../Style/LandingPage.css";

const LandingPageTitle = () => {
  return (
    <div>
        <div className="title-area">
            <img
                className="title-image"
                src="/image/LandingPage-background.png"
            />
            <img className="logo-image" src="/image/blankspace-logo-white.png" />
            <div className="title-paragraph-area">
                <FadeUp>
                    <p className="title-paragraph">
                        Design is the art of discovering essence in a complex world. We find true beauty in simplicity, 
                        expressing more by filling spaces with less.<br /><br />

                        Our collection embodies more than just products; it presents new possibilities by focusing on the essential and shedding the unnecessary in modern life.
                    </p>
                </FadeUp>
            </div>
            <div className='logo-paragraph-area'>
                <FadeUp>
                    <p className='logo-paragraph'>BLANK<br />&nbsp;SPACE</p>
                </FadeUp>
            </div>
        </div>
    </div>
  );
};

export default LandingPageTitle;
