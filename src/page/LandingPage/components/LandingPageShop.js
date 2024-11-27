import React from "react";
import FadeUp from "../Animations/FadeUp.js";
import { useNavigate } from "react-router-dom";
import "../Style/LandingPage.css"

const LandingPageShop = () => {
  const navigate = useNavigate();

  const gotoShop = () => {
    navigate('/shop');
  };

  return (
    <div>
      <div className='shop-outer-flex'>
        <FadeUp>
        <div className='shop-inner-flex-1'>
          <div className='shop-inner-inner-flex-1'>
            <span className='shop-span-1'>
              Blankspace consistently offers you new discoveries with diverse collections
              updated every season and every week. Reflecting the latest trends,
              we provide a variety of options for men to find their own unique style.</span>
            <img className='shop-image-1' src='/image/LandingPage-shop-1.png' />
          </div>
          <div className='shop-span-2-flex-media'>
            <span className='shop-span-2-media'>Blankspace pursues 
            a sophisticated style along with comfortable wear.</span>
          </div>
          <div className='shop-inner-inner-flex-2'>
            <span className='shop-span-2'>Blankspace pursues 
              a sophisticated style along with comfortable wear.</span>
            <img className='shop-image-2' src='/image/LandingPage-shop-2.png' />
            <button className='shop-button-1' onClick={gotoShop}>Buy now</button>
            <span className='shop-span-3'></span>
          </div>
        </div>
        </FadeUp>
        <FadeUp>
        <div className='shop-inner-flex-2'>
          <p className='shop-header-1'>New Item<br />Available</p>
          <div className='shop-inner-inner-flex-3'>
            <p className='shop-paragraph-1'>Experience comfortable and sophisticated
              man's fashion at Blankspace. Join us in discovering your unique style 
              and making special moments even more fashionable. Your space is always here for you!</p>
            <button className='shop-button-2' onClick={gotoShop}>Buy now</button>
            <span className='shop-span-4'></span>
          </div>
        </div>
        </FadeUp>
        <FadeUp>
        <div className='shop-inner-flex-3'>
          <img className='shop-image-3' src='/image/LandingPage-shop-3.png' />
          <img className='shop-image-4' src='/image/landingpage-shop-5.png' />
        </div>
        </FadeUp>
      </div>
    </div>
  );
};

export default LandingPageShop;
