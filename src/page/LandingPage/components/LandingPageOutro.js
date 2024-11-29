import React from "react";
import FadeUp from "../Animations/FadeUp.js";
import "../Style/LandingPage.css"

const LandingPageOutro = () => {
  return (
    <div>
      <div className='outro-area'>
        <img className='outro-image' src="/image/LandingPage-outro.png" />
        <p className='outro-paragraph-1'>Elevate Your Style with Minimalism.</p>
        <p className='outro-paragraph-2'>
          Discover difference in the minimalism.<br />
          Our curated minimalist designs transform your<br />
          style into something simple yet sophisticated.
        </p>
      </div>
    </div>
  );
};

export default LandingPageOutro;
