import React from "react";
import FadeUp from "../Animations/FadeUp.js";
import "../Style/LandingPage.css"

const LandingPageIntro = () => {
  return (
    <div>
        <div className='intro-outer-flex-1'>
            <img className='intro-image-1-1' src='/image/landingpage_intro2-1.png' />
            <div className='intro-inner-flex'>
                <h2 className='intro-header-1'>STYLE</h2>
                <p className='intro-paragraph-1'>A style beheld by none elsewhere, <br/>
                perfected in this place alone.</p>
                <img className='intro-image-1-2' src='/image/LandingPage-intro1-2.png' />
            </div>
        </div>
        <div className='intro-outer-flex-2'>
            <div className='intro-inner-flex'>
                <h2 className='intro-header-2'>VIBE</h2>
                <p className='intro-paragraph-2'>With fashion that bear thy essence, <br/>
                seize command of the very atmosphere</p>
                <img className='intro-image-2-1' src='/image/LandingPage-intro2-2.png' />
            </div>
            <img className='intro-image-2-2' src='/image/landingPageIntro2-2.png' />
        </div>
    </div>
  );
};

export default LandingPageIntro;
