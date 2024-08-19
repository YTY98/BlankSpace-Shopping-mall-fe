import React from 'react';
import Carousel from 'react-bootstrap/Carousel';



const Slider =() => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block custom-img"
          src="/image/BS004.png" alt="BLANKSPACE"
        />
        
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block custom-img"
          src="/image/BS001.png" alt="BLANKSPACE"
        />
        
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block custom-img"
           src="/image/BS002.png" alt="BLANKSPACE"
        />
        
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block custom-img"
           src="/image/BS003.png" alt="BLANKSPACE"
        />
        
      </Carousel.Item>
    </Carousel>
  );
}

export default Slider;