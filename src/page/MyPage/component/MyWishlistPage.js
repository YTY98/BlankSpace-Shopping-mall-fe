import React, { useEffect, useState } from "react";
import { Container, Row, Col, Pagination } from "react-bootstrap";
import { useSelector } from "react-redux";
import api from "../../../utils/api";
import ProductCard from "../../LandingPage/components/ProductCard";

const MyWishlistPage = () => {
  const user = useSelector((state) => state.user.user);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        if (user?.wishlist?.length > 0) {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("인증 토큰이 없습니다.");
            return;
          }

          const response = await api.post(
            "/user/wishlist/products",
            { 
              ids: user.wishlist,
              page: currentPage,
              limit: itemsPerPage
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.status === 200) {
            setWishlistProducts(response.data.products);
            setTotalPages(response.data.totalPages);
          }
        } else {
          setWishlistProducts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("위시리스트 제품을 가져오는 중 오류 발생:", error.message);
        setWishlistProducts([]);
        setTotalPages(1);
      }
    };

    fetchWishlistProducts();
  }, [user?.wishlist, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <Container className="my-wishlist-page">
      <h2 className="my-4">나의 위시리스트</h2>
      {wishlistProducts.length > 0 ? (
        <>
          <Row>
            {wishlistProducts.map((product) => (
              <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard item={product} />
              </Col>
            ))}
          </Row>
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                />
                {renderPagination()}
                <Pagination.Next 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <p>위시리스트에 담긴 상품이 없습니다.</p>
      )}
    </Container>
  );
};

export default MyWishlistPage;
