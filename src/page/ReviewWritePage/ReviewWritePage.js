import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createReview } from "../../features/Review/ReviewSlice";
import { Modal, Button } from "react-bootstrap";

import "./style/ReviewWritePage.style.css";

const ReviewWritePage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleImageChange = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setImages((prevImages) => [...prevImages, ...fileArray]);
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setReviewText(text);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting review with rating:", rating);

    // rating이 1~5 사이인지 확인
    if (rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    // formData 생성 및 dispatch
    const formData = { productId, rating, text: reviewText, images };
    dispatch(createReview(formData))
      .then(() => {
        // 리뷰 작성 후 ProductDetailPage로 이동하며 리뷰 목록 갱신
        alert("리뷰가 성공적으로 작성되었습니다.");
        navigate(`/product/${productId}`); // 해당 상품의 상세 페이지로 이동
      })
      .catch((error) => {
        console.log("Review submission failed:", error);
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
          <label htmlFor="write-review-image-upload">이미지 업로드:</label>
          <input
            type="file"
            id="write-review-image-upload"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="write-review-image-upload-input"
          />
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