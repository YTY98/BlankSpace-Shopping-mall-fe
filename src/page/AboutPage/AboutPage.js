import React, { useEffect } from "react";
import "./style/about.css";
import AboutPageBody1 from "./components/AboutPageBody1";
import AboutPageBody2 from "./components/AboutPageBody2";
import AboutPageBody3 from "./components/AboutPageBody3";
import Footer from "../../common/component/Footer";

const AboutPage = () => {

  return (
    <div>
      <AboutPageBody1 />
      <AboutPageBody2 />
      <AboutPageBody3 />
      <Footer />
    </div>
  );
};

export default AboutPage;