import React, { useState } from "react";
import { Modal, Button, Spinner, Form, Row, Col, Carousel } from "react-bootstrap";
import axios from "axios";

const TryOnModal = ({ show, onClose, clothImageUrl, clothImageUrl2, apiKey }) => {
  const [modelImageUrl, setModelImageUrl] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedClothImage, setSelectedClothImage] = useState(clothImageUrl);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
    setSelectedClothImage(selectedIndex === 0 ? clothImageUrl : clothImageUrl2);
  };

  const handleTryOn = async () => {
    setLoading(true);
    setError("");
    setResultImage(null);
    try {
      const runRes = await axios.post(
        "https://api.fashn.ai/v1/run",
        {
          model_image: modelImageUrl,
          garment_image: selectedClothImage,
          category: "auto",
          mode: "quality",
          num_samples: 1,
          garment_photo_type: "auto",
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      const predictionId = runRes.data.id;

      let status = "starting";
      let outputUrl = null;
      let pollCount = 0;
      while (
        status !== "completed" &&
        status !== "failed" &&
        pollCount < 20
      ) {
        await new Promise((res) => setTimeout(res, 2000));
        const statusRes = await axios.get(
          `https://api.fashn.ai/v1/status/${predictionId}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        status = statusRes.data.status;
        if (status === "completed") {
          outputUrl = statusRes.data.output?.[0];
        }
        pollCount++;
      }
      if (status === "completed" && outputUrl) {
        setResultImage(outputUrl);
      } else {
        setError("가상 시착 결과를 가져오지 못했습니다.");
      }
    } catch (err) {
      setError("API 호출에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Virtual Try On</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pb-5">
        <style>
          {`
            .cloth-carousel-container {
              position: relative;
              width: 100%;
              max-width: 80%;
              margin: 0 auto;
            }
            .carousel-control-prev-icon {
              transform: rotate(0deg);
              background-color: transparent;
              padding: 0;
              width: 30%;
              height: 30%;
              filter: brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%);
            }
            .carousel-control-next-icon {
              transform: rotate(0deg);
              background-color: transparent;
              padding: 0;
              width: 30%;
              height: 30%;
              filter: brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%);
            }
            .carousel-control-prev {
              left: 0;
              width: 30%;
              height: 30%;
              top: 50%;
              transform: translateY(-50%);
              opacity: 1;
            }
            .carousel-control-next {
              right: 0;
              width: 30%;
              height: 30%;
              top: 50%;
              transform: translateY(-50%);
              opacity: 1;
            }
            .carousel-control-prev:hover,
            .carousel-control-next:hover {
              opacity: 0.8;
            }
            .cloth-image-container {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 50vh;
              max-height: 400px;
            }
            .cloth-image {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
            .try-on-button-container {
              display: flex;
              justify-content: center;
              margin-top: 8%;
              margin-bottom: 2%;
            }
            .try-on-button {
              min-width: 120px;
            }
            .try-on-button:disabled {
              background-color: #b8daff;
              border-color: #b8daff;
              color: #004085;
            }
            .try-on-button:not(:disabled) {
              background-color: #007bff;
              border-color: #007bff;
              color: white;
            }
            .modal-body {
              padding-bottom: 8%;
            }
            .carousel-item {
              transition: transform .6s ease-in-out;
            }
            .carousel-item-next:not(.carousel-item-start),
            .active.carousel-item-end {
              transform: translateX(100%);
            }
            .carousel-item-prev:not(.carousel-item-end),
            .active.carousel-item-start {
              transform: translateX(-100%);
            }
          `}
        </style>
        <Form.Group className="mb-3">
          <Form.Label>모델 이미지 URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="모델 이미지의 URL을 입력하세요"
            value={modelImageUrl}
            onChange={e => setModelImageUrl(e.target.value)}
          />
          {modelImageUrl && (
            <div className="mt-2">
              <img src={modelImageUrl} alt="Model Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>의류 이미지 선택</Form.Label>
          <div className="cloth-carousel-container">
            <Carousel
              activeIndex={activeIndex}
              onSelect={handleSelect}
              interval={null}
              indicators={false}
              controls={true}
              wrap={false}
            >
              <Carousel.Item>
                <div className="cloth-image-container">
                  <img
                    src={clothImageUrl}
                    alt="Cloth 1"
                    className="cloth-image"
                  />
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="cloth-image-container">
                  <img
                    src={clothImageUrl2}
                    alt="Cloth 2"
                    className="cloth-image"
                  />
                </div>
              </Carousel.Item>
            </Carousel>
          </div>
        </Form.Group>

        <div className="try-on-button-container">
          <Button
            className="try-on-button"
            onClick={handleTryOn}
            disabled={loading || !modelImageUrl || !selectedClothImage}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Try On"}
          </Button>
        </div>
        {error && <div className="text-danger mt-2 text-center">{error}</div>}
        {resultImage && (
          <div className="mt-3 text-center">
            <img src={resultImage} alt="Try On Result" style={{ maxWidth: '100%' }} />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default TryOnModal; 