import React, { useEffect, useState,  useRef, useMemo } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { WASH_METHODS } from "../../constants/product.constants"; //
import TryOnModal from "./components/TryOnModal";
import { FaTshirt } from "react-icons/fa";


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

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [showReviews, setShowReviews] = useState(false);
  const reviewRef = useRef(null);

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const [showTryOn, setShowTryOn] = useState(false);
  const apiKey = process.env.REACT_APP_FASHN_API_KEY;

  const getRatingCounts = () => {
    const counts = [0, 0, 0, 0, 0]; // 별점별 카운트 초기화
    reviews.forEach((review) => {
      if (review && typeof review.rating === "number" && review.rating >= 1 && review.rating <= 5) {
        counts[review.rating - 1]++;
      }
    });
    return counts;
  };  

  const calculateAverageRating = () => {
    const validReviews = reviews.filter(
      (review) => review && typeof review.rating === "number"
    );
  
    if (validReviews.length === 0) return 0;
  
    const totalRating = validReviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / validReviews.length).toFixed(1);
  };

  const [selectedSort, setSelectedSort] = useState("recent");


  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (selectedSort === "rating") {
        return b.rating - a.rating;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [selectedSort, reviews]);

  
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={i < rating ? "#000" : "#ccc"}
        className="svg-star"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ));
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

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  const filteredReviews = useMemo(() => {
    if (!searchKeyword.trim()) return sortedReviews;
    return sortedReviews.filter((review) =>
      review.text.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [searchKeyword, sortedReviews]);  
  
  // 해당 리뷰만 보여줌
  const currentReviews = useMemo(() => {
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    return filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  }, [filteredReviews, currentPage]);

  // 리뷰 전체 이미지 리스트 생성
  const allReviewImages = useMemo(() => {
    const images = [];
    reviews.forEach((review) => {
      if (review?.imageUrls && Array.isArray(review.imageUrls)) {
        review.imageUrls.forEach((url) => {
          if (url) images.push({ review, url });
        });
      }
    });
    return images;
  }, [reviews]);

  const currentImage = useMemo(() => {
    if (
      Array.isArray(galleryImages) &&
      currentIndex >= 0 &&
      currentIndex < galleryImages.length
    ) {
      return galleryImages[currentIndex];
    }
    return null;
  }, [galleryImages, currentIndex]);
  
  
  
  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  
  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    // 페이지 넘어갈 때 부드럽게 리뷰 섹션으로 이동
    window.scrollTo({
      top: document.querySelector(".review-page").offsetTop - 100,
      behavior: "smooth",
    });
  };  

  const handleViewAllClick = () => {
    // 전체 리뷰 이미지들을 모아서 allReviewImages로 갤러리 설정
    const allImages = [];
    reviews.forEach((review) => {
      review.imageUrls?.forEach((url) => {
        allImages.push({ review, url });
      });
    });
    if (allImages.length > 0) {
      setSelectedReview(allImages[0].review);
      setSelectedImageUrl(allImages[0].url);
      setSelectedImageIndex(0);
    }
  };

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return "아주 좋아요";
    if (rating >= 3.5) return "맘에 들어요";
    if (rating >= 2.5) return "보통이에요";
    if (rating >= 1.5) return "그냥 그래요";
    return "별로예요";
  };  

  const maxCount = Math.max(...ratingCounts);

  const maskName = (name) => {
    if (!name || typeof name !== 'string') return '익명';
    return name[0] + '*'.repeat(name.length - 1);
  };
  
  useEffect(() => {
    setCurrentPage(1); // 정렬 기준이 바뀔 때 첫 페이지로 초기화
  }, [selectedSort, reviews]);
  
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
            <div className="product-info-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {selectedProduct.name || "상품명 없음"}
              <Button
                variant="outline-secondary"
                style={{ borderRadius: '50%', width: 40, height: 40, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Virtual try on"
                onClick={() => setShowTryOn(true)}
              >
                <FaTshirt size={20} />
              </Button>
              <span style={{ fontSize: 12, marginLeft: 4 }}>Virtual try on</span>
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
                  {selectedProduct.washMethods && selectedProduct.washMethods.length > 0 ? (
                    <div className="wash-method-list d-flex flex-wrap gap-3">
                      {selectedProduct.washMethods.map((method, index) => {
                        const methodInfo = WASH_METHODS.find((m) => m.value === method.value);
                        return (
                          <div key={index} className="d-flex align-items-center">
                            {methodInfo?.image && (
                              <img
                                src={methodInfo.image}
                                alt={methodInfo.label}
                                width={32}
                                height={32}
                                style={{ objectFit: "contain", marginRight: "8px" }}
                              />
                            )}
                            <span>{methodInfo?.label || method.value}</span>
                          </div>
                        );
                      })}
                    </div>
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
            <h2 className="ReviewHeader">
              REVIEW | ({totalReviews})
            </h2>

            <Row className="review-container">
              {/* 평균 별점 */}
              <div className="review-divider"></div>
              {/* 별점별 리뷰 통계 */}
              <Row>
                <Col sm={4} className="ReviewOverall">
                  <div className="ReviewAverage">
                    <span style={{ fontSize: "50px" }}>
                      <span className="rating-star"> </span>
                      <span className="rating-score">{calculateAverageRating()}</span>
                    </span>
                  </div>
                  <div className="ReviewLikePercentage">
                    <p>
                      <strong>
                        {Math.round(((ratingCounts[3] + ratingCounts[4]) / totalReviews) * 100) || 0}%
                      </strong>
                      의 구매자가 이 상품을 좋아합니다.
                    </p>
                  </div>
                </Col>
                <Col sm={8}>
                <div className="rating-statistics">
                  {ratingCounts.slice().reverse().map((count, index) => {
                    const score = 5 - index;
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                    let barClass = "rating-bar-filled";
                    if (count === maxCount) barClass += " max";
                    else if (percentage === 0) barClass += " empty";
                    else if (percentage < 20) barClass += " low";
                    else barClass += " normal";

                    return (
                      <div key={index} className="rating-row">
                        <div className="rating-bar-label">{getRatingLabel(score)}</div>
                        <div className="rating-bar">
                          <div
                            className={barClass}
                            style={{ width: `${percentage}%` }}
                          >
                            <ProgressBar now={100} className="custom-progress-bar" variant="dark" />
                          </div>
                        </div>
                        <div className="rating-bar-count">{count}</div>
                      </div>
                    );
                  })}
                </div>
                </Col>
                <hr className="divider-line" />
              </Row>

              {reviews.some((review) => review.imageUrls && review.imageUrls.length > 0) && (
                <Row className="review-image-gallery mt-3 mb-4">
                  
                  {/* 제목 */}
                  <Col xs={12}>
                    <div className="review-gallery-header">
                      <h4 className="gallery-title">
                        포토&동영상 ({reviews.reduce((count, review) => count + (review.imageUrls?.length || 0), 0)})
                      </h4>
                      <button
                        className="view-all-button"
                        onClick={() => {
                          setIsGalleryModalOpen(true);      
                          setGalleryImages(allReviewImages); 
                          setCurrentIndex(0);                
                        }}
                      >
                        전체보기 &gt;
                      </button>
                    </div>
                  </Col>

                  {/* 리뷰 이미지들 */}
                  <Col xs={12}>
                    <div className="review-image-wrapper">
                      {reviews.map((review) =>
                        review.imageUrls?.map((url, idx) => (
                          <img
                            key={`review-thumb-${review._id}-${idx}`}
                            src={url}
                            alt="리뷰 이미지"
                            className="review-thumbnail-image"
                            onClick={() => {
                              const index = allReviewImages.findIndex((item) => item.url === url);
                              console.log('찾은 인덱스:', index);
                              if (index !== -1) {
                                setGalleryImages(allReviewImages);
                                setCurrentIndex(index);
                                setIsGalleryModalOpen(true);
                                setSelectedReview(null);
                                setSelectedImageUrl(null);
                                console.log('✅ 설정 완료:', allReviewImages[index]);
                              } else {
                                console.warn(' 이미지 URL을 찾지 못함:', url);
                              }
                            }}
                          />
                        ))
                      )}
                    </div>
                  </Col>

                </Row>
              )}
              <Row className="justify-content-between align-items-center mb-3">
                <Col xs="12">
                  <div className="review-list-align">
                    <div className="review-list-align-text">
                      <span
                        className={`review-align-btn ${selectedSort === "recent" ? "active" : ""}`}
                        onClick={() => setSelectedSort("recent")}
                      >
                        최신순
                      </span>
                      <span className="divider">|</span>
                      <span
                        className={`review-align-btn ${selectedSort === "rating" ? "active" : ""}`}
                        onClick={() => setSelectedSort("rating")}
                      >
                        별점순
                      </span>
                    </div>
                    <Col xs={12} md={6} className="d-flex justify-content-end">
                      <div className="review-search-icon-wrapper">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <input
                          type="text"
                          className="review-search-input"
                          placeholder="리뷰 키워드 검색"
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                      </div>
                    </Col>
                  </div>
                </Col>
              </Row>
             {/* 리뷰 목록 */}
              <Row className="individual-review-list">
                {currentReviews.map((review) => (
                  <Col xs={12} key={review._id} className="individual-review-box">
                    <Row>
                      <Col md={8} className="review-left">
                        <div className="review-stars">{renderStars(review.rating)}</div>
                        <p className="review-text">{review.text}</p>
                        {review.imageUrls?.length > 0 && (
                          <div className="review-image-list">
                            {review.imageUrls.map((url, idx) => (
                              <img
                                key={`${review._id || review.id}-${url}-${idx}`}
                                src={url}
                                alt={`리뷰 이미지 ${idx + 1}`}
                                className="review-inline-thumbnail"
                                onClick={() => {
                                  setSelectedReview(review);
                                  setSelectedImageUrl(url);
                                  setIsGalleryModalOpen(false);
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </Col>
                      <Col md={4} className="review-meta-box">
                        <div className="review-date">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : "날짜 없음"}
                        </div>
                        <div className="review-name">
                          <strong>{maskName(review.name)}</strong>님의 리뷰입니다.
                        </div>
                      </Col>
                    </Row>
                  </Col>
                ))}
              </Row>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <Row className="custom-pagination mt-4 justify-content-center align-items-center">
                  <Col xs="auto">
                    <span
                      className={`page-nav ${currentPage === 1 ? "disabled" : ""}`}
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    >
                      &lt;
                    </span>
                  </Col>
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <Col key={page} xs="auto">
                        <span
                          className={`page-number ${page === currentPage ? "active" : ""}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </span>
                      </Col>
                    );
                  })}
                  <Col xs="auto">
                    <span
                      className={`page-nav ${currentPage === totalPages ? "disabled" : ""}`}
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    >
                      &gt;
                    </span>
                  </Col>
                </Row>
              )}
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

      {isGalleryModalOpen && currentImage?.url && (
        <div className="review-gallery-modal-overlay" onClick={() => setIsGalleryModalOpen(false)}>
          <div className="review-gallery-modal" onClick={(e) => e.stopPropagation()}>

            {/* 왼쪽: 전체 리뷰이미지 목록 */}
            <div className="review-gallery-left">
              {galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`썸네일 ${idx}`}
                  className={`thumbnail ${idx === currentIndex ? "active" : ""}`}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>

            {/* 오른쪽: 선택된 이미지 + 리뷰 정보 */}
            <div className="review-gallery-right">
              <button
                className="review-gallery-close-button"
                onClick={() => setIsGalleryModalOpen(false)}
              >✕</button>

              <img src={currentImage.url} alt="선택된 리뷰 이미지" className="main-image" />

              <div className="review-gallery-stars">{renderStars(currentImage.review?.rating || 0)}
                <span className="rating-label" style={{ marginLeft: "8px", color: "#666" }}>
                  {getRatingLabel(currentImage.review?.rating)}
                </span>
              </div>
              <div className="review-gallery-name">{maskName(currentImage.review?.name) || "이름 없음"}</div>
              <div className="review-gallery-text">{currentImage.review?.text || "내용 없음"}</div>
              <div className="review-gallery-date">
                {currentImage.review?.createdAt
                  ? new Date(currentImage.review.createdAt).toLocaleDateString()
                  : "날짜 없음"}
              </div>
            </div>

          </div>
        </div>
      )}

      {selectedReview && selectedImageUrl && (
        <div className="review-detail-modal-overlay" onClick={() => {
          setSelectedReview(null);
          setSelectedImageUrl(null);
          setSelectedImageIndex(0);
        }}>
          <div className="review-detail-modal" onClick={(e) => e.stopPropagation()}>

            {/* 왼쪽: 메인 이미지 + 썸네일 */}
            <div className="review-detail-left" style={{ flexDirection: 'column' }}>
              <img
                src={selectedImageUrl}
                alt="선택된 리뷰 이미지"
                className="main-image"
              />

              {/*  해당 리뷰의 이미지들 */}
              {selectedReview.imageUrls?.length > 1 && (
                <div className="review-sub-thumbnail-list">
                  {selectedReview.imageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`리뷰 썸네일 ${idx}`}
                      className={`sub-thumbnail ${url === selectedImageUrl ? "active" : ""}`}
                      onClick={() => {
                        setSelectedImageUrl(url);
                        setSelectedImageIndex(idx);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 오른쪽: 리뷰 정보 + 다른 리뷰 썸네일 */}
            <div className="review-detail-right">
              <button className="review-gallery-close-button" onClick={() => {
                setSelectedReview(null);
                setSelectedImageUrl(null);
                setSelectedImageIndex(0);
              }}>✕</button>

              <div className="review-gallery-stars">
                {renderStars(selectedReview.rating)}
                <span className="rating-label" style={{ marginLeft: "8px", color: "#666" }}>
                  {getRatingLabel(selectedReview.rating)}
                </span>
              </div>
              <div className="review-gallery-name">{maskName(selectedReview.name) || "이름 없음"}</div>
              <div className="review-gallery-text">{selectedReview.text || "내용 없음"}</div>
              <div className="review-gallery-date">
                {selectedReview.createdAt
                  ? new Date(selectedReview.createdAt).toLocaleDateString()
                  : "날짜 없음"}
              </div>

              <h5 style={{ marginTop: "20px" }}>이 상품의 다른 리뷰</h5>
              <div className="bottom-thumbnail-list">
                {allReviewImages.map((item, idx) => (
                  <img
                    key={idx}
                    src={item.url}
                    alt={`썸네일 ${idx}`}
                    className={`thumbnail ${item.url === selectedImageUrl ? "active" : ""}`}
                    onClick={() => {
                      setSelectedReview(item.review);
                      setSelectedImageUrl(item.url);
                      setSelectedImageIndex(idx);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
      <TryOnModal
        show={showTryOn}
        onClose={() => setShowTryOn(false)}
        clothImageUrl={mainImage || selectedProduct.image?.[0] || ""}
        clothImageUrl2={selectedProduct.image?.[1] || ""}
        apiKey={apiKey}
      />
    </div>
  );
};
export default ProductDetail;
