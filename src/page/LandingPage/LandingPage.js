// import React, { useEffect } from "react";
// import ProductCard from "./components/ProductCard";
// import { Row, Col, Container } from "react-bootstrap";
// import { useSearchParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { getProductList } from "../../features/product/productSlice";
// import Footer from "../../common/component/Footer"; // Footer 컴포넌트 임포트
// import Slider from "../../common/component/Slider";

// const LandingPage = () => {
//   const dispatch = useDispatch();

//   const productList = useSelector((state) => state.product.productList);
//   const [query] = useSearchParams();
//   const name = query.get("name");

//   useEffect(() => {
//     dispatch(
//       getProductList({
//         name,
//       })
//     );
//   }, [query]);

//   return (
//     <div>
//       <Slider />
//       {/*<Container>
//         <Row>
//           {productList.length > 0 ? (
//             productList.map((item) => (
//               <Col md={3} sm={12} key={item._id}>
//                 <ProductCard item={item} />
//               </Col>
//             ))
//           ) : (
//             <div className="text-align-center empty-bag">
//               {name === "" ? (
//                 <h2>등록된 상품이 없습니다!</h2>
//               ) : (
//                 <h2>{name}과 일치한 상품이 없습니다!</h2>
//               )}
//             </div>
//           )}
//         </Row>
//       </Container> */}

//       <Footer />
//     </div>
//   );
// };

// export default LandingPage;

import React, { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import Footer from "../../common/component/Footer"; // Footer 컴포넌트 임포트
import Slider from "../../common/component/Slider";
import Body from "../../common/component/Body";

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
      <Slider />
      {/* <Container>
        <Row>
          {productList.length > 0 ? (
            productList.map((item) => (
              <Col md={3} sm={12} key={item._id}>
                <ProductCard item={item} />
              </Col>
            ))
          ) : (
            <div className="text-align-center empty-bag">
              {name === "" ? (
                <h2>등록된 상품이 없습니다!</h2>
              ) : (
                <h2>{name}과 일치한 상품이 없습니다!</h2>
              )}
            </div>
          )}
        </Row>
      </Container>  */}
      <Body />

      <Footer />
    </div>
  );
};

export default LandingPage;
