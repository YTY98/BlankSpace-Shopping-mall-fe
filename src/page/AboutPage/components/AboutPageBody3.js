import React from "react";
import FadeUp from "../Animations/FadeUp.js";
import "../style/about.css";


const AboutPageBody3 = () => {

    return (
      <div>
        <img className="body3-image1" src="/image/BS001.png" />
        <div className='body3-outer-flex'>
            <div className='body3-inner-left-flex'>
                <FadeUp>
                  <img className="body3-image2" src="/image/Aboutbody3-1.png" />
                  <img className="body3-image3" src="/image/AboutPage-body3-2.png" />
                </FadeUp>
            </div>
            <div className='body3-inner-right-flex'>  
              <FadeUp>
                <h3 className='body3-header1'>blankspace Value</h3><br></br>
                  <p className='body3-paragraph1'>
                  "Omnis origo styli creativitatem et passionem post se habet. Vera pulchritudo non in perfectione, sed in singularitate et fiducia in se ipsa consistit. Nemo tantum sequendo modos fulgere potest; proprium colorem inveniendum est."
                  </p><br></br>
                  <p className='body3-paragraph2'>
                  
                  Every man has a unique sense of style, and Blankspace exists to amplify it.
                  We offer products that empower men to express their individuality, own their fashion, and command attention. Blankspace is more than a store; it’s a destination for bold expression, authentic connections, and redefining modern style.

                  Our mission is to provide an exceptional shopping experience where comfort meets sophistication. At Blankspace, fashion isn’t just about what you wear — it’s about owning every moment with confidence, character, and undeniable presence.
                  </p>
              </FadeUp>
            </div>
        </div>
      </div>
    );
  };
  
  export default AboutPageBody3;
