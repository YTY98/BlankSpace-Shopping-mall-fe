import React from "react";
import FadeUp from "../Animations/FadeUp.js";
import "../style/about.css";

const AboutPageBody1 = () => {

    return (
      <div>
        <div className="body1-outer-flex">
            <div className="body1-inner-left-flex">

              <FadeUp>
                <span className="body1-firsttext">
                  very man possesses unique beauty, and Blankspace aims to accentuate<br></br> that beauty by offering a variety of products that allow men to freely express their style.<br></br> Our store goes beyond merely selling products; we prioritize communication<br></br> and empathy with our customers. At Blankspace, we want you to enjoy shopping in a comfortable atmosphere and strive to make your special moments even more extraordinary.
                </span>
              </FadeUp>

              <FadeUp>
                <hr className='body1-hr1'/>

                <p className='body1-paragraph1'>
                  <h3 className='body1-header1'>blankspace Info</h3><br />

                  <strong>OFFICE</strong><br />
                  280, Daehak-ro, Gyeongsan-si, Gyeongsangbuk-do, Republic of Korea<br /><br />
                  
                  <strong>CONTACT</strong><br />
                  Email . blankspace@naver.com | CS center . 010-9955-5354 <br /><br />

                  <strong>INSTA</strong><br />
                  @blankspace
                </p>
              </FadeUp>

              <FadeUp>
                <img className="body1-image1" src="/image/BS003.png" />
              </FadeUp>

            </div>
            <div className="body1-inner-right-flex">

              <FadeUp>
                <h3 className='body1-header2'>blankspace about.</h3> 
                <p className='body1-paragraph2'>
                  Hello, I'm Tae Young, the owner of Blankspace. It's my pleasure to welcome you to an inviting atmosphere and provide a unique shopping experience for men. <br /><br />

                  Blankspace showcases fashion items designed with consideration for the diverse styles and preferences of men. The warm and sophisticated products will undoubtedly add beauty to your daily life.
                </p>
              </FadeUp>

              <FadeUp>
                <img className="body1-image2" src="/image/AboutPage-body1.png" />
              </FadeUp>
            </div>
        </div>
      </div>
    );
  };
  
  export default AboutPageBody1;