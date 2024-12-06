import React from "react";
import FadeUp from "../Animations/FadeUp.js";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "../Style/LandingPage.css";

const LandingPageTitle = () => {
  return (
    <div className="title-image">
        <img className="logo-image" src="/image/blankspace-logo-white.png" />
        <FadeUp>
            <Row className="g-0">
                <Col xs={1} className='d-md-none'></Col>
                <Col xs={10} md={{ span: 5, offset: 6 }}>
                    <p className="title-paragraph">
                        Design is the art of discovering essence in a complex world. We find true beauty in simplicity, 
                        expressing more by filling spaces with less.<br /><br />
                        Our collection embodies more than just products; it presents new possibilities by focusing on the essential and shedding the unnecessary in modern life.
                    </p>
                </Col>
            </Row>
        </FadeUp>
        <FadeUp>
            <Row className="g-0">
                <Col xs={12} md={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                    <p className='logo-paragraph'>BLANK<br />&nbsp;SPACE</p>
                </Col>
            </Row>
        </FadeUp>
    </div>
  );
};

export default LandingPageTitle;
