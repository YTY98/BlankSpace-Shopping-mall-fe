import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  Accordion,
  Table,
  ProgressBar,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ColorRing } from "react-loader-spinner";
import { currencyFormat } from "../../utils/number";
import "./style/productDetail.style.css";
import { getProductDetail } from "../../features/product/productSlice";
import { addToCart } from "../../features/cart/cartSlice";
import SizeGuideModal from "./components/SizeGuideModal";
import { getReviews } from "../../features/Review/ReviewSlice";
import Footer from "../../common/component/Footer";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const loading = useSelector((state) => state.product.loading);
  const [size, setSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const error = useSelector((state) => state.product.error);
  const [showModal, setShowModal] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const thumbnailsPerPage = 6;
  const reviews = useSelector((state) => state.reviews.reviews);

  const [showReviews, setShowReviews] = useState(false);

  const getRatingCounts = () => {
    const counts = [0, 0, 0, 0, 0]; // 별 1~5점에 대한 카운트
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[review.rating - 1]++;
      }
    });
    return counts;
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // 채워진 별 개수
    const emptyStars = 5 - fullStars; // 빈 별 개수

    // 채워진 별과 빈 별을 나란히 출력
    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <span key={`full-${index}`} className="star full-star">
            ★
          </span>
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={`empty-${index}`} className="star empty-star">
            ☆
          </span>
        ))}
      </>
    );
  };
  const ratingCounts = getRatingCounts();
  const totalReviews = reviews.length;

  useEffect(() => {
    dispatch(getProductDetail(id));
    dispatch(getReviews(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedProduct?.image?.length > 0) {
      setMainImage(selectedProduct.image[0]); // 'image'로 접근
    } else {
      console.log("No images available for this product.");
    }
  }, [selectedProduct]);

  const addItemToCart = () => {
    if (size === "") {
      setSizeError(true);
      return;
    }
    setSizeError(false);

    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(addToCart({ id, size }));
  };

  const selectSize = (value) => {
    if (sizeError) setSizeError(false);
    setSize(value);
  };

  useEffect(() => {
    dispatch(getProductDetail(id));
  }, [id, dispatch]);

  const handlePreviousThumbnails = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleNextThumbnails = () => {
    if (
      selectedProduct?.image &&
      startIndex + thumbnailsPerPage < selectedProduct.image.length
    ) {
      setStartIndex(startIndex + 1);
    }
  };

  if (loading || !selectedProduct) {
    return (
      <ColorRing
        visible
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
    );
  }

  return (
    <div>
      <Container className="product-detail-card">
        <Row>
          <Col sm={2} className="thumbnail-gallery">
            {/* 위로 이동 버튼 */}
            {selectedProduct.image?.length > thumbnailsPerPage && (
              <Button
                variant="light"
                className="arrow-button"
                onClick={handlePreviousThumbnails}
                disabled={startIndex === 0}
              >
                ↑
              </Button>
            )}

            {/* 썸네일 리스트 */}
            <div className="thumbnails-wrapper">
              {selectedProduct.image &&
                selectedProduct.image
                  .slice(startIndex, startIndex + thumbnailsPerPage)
                  .map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index}`}
                      className={`thumbnail-image ${
                        mainImage === image ? "active" : ""
                      }`}
                      onClick={() => setMainImage(image)}
                    />
                  ))}
            </div>

            {/* 아래로 이동 버튼 */}
            {selectedProduct.image?.length > thumbnailsPerPage && (
              <Button
                variant="light"
                className="arrow-button"
                onClick={handleNextThumbnails}
                disabled={
                  startIndex + thumbnailsPerPage >= selectedProduct.image.length
                }
              >
                ↓
              </Button>
            )}
          </Col>

          <Col sm={6} className="main-image-container">
            <img
              src={mainImage || selectedProduct.image?.[0] || ""}
              className="main-image"
              alt="product"
            />
          </Col>

          <Col className="product-info-area" sm={4}>
            <div className="product-info-header">
              {selectedProduct.name || "상품명 없음"}
            </div>
            <div className="product-info-price">
              ₩ {currencyFormat(selectedProduct.price || 0)}
            </div>
            <div className="product-info-des">
              {selectedProduct.description || "설명 없음"}
            </div>

            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic-button">
                {size ? `SIZE : ${size.toUpperCase()}` : "사이즈 선택"}
              </Dropdown.Toggle>
              <Dropdown.Menu className="custom-dropdown-menu">
                {selectedProduct?.stock &&
                  Object.keys(selectedProduct.stock).map((item, index) => (
                    <Dropdown.Item
                      eventKey={item}
                      disabled={selectedProduct.stock[item] <= 0}
                      key={index}
                      onClick={() => selectSize(item)}
                    >
                      {item.toUpperCase()}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
            <div className="warning-message">
              {sizeError && "사이즈를 선택해주세요."}
            </div>

            <Button
              variant="dark"
              className="size-drop-down mt-2"
              onClick={addItemToCart}
            >
              ADD TO CART
            </Button>

            <Button
              variant="outline-dark"
              className="size-drop-down mt-3"
              onClick={() => setShowModal(true)}
            >
              사이즈 가이드
            </Button>

            <SizeGuideModal
              show={showModal}
              onClose={() => setShowModal(false)}
              height={selectedProduct.height}
              weight={selectedProduct.weight}
            />

            <Accordion defaultActiveKey="0" className="mt-4">
              <Accordion.Item eventKey="0">
                <Accordion.Header>세탁 방법</Accordion.Header>
                <Accordion.Body>
                  {selectedProduct.washMethods &&
                  selectedProduct.washMethods.length > 0 ? (
                    <ul>
                      {selectedProduct.washMethods.map((method, index) => (
                        <li key={index}>
                          <strong>{method.label}</strong>
                          {method.image && (
                            <img
                              src={method.image}
                              alt={method.label}
                              width="50"
                              height="50"
                              style={{ marginLeft: "10px" }}
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>세탁 방법 정보가 없습니다.</p>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Accordion defaultActiveKey="0" variant="dark" className="mt-2">
              <Accordion.Header>배송지</Accordion.Header>
              <Accordion.Body>
                <p>50,000원 이상구매시 무료배송</p>
                <p>출고일부터: 3-5 일입니다</p>
              </Accordion.Body>
            </Accordion>

            <Row>
              <div className="mt-3">
                <Button
                  variant="secondary"
                  className="query-button"
                  onClick={() => navigate(`/product/${id}/Query`)}
                >
                  문의
                </Button>
                <Button
                  variant="secondary"
                  className="review-button"
                  onClick={() => setShowReviews(!showReviews)} // 후기 버튼 클릭시 토글
                >
                  후기
                </Button>
              </div>
            </Row>
          </Col>
        </Row>
        {/* 리뷰 섹션 */}
        {showReviews && (
          <div
            style={{ display: showReviews ? "block" : "none" }}
            className="review-page mt-5"
          >
            <h2>리뷰 ({totalReviews})</h2>

            <Row className="review-container">
              {/* 평균 별점 */}

              {/* 별점별 리뷰 통계 */}
              <Row>
                <Col sm={4} className="ReviewOverall">
                  {/* TODO: 질문 헤드 */}
                  <div className="ReviewAverage">
                    <span style={{ fontSize: "50px" }}>
                      {renderStars(calculateAverageRating())}
                    </span>
                    <span className="averageContent">
                      <br />
                      평균 별점 {calculateAverageRating()}
                    </span>
                  </div>
                </Col>
                <Col sm={8}>
                  <div className="rating-statistics">
                    {ratingCounts.map((count, index) => (
                      <div key={index} className="rating-row">
                        <div className="rating-bar-label">
                          {renderStars(5 - index)}
                        </div>{" "}
                        {/* 별점 5, 4, 3 등 */}
                        <div className="rating-bar">
                          <div
                            className="rating-bar-filled"
                            style={{
                              width: `${(count / totalReviews) * 100}%`,
                            }}
                          >
                            <ProgressBar striped variant="success" now={100} />
                          </div>
                        </div>
                        <div className="rating-bar-count">{count} 리뷰</div>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
              <Row sm={8} md={8}>
                {console.log("Reviews: ", reviews)}
                <Table responsive style={{ 
                  tableLayout: "fixed", 
                  marginTop: "4rem",
                  
                  }}>
                  <colgroup>
                    <col style={{ width: "4%" }} />
                    <col style={{ width: "64%" }} />
                    <col style={{ width: "30%" }} />
                  </colgroup>
                  <thead>
                    <tr className="qnaTableHead">
                      <th>별점</th>
                      <th>내용</th>
                      <th>작성자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <tr key={review.id} className="review">
                        <td style={{ textAlign: "center" }}>{renderStars(review.rating)}</td>
                        <td style={{ textAlign: "center" }}>{review.text}</td>
                        <td style={{ textAlign: "center"}}>{review.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Row>

              {/* <div className="rating-statistics">
                {ratingCounts.map((count, index) => (
                  <div key={index} className="rating-row">
                    <div className="rating-bar-label">
                      {renderStars(5 - index)}
                    </div>{" "}
                    
                    <div className="rating-bar">
                      <div
                        className="rating-bar-filled"
                        style={{ width: `${(count / totalReviews) * 100}%` }}
                      ></div>
                    </div>
                    <div className="rating-bar-count">{count} 리뷰</div>
                  </div>
                ))}
              </div> */}
            </Row>

            {/* 개별 리뷰 목록 */}
            {/* {reviews.map((review) => (
              <div key={review.id} className="review">
                <p>{review.author}</p>
                <p>{renderStars(review.rating)}</p>
                <p>{review.text}</p>
              </div>
            ))} */}
          </div>
        )}
      </Container>
      <Footer />
    </div>
  );
};
export default ProductDetail;
