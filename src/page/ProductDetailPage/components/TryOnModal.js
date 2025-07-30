import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Form, Row, Col, Carousel } from "react-bootstrap";
import axios from "axios";
import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";

const TryOnModal = ({ show, onClose, clothImageUrl, clothImageUrl2, apiKey }) => {
  const [modelImageUrl, setModelImageUrl] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedClothImage, setSelectedClothImage] = useState(clothImageUrl);
  const [activeIndex, setActiveIndex] = useState(0);
  const [uploadedModelImages, setUploadedModelImages] = useState([]);

  // 모델 이미지 URL이 변경될 때 결과 초기화
  useEffect(() => {
    setResultImage(null);
    setError("");
  }, [modelImageUrl]);

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (show) {
      setModelImageUrl("");
      setResultImage(null);
      setError("");
      setSelectedClothImage(clothImageUrl);
      setActiveIndex(0);
      setUploadedModelImages([]);
    }
  }, [show, clothImageUrl]);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
    setSelectedClothImage(selectedIndex === 0 ? clothImageUrl : clothImageUrl2);
    
    // 새로운 의류를 선택할 때 이전 결과와 오류 초기화
    setResultImage(null);
    setError("");
  };

  // 이미지 업로드 핸들러
  const handleModelImageUpload = (url) => {
    setUploadedModelImages(prev => [...prev, url]);
    setModelImageUrl(url);
    setResultImage(null);
    setError("");
  };

  // 이미지 삭제 핸들러
  const handleImageDelete = (urlToDelete) => {
    setUploadedModelImages(prev => prev.filter(url => url !== urlToDelete));
    
    // 삭제된 이미지가 현재 선택된 이미지였다면 선택 해제
    if (modelImageUrl === urlToDelete) {
      setModelImageUrl("");
      setResultImage(null);
      setError("");
    }
  };

  const handleTryOn = async () => {
    setLoading(true);
    setError("");
    setResultImage(null);
    
    // API 키 검증
    if (!apiKey) {
      setError("API 키가 설정되지 않았습니다. 관리자에게 문의하세요.");
      setLoading(false);
      return;
    }

    // 입력값 검증
    if (!modelImageUrl.trim()) {
      setError("모델 이미지를 업로드하거나 URL을 입력해주세요.");
      setLoading(false);
      return;
    }

    if (!selectedClothImage) {
      setError("의류 이미지를 선택해주세요.");
      setLoading(false);
      return;
    }

    try {
      console.log("API 호출 시작:", { modelImageUrl, selectedClothImage });
      
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
      
      console.log("API 응답:", runRes.data);
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
        
        try {
          const statusRes = await axios.get(
            `https://api.fashn.ai/v1/status/${predictionId}`,
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
            }
          );
          
          console.log("상태 확인:", statusRes.data);
          status = statusRes.data.status;
          
          if (status === "completed") {
            outputUrl = statusRes.data.output?.[0];
          }
        } catch (statusError) {
          console.error("상태 확인 오류:", statusError);
          setError("처리 상태를 확인하는 중 오류가 발생했습니다.");
          setLoading(false);
          return;
        }
        
        pollCount++;
      }
      
      if (status === "completed" && outputUrl) {
        setResultImage(outputUrl);
        console.log("가상 시착 완료:", outputUrl);
      } else if (status === "failed") {
        setError("AI 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      } else {
        setError("처리 시간이 초과되었습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      console.error("API 호출 오류:", err);
      
      if (err.response) {
        // 서버 응답이 있는 경우
        if (err.response.status === 401) {
          setError("API 키가 유효하지 않습니다. 관리자에게 문의하세요.");
        } else if (err.response.status === 400) {
          setError("잘못된 요청입니다. 이미지 URL을 확인해주세요.");
        } else if (err.response.status === 429) {
          setError("요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError(`API 오류 (${err.response.status}): ${err.response.data?.message || '알 수 없는 오류'}`);
        }
      } else if (err.request) {
        // 요청은 보냈지만 응답이 없는 경우
        setError("서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.");
      } else {
        // 요청 설정 중 오류
        setError("요청을 보내는 중 오류가 발생했습니다.");
      }
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
            .uploaded-images {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              margin-top: 10px;
            }
            .uploaded-image {
              width: 80px;
              height: 80px;
              object-fit: cover;
              border-radius: 8px;
              cursor: pointer;
              border: 2px solid transparent;
              transition: border-color 0.3s ease;
            }
            .uploaded-image.selected {
              border-color: #007bff;
            }
            .image-upload-section {
              margin-bottom: 20px;
            }
            .upload-instructions {
              font-size: 0.9em;
              color: #6c757d;
              margin-bottom: 10px;
            }
            .uploaded-image-container {
              position: relative;
              display: inline-block;
            }
            .delete-image-btn {
              position: absolute;
              top: -5px;
              right: -5px;
              background-color: #dc3545;
              color: white;
              border: none;
              border-radius: 50%;
              width: 20px;
              height: 20px;
              font-size: 14px;
              cursor: pointer;
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 10;
              opacity: 0.7;
              transition: opacity 0.3s ease;
            }
            .uploaded-image-container:hover .delete-image-btn {
              opacity: 1;
            }
          `}
        </style>
        
        <div className="image-upload-section">
          <Form.Label>모델 이미지 업로드</Form.Label>
          
          {/* 이미지 업로드 위젯 */}
          <CloudinaryUploadWidget uploadImage={handleModelImageUpload} />
          
          {/* 업로드된 이미지 미리보기 */}
          {uploadedModelImages.length > 0 && (
            <div className="uploaded-images">
              {uploadedModelImages.map((url, index) => (
                <div key={index} className="uploaded-image-container">
                  <img
                    src={url}
                    alt={`Uploaded ${index + 1}`}
                    className={`uploaded-image ${modelImageUrl === url ? 'selected' : ''}`}
                    onClick={() => setModelImageUrl(url)}
                  />
                  <button
                    className="delete-image-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageDelete(url);
                    }}
                    title="이미지 삭제"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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