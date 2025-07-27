import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Form, Row, Col, Card, Badge, Carousel } from "react-bootstrap";
import axios from "axios";

const CartTryOnModal = ({ show, onClose, cartItems, apiKey }) => {
  const [modelImageUrl, setModelImageUrl] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [selectedTopImageIndex, setSelectedTopImageIndex] = useState(0);
  const [selectedBottomImageIndex, setSelectedBottomImageIndex] = useState(0);
  const [processingStep, setProcessingStep] = useState(""); // "top", "bottom", "complete"
  const [topPageIndex, setTopPageIndex] = useState(0);
  const [bottomPageIndex, setBottomPageIndex] = useState(0);

  // 상의와 하의 분류
  const tops = cartItems.filter(item => {
    const category = item.productId.category;
    const name = item.productId.name.toLowerCase();
    
    // 카테고리 기반 분류
    if (category && Array.isArray(category)) {
      if (category.some(cat => cat.includes("Top") || cat.includes("Outer"))) {
        return true;
      }
    }
    
    // 이름 기반 분류
    return name.includes("shirt") || 
           name.includes("hoodie") || 
           name.includes("sweater") || 
           name.includes("jacket") ||
           name.includes("coat") ||
           name.includes("blazer") ||
           name.includes("cardigan") ||
           name.includes("vest");
  });
  
  const bottoms = cartItems.filter(item => {
    const category = item.productId.category;
    const name = item.productId.name.toLowerCase();
    
    // 카테고리 기반 분류
    if (category && Array.isArray(category)) {
      if (category.some(cat => cat.includes("Pants") || cat.includes("Bottom"))) {
        return true;
      }
    }
    
    // 이름 기반 분류
    return name.includes("pants") || 
           name.includes("jeans") || 
           name.includes("shorts") || 
           name.includes("skirt") ||
           name.includes("trousers") ||
           name.includes("leggings") ||
           name.includes("joggers");
  });

  // 분류되지 않은 상품들 (디버깅용)
  const unclassified = cartItems.filter(item => 
    !tops.includes(item) && !bottoms.includes(item)
  );

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (show) {
      setModelImageUrl("");
      setResultImage(null);
      setError("");
      setSelectedTop(null);
      setSelectedBottom(null);
      setSelectedTopImageIndex(0);
      setSelectedBottomImageIndex(0);
      setTopPageIndex(0);
      setBottomPageIndex(0);
      setProcessingStep("");
    }
  }, [show]);

  // 모델 이미지 URL이 변경될 때 결과 초기화
  useEffect(() => {
    setResultImage(null);
    setError("");
    setProcessingStep("");
  }, [modelImageUrl]);

  const handleTopSelect = (item) => {
    setSelectedTop(item);
    setSelectedTopImageIndex(0);
    setResultImage(null);
    setError("");
    setProcessingStep("");
  };

  const handleBottomSelect = (item) => {
    setSelectedBottom(item);
    setSelectedBottomImageIndex(0);
    setResultImage(null);
    setError("");
    setProcessingStep("");
  };

  const handleTopImageSelect = (selectedIndex) => {
    // 앞면(0)과 뒷면(1)만 선택 가능
    if (selectedIndex <= 1) {
      setSelectedTopImageIndex(selectedIndex);
      setResultImage(null);
      setError("");
      setProcessingStep("");
    }
  };

  const handleBottomImageSelect = (selectedIndex) => {
    // 앞면(0)과 뒷면(1)만 선택 가능
    if (selectedIndex <= 1) {
      setSelectedBottomImageIndex(selectedIndex);
      setResultImage(null);
      setError("");
      setProcessingStep("");
    }
  };

  const handleTopPageChange = (direction) => {
    const itemsPerPage = 5;
    const maxPage = Math.ceil(tops.length / itemsPerPage) - 1;
    
    if (direction === 'prev' && topPageIndex > 0) {
      setTopPageIndex(topPageIndex - 1);
    } else if (direction === 'next' && topPageIndex < maxPage) {
      setTopPageIndex(topPageIndex + 1);
    }
  };

  const handleBottomPageChange = (direction) => {
    const itemsPerPage = 5;
    const maxPage = Math.ceil(bottoms.length / itemsPerPage) - 1;
    
    if (direction === 'prev' && bottomPageIndex > 0) {
      setBottomPageIndex(bottomPageIndex - 1);
    } else if (direction === 'next' && bottomPageIndex < maxPage) {
      setBottomPageIndex(bottomPageIndex + 1);
    }
  };

  const callTryOnAPI = async (modelImage, garmentImage) => {
    const runRes = await axios.post(
      "https://api.fashn.ai/v1/run",
      {
        model_image: modelImage,
        garment_image: garmentImage,
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
    
    while (status !== "completed" && status !== "failed" && pollCount < 20) {
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
    
    if (status === "failed") {
      throw new Error("AI 처리 중 오류가 발생했습니다.");
    }
    
    if (!outputUrl) {
      throw new Error("처리 시간이 초과되었습니다.");
    }
    
    return outputUrl;
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
      setError("모델 이미지 URL을 입력해주세요.");
      setLoading(false);
      return;
    }

    if (!selectedTop && !selectedBottom) {
      setError("상의 또는 하의를 선택해주세요.");
      setLoading(false);
      return;
    }

    try {
      let currentModelImage = modelImageUrl;
      
      // 상의 처리
      if (selectedTop) {
        setProcessingStep("상의를 입히는 중...");
        const topImageUrl = selectedTop.productId.image[selectedTopImageIndex] || selectedTop.productId.image[0];
        const topResult = await callTryOnAPI(currentModelImage, topImageUrl);
        currentModelImage = topResult;
      }
      
      // 하의 처리
      if (selectedBottom) {
        setProcessingStep("하의를 입히는 중...");
        const bottomImageUrl = selectedBottom.productId.image[selectedBottomImageIndex] || selectedBottom.productId.image[0];
        const bottomResult = await callTryOnAPI(currentModelImage, bottomImageUrl);
        setResultImage(bottomResult);
      } else if (selectedTop) {
        // 상의만 선택된 경우
        setResultImage(currentModelImage);
      }
      
      setProcessingStep("완료!");
      console.log("가상 시착 완료");
      
    } catch (err) {
      console.error("API 호출 오류:", err);
      
      if (err.response) {
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
        setError("서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.");
      } else {
        setError(err.message || "요청을 보내는 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
      setProcessingStep("");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>장바구니 가상 시착</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pb-5">
        <style>
          {`
            .model-url-section {
              margin-bottom: 2rem;
            }
            .selection-section {
              margin-bottom: 2rem;
            }
            .product-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 1rem;
              margin-top: 1rem;
            }
            .product-card {
              cursor: pointer;
              transition: all 0.3s ease;
              border: 2px solid transparent;
            }
            .product-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .product-card.selected {
              border-color: #007bff;
              background-color: #f8f9fa;
              min-height: 400px;
            }
            .product-image {
              width: 100%;
              height: 200px;
              object-fit: cover;
              border-radius: 8px;
            }
            .product-info {
              padding: 0.5rem;
              margin-top: 10px;
            }
            .category-badge {
              margin-bottom: 0.5rem;
            }
            .try-on-button-container {
              display: flex;
              justify-content: center;
              margin-top: 2rem;
            }
            .try-on-button {
              min-width: 150px;
            }
            .processing-step {
              text-align: center;
              margin: 1rem 0;
              font-weight: bold;
              color: #007bff;
            }
            .result-image {
              max-width: 100%;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            
            /* 캐러셀 스타일 */
            .cloth-carousel-container {
              position: relative;
              width: 100%;
              margin: 0 auto;
              height: 320px;
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
              height: 300px;
              max-height: 300px;
              padding: 10px;
              overflow: hidden;
            }
            .cloth-image {
              width: 100%;
              height: 100%;
              object-fit: contain;
              border-radius: 8px;
            }
            .image-indicator {
              font-size: 0.9rem;
              color: #666;
              margin-top: 0.5rem;
            }
            .image-count {
              font-size: 0.8rem;
              color: #007bff;
              margin-top: 0.25rem;
            }
            
            /* 선택된 상품 카드 특별 스타일 */
            .product-card.selected .cloth-carousel-container {
              flex: 1;
              display: flex;
              flex-direction: column;
            }
            
            .product-card.selected .product-info {
              flex-shrink: 0;
            }
            
            /* 페이지네이션 스타일 */
            .product-selection-container {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-top: 1rem;
            }
            .page-nav-btn {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.2rem;
              font-weight: bold;
              z-index: 10;
            }
            .page-nav-btn:disabled {
              opacity: 0.3;
              cursor: not-allowed;
            }
            .product-grid {
              flex: 1;
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 1rem;
            }
            .product-grid.single-row {
              grid-template-columns: repeat(5, 1fr);
              gap: 0.5rem;
            }
            .product-selection-container.no-pagination {
              gap: 0;
            }
          `}
        </style>

        {/* 모델 이미지 URL 입력 */}
        <div className="model-url-section">
          <Form.Group>
            <Form.Label><strong>모델 이미지 URL</strong></Form.Label>
            <Form.Control
              type="text"
              placeholder="모델 이미지의 URL을 입력하세요"
              value={modelImageUrl}
              onChange={(e) => setModelImageUrl(e.target.value)}
            />
            {modelImageUrl && (
              <div className="mt-2">
                <img 
                  src={modelImageUrl} 
                  alt="Model Preview" 
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} 
                />
              </div>
            )}
          </Form.Group>
        </div>

        {/* 상의 선택 */}
        {tops.length > 0 && (
          <div className="selection-section">
            <h5>상의 선택</h5>
            <div className={`product-selection-container ${tops.length <= 5 ? 'no-pagination' : ''}`}>
              {tops.length > 5 && (
                <Button 
                  variant="outline-secondary" 
                  className="page-nav-btn prev-btn"
                  onClick={() => handleTopPageChange('prev')}
                  disabled={topPageIndex === 0}
                >
                  ‹
                </Button>
              )}
              <div className={`product-grid ${tops.length <= 5 ? 'single-row' : ''}`}>
                {tops.length <= 5 
                  ? tops.map((item) => (
                      <Card 
                        key={item._id} 
                        className={`product-card ${selectedTop?._id === item._id ? 'selected' : ''}`}
                        onClick={() => handleTopSelect(item)}
                      >
                        <img 
                          src={item.productId.image[0]} 
                          alt={item.productId.name} 
                          className="product-image"
                        />
                        <div className="product-info">
                          <Badge bg="primary" className="category-badge">상의</Badge>
                          <div><strong>{item.productId.name}</strong></div>
                          <div>Size: {item.size}</div>
                        </div>
                      </Card>
                    ))
                  : tops.slice(topPageIndex * 5, (topPageIndex + 1) * 5).map((item) => (
                      <Card 
                        key={item._id} 
                        className={`product-card ${selectedTop?._id === item._id ? 'selected' : ''}`}
                        onClick={() => handleTopSelect(item)}
                      >
                        <img 
                          src={item.productId.image[0]} 
                          alt={item.productId.name} 
                          className="product-image"
                        />
                        <div className="product-info">
                          <Badge bg="primary" className="category-badge">상의</Badge>
                          <div><strong>{item.productId.name}</strong></div>
                          <div>Size: {item.size}</div>
                        </div>
                      </Card>
                    ))
                }
              </div>
              {tops.length > 5 && (
                <Button 
                  variant="outline-secondary" 
                  className="page-nav-btn next-btn"
                  onClick={() => handleTopPageChange('next')}
                  disabled={topPageIndex >= Math.ceil(tops.length / 5) - 1}
                >
                  ›
                </Button>
              )}
            </div>
          </div>
        )}

        {/* 하의 선택 */}
        {bottoms.length > 0 && (
          <div className="selection-section">
            <h5>하의 선택</h5>
            <div className={`product-selection-container ${bottoms.length <= 5 ? 'no-pagination' : ''}`}>
              {bottoms.length > 5 && (
                <Button 
                  variant="outline-secondary" 
                  className="page-nav-btn prev-btn"
                  onClick={() => handleBottomPageChange('prev')}
                  disabled={bottomPageIndex === 0}
                >
                  ‹
                </Button>
              )}
              <div className={`product-grid ${bottoms.length <= 5 ? 'single-row' : ''}`}>
                {bottoms.length <= 5 
                  ? bottoms.map((item) => (
                      <Card 
                        key={item._id} 
                        className={`product-card ${selectedBottom?._id === item._id ? 'selected' : ''}`}
                        onClick={() => handleBottomSelect(item)}
                      >
                        <img 
                          src={item.productId.image[0]} 
                          alt={item.productId.name} 
                          className="product-image"
                        />
                        <div className="product-info">
                          <Badge bg="success" className="category-badge">하의</Badge>
                          <div><strong>{item.productId.name}</strong></div>
                          <div>Size: {item.size}</div>
                        </div>
                      </Card>
                    ))
                  : bottoms.slice(bottomPageIndex * 5, (bottomPageIndex + 1) * 5).map((item) => (
                      <Card 
                        key={item._id} 
                        className={`product-card ${selectedBottom?._id === item._id ? 'selected' : ''}`}
                        onClick={() => handleBottomSelect(item)}
                      >
                        <img 
                          src={item.productId.image[0]} 
                          alt={item.productId.name} 
                          className="product-image"
                        />
                        <div className="product-info">
                          <Badge bg="success" className="category-badge">하의</Badge>
                          <div><strong>{item.productId.name}</strong></div>
                          <div>Size: {item.size}</div>
                        </div>
                      </Card>
                    ))
                }
              </div>
              {bottoms.length > 5 && (
                <Button 
                  variant="outline-secondary" 
                  className="page-nav-btn next-btn"
                  onClick={() => handleBottomPageChange('next')}
                  disabled={bottomPageIndex >= Math.ceil(bottoms.length / 5) - 1}
                >
                  ›
                </Button>
              )}
            </div>
          </div>
        )}

        {/* 분류되지 않은 상품들 (디버깅용) */}
        {unclassified.length > 0 && (
          <div className="selection-section">
            <h5>기타 상품 ({unclassified.length}개)</h5>
            <div className="product-grid">
              {unclassified.map((item) => (
                <Card 
                  key={item._id} 
                  className="product-card"
                >
                  <img 
                    src={item.productId.image[0]} 
                    alt={item.productId.name} 
                    className="product-image"
                  />
                  <div className="product-info">
                    <Badge bg="warning" className="category-badge">기타</Badge>
                    <div><strong>{item.productId.name}</strong></div>
                    <div>Size: {item.size}</div>
                    <div className="text-muted">카테고리: {item.productId.category?.join(', ') || '없음'}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 선택된 상품 요약 */}
        {(selectedTop || selectedBottom) && (
          <div className="selection-section">
            <h5>선택된 상품</h5>
            <Row>
              {selectedTop && (
                <Col md={6}>
                  <Card className="product-card selected">
                    <div className="cloth-carousel-container">
                      <Carousel
                        activeIndex={selectedTopImageIndex}
                        onSelect={handleTopImageSelect}
                        interval={null}
                        indicators={false}
                        controls={true}
                        wrap={false}
                      >
                        {selectedTop.productId.image.slice(0, 2).map((imageUrl, index) => (
                          <Carousel.Item key={index}>
                            <div className="cloth-image-container">
                              <img
                                src={imageUrl}
                                alt={`${selectedTop.productId.name} ${index === 0 ? '앞면' : '뒷면'}`}
                                className="cloth-image"
                              />
                            </div>
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    </div>
                    <div className="product-info">
                      <Badge bg="primary">상의</Badge>
                      <div><strong>{selectedTop.productId.name}</strong></div>
                      <div className="image-indicator">
                        {selectedTopImageIndex === 0 ? "앞면" : "뒷면"} 
                        ({selectedTopImageIndex + 1}/2)
                      </div>
                    </div>
                  </Card>
                </Col>
              )}
              {selectedBottom && (
                <Col md={6}>
                  <Card className="product-card selected">
                    <div className="cloth-carousel-container">
                      <Carousel
                        activeIndex={selectedBottomImageIndex}
                        onSelect={handleBottomImageSelect}
                        interval={null}
                        indicators={false}
                        controls={true}
                        wrap={false}
                      >
                        {selectedBottom.productId.image.slice(0, 2).map((imageUrl, index) => (
                          <Carousel.Item key={index}>
                            <div className="cloth-image-container">
                              <img
                                src={imageUrl}
                                alt={`${selectedBottom.productId.name} ${index === 0 ? '앞면' : '뒷면'}`}
                                className="cloth-image"
                              />
                            </div>
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    </div>
                    <div className="product-info">
                      <Badge bg="success">하의</Badge>
                      <div><strong>{selectedBottom.productId.name}</strong></div>
                      <div className="image-indicator">
                        {selectedBottomImageIndex === 0 ? "앞면" : "뒷면"} 
                        ({selectedBottomImageIndex + 1}/2)
                      </div>
                    </div>
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        )}

        {/* Try On 버튼 */}
        <div className="try-on-button-container">
          <Button
            className="try-on-button"
            onClick={handleTryOn}
            disabled={loading || !modelImageUrl || (!selectedTop && !selectedBottom)}
            size="lg"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {processingStep || "처리 중..."}
              </>
            ) : (
              "가상 시착 시작"
            )}
          </Button>
        </div>

        {/* 오류 메시지 */}
        {error && (
          <div className="text-danger mt-3 text-center">
            <strong>{error}</strong>
          </div>
        )}

        {/* 결과 이미지 */}
        {resultImage && (
          <div className="mt-4 text-center">
            <h5>가상 시착 결과</h5>
            <img src={resultImage} alt="Try On Result" className="result-image" />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CartTryOnModal; 