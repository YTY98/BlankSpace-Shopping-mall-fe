import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createReview } from "../../features/Review/ReviewSlice";
import { Modal, Button } from "react-bootstrap";
import CloudinaryUploadWidget from "../../utils/CloudinaryUploadWidget";

import "./style/ReviewWritePage.style.css";

const ReviewWritePage = () => {
  const { productId } = useParams();
  const { state } = useLocation(); // 전달받은 state 추출
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);



  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const handleStarClick = (star) => {
    console.log("Star clicked:", star);
    setRating(star);
  };

  const uploadImage = (url) => {
    setImages((prev) => [...prev, url]);
  };  

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setReviewText(text);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 주문 ID를 포함한 데이터 생성
    const formData = {
      productId,
      rating,
      text: reviewText,
      name: user.name,
      orderId: state.orderId, // 주문 ID 추가
      imageUrls: images, // 추가됨!
    };
  
    // 디버깅: 전송 데이터 확인
    console.log("Form Data:", formData);
  
    dispatch(createReview(formData))
      .unwrap()
      .then(() => {
        alert("리뷰가 성공적으로 작성되었습니다.");
        navigate(`/product/${productId}`);
      })
      .catch((error) => {
        console.error("Review submission failed:", error);
      });
  };
  
  

  return (
    <div className="write-review-container">
      <h2 className="write-review-title">후기 작성</h2>
      <form className="write-review-form" onSubmit={handleSubmit}>
        <div className="write-review-rating-section">
          <label>상품이 어떠셨나요?</label>
          <div className="write-review-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`write-review-star ${
                  star <= rating ? "selected" : ""
                }`}
                onClick={() => handleStarClick(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="write-review-rating-text">
          <p>어떤 점이 좋았나요?</p>
        </div>

        <hr className="write-review-divider" />

        <div className="write-review-textarea-section">
          <p>본문 입력 (필수)</p>
          <textarea
            value={reviewText}
            onChange={handleTextChange}
            placeholder="사용하시면서 느끼셨던 상품에 대한 의견을 자세히 공유해주세요"
            rows="5"
            className="write-review-textarea"
            required
          ></textarea>
          <div className="write-review-char-count">
            <p>{reviewText.length} / 500 자</p>
          </div>
        </div>

        <div className="write-review-notice-button-container custom-left-align">
          <Button variant="link" onClick={handleModalShow}>
            작성 시 유의사항
          </Button>
        </div>

        <div className="write-review-image-upload-section">
          <label>이미지 업로드:</label>
          <CloudinaryUploadWidget uploadImage={uploadImage} />
          <img id="uploadedimage" style={{ display: "none" }} alt="업로드된 이미지" /> {/* 추가 */}
          <div className="write-review-image-preview">
            {images.map((image, index) => (
              <img key={index} src={image} alt={`preview-${index}`} />
            ))}
          </div>
        </div>

        <div className="write-review-submit-section">
          <button type="submit" className="write-review-btn-submit">
            후기 제출
          </button>
          <button
            type="button"
            className="write-review-btn-cancel"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </form>

      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>작성 시 유의사항</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            작성하신 후기는 BLANKSPACE 및 BLANKSPACE 이용자들에게 공유됩니다.
          </p>
          <p>
            작성하신 후기의 삭제를 원하시는 경우 관리자에게 따로 문의해주시길
            바랍니다.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReviewWritePage;