import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import Footer from "../../common/component/Footer"; // Footer 컴포넌트 임포트
import LandingPageHeader from "./components/LandingPageHeader";
import LandingPageTitle from "./components/LandingPageTitle";
import LandingPageIntro from "./components/LandingPageIntro";
import LandingPageShop from "./components/LandingPageShop";
import LandingPageAbout from "./components/LandingPageAbout";
import LandingPageContent from "./components/LandingPageContent";
import LandingPageOutro from "./components/LandingPageOutro";
import ScrollToTopButton from '../../common/component/FooterDetail/ScrollToTopButton';
import "./Style/LandingPageHeader.css";
import "./Style/LandingPage.css";


const LandingPage = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.product.productList);
  const [query] = useSearchParams();
  const name = query.get("name");

  useEffect(() => {
    dispatch(
      getProductList({
        name,
      })
    );
  }, [query]);

  return (
    <div id="landing-page">
      <LandingPageTitle />
      <LandingPageIntro />
      <LandingPageShop />
      <LandingPageAbout />
      <LandingPageContent />
      <LandingPageOutro />
      <Footer />
    </div>
  );
};

export default LandingPage;