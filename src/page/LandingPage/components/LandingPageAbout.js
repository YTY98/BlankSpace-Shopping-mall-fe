import React from "react";
import FadeUp from "../Animations/FadeUp.js";
import { useNavigate } from "react-router-dom";
import "../Style/LandingPage.css"

const LandingPageAbout = () => {
  const navigate = useNavigate();

  const gotoAbout = () => {
    navigate('/about');
  };

  return (
    <div>
      <FadeUp>
      <div className='about-flex-1'>
        <p className='about-paragraph-1'>
          <h5 className='about-header-1'>About</h5> 
          "BLANKSPACE is an online sanctuary celebrating minimalism and elegance. Curating simple, high-quality designs, it inspires a lifestyle where less is more."
          <br />
          <br />
          <span className='about-span-1'>-- blankspace, 2024</span>
        </p>
        <img className='about-image-1' src='/image/landingAbout2.png' />
      </div>
      </FadeUp>
      <FadeUp>
      <div className='about-flex-2'>
        <p className='about-paragraph-2'>
          <span className='about-span-2'>
            BLANKSPACE is an online sanctuary that celebrates minimalism and the beauty of restraint. In a world of excess, we offer a curated selection of elegant, thoughtfully designed pieces that invite customers to appreciate the art of simplicity and subtlety.
          </span>
          <span className='about-span-3'>
            Each piece at BLANKSPACE is selected for its quality and craftsmanship, offering timeless, functional designs that enhance life without overwhelming it.
          </span>
          <span className='about-span-4'>
            At BLANKSPACE, we inspire a lifestyle where less truly becomes more. By focusing on the essentials, we encourage clarity, intention, and a deeper appreciation for the quiet power of simplicity.
          </span>
          <button className='about-button-1' onClick={gotoAbout}>Learn About Us</button>
        </p>
      </div>
      </FadeUp>
    </div>
  );
};

export default LandingPageAbout;
