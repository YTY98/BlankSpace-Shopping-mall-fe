// import React, { useEffect, useState } from "react";
// import { Container, Row, Col } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import api from "../../../utils/api";
// import ProductCard from "../../LandingPage/components/ProductCard";

// const MyWishlistPage = () => {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user.user); // Redux에서 사용자 정보 가져오기
//   const [wishlistProducts, setWishlistProducts] = useState([]); // 위시리스트 상품 목록 상태

//   useEffect(() => {
//     const fetchWishlistProducts = async () => {
//       try {
//         if (user?.wishlist?.length > 0) {
//           // wishlist 배열이 비어있지 않은 경우에만 요청
//           const response = await api.post("/products/getByIds", {
//             ids: user.wishlist,
//           });

//           setWishlistProducts(response.data.products); // 서버에서 받은 제품 목록 설정
//         }
//       } catch (error) {
//         console.error("Error fetching wishlist products:", error.message);
//       }
//     };

//     // 위시리스트 상품 데이터 가져오기
//     fetchWishlistProducts();
//   }, [user]);

//   return (
//     <Container className="my-wishlist-page">
//       <h2 className="my-4">나의 위시리스트</h2>
//       {wishlistProducts.length > 0 ? (
//         <Row>
//           {wishlistProducts.map((product) => (
//             <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
//               <ProductCard item={product} /> {/* ProductCard 컴포넌트를 사용하여 제품 렌더링 */}
//             </Col>
//           ))}
//         </Row>
//       ) : (
//         <p>위시리스트에 담긴 상품이 없습니다.</p>
//       )}
//     </Container>
//   );
// };

// export default MyWishlistPage;

import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import api from "../../../utils/api";
import ProductCard from "../../LandingPage/components/ProductCard";

const MyWishlistPage = () => {
  const user = useSelector((state) => state.user.user); // Redux에서 사용자 정보 가져오기
  const [wishlistProducts, setWishlistProducts] = useState([]); // 위시리스트 상품 목록 상태

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        if (user?.wishlist?.length > 0) {
          const token = sessionStorage.getItem("token"); // 토큰 가져오기
          if (!token) {
            console.error("인증 토큰이 없습니다.");
            return;
          }

          // 제품 ID 배열을 서버로 전송하여 제품 정보 가져오기
          const response = await api.post(
            "/user/wishlist/products",
            { ids: user.wishlist },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          console.log("위시리스트 제품 정보:", response.data.products); // 제품 정보 로그 출력
          setWishlistProducts(response.data.products); // 서버에서 받은 제품 목록 설정
        }
      } catch (error) {
        console.error("위시리스트 제품을 가져오는 중 오류 발생:", error.message);
      }
    };

    // 위시리스트 상품 데이터 가져오기
    fetchWishlistProducts();
  }, [user]);

  return (
    <Container className="my-wishlist-page">
      <h2 className="my-4">나의 위시리스트</h2>
      {wishlistProducts.length > 0 ? (
        <Row>
          {wishlistProducts.map((product) => (
            <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard item={product} /> {/* ProductCard 컴포넌트를 사용하여 제품 렌더링 */}
            </Col>
          ))}
        </Row>
      ) : (
        <p>위시리스트에 담긴 상품이 없습니다.</p>
      )}
    </Container>
  );
};

export default MyWishlistPage;
