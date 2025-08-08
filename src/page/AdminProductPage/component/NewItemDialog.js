import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Row, Col, Alert, Spinner, Card, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";
import { CATEGORY, STATUS, SIZE } from "../../../constants/product.constants";
import "../style/adminProduct.style.css";
import {
  clearError,
  createProduct,
  editProduct,
} from "../../../features/product/productSlice";
import { WASH_METHODS } from "../../../constants/product.constants";
import axios from "axios";

const InitialFormData = {
  name: "",
  sku: "",
  stock: {},
  image: [],
  description: "",
  category: [],
  status: "active",
  price: "",
  height: "",
  weight: "",
  washMethods: [],
};

const NewItemDialog = ({ mode, showDialog, setShowDialog }) => {
  const { error, success, selectedProduct } = useSelector(
    (state) => state.product
  );
  const [formData, setFormData] = useState(
    mode === "new" ? { ...InitialFormData } : selectedProduct
  );
  const [stock, setStock] = useState([]);
  const dispatch = useDispatch();
  const [stockError, setStockError] = useState(false);
  
  // AI 추출 관련 상태
  const [aiExtractedInfo, setAiExtractedInfo] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [hasUploadedImage, setHasUploadedImage] = useState(false);

  useEffect(() => {
    if (success) {
      setShowDialog(false);
      // 모든 상태 초기화
      setFormData({ ...InitialFormData });
      setStock([]);
      setAiExtractedInfo(null);
      setAnalysisError("");
      setHasUploadedImage(false);
      setStockError(false); // stock 오류 상태 초기화
      // success 상태 초기화
      dispatch(clearError());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error || !success) {
      dispatch(clearError());
    }
    if (showDialog) {
      if (mode === "edit") {
        setFormData(selectedProduct);
        const sizeArray = Object.keys(selectedProduct.stock).map((size) => [
          size,
          selectedProduct.stock[size],
        ]);
        setStock(sizeArray);
        setHasUploadedImage(true); // 편집 모드에서는 이미지가 이미 있음
      } else {
        setFormData({ ...InitialFormData });
        setStock([]);
        setAiExtractedInfo(null);
        setAnalysisError("");
        setHasUploadedImage(false);
      }
    }
  }, [showDialog]);

  const handleClose = () => {
    setShowDialog(false);
    setAiExtractedInfo(null);
    setAnalysisError("");
    setHasUploadedImage(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log('📝 폼 제출 이벤트 발생');
    console.log('🔍 제출 전 stock 상태:', stock);
    
    // stock 검증 개선 - 빈 문자열과 undefined 체크
    const validStock = stock.filter(item => 
      item && 
      item[0] && 
      item[0].trim() !== '' && 
      item[1] && 
      item[1].toString().trim() !== '' && 
      parseInt(item[1]) > 0
    );
    
    console.log('✅ 유효한 재고 항목:', validStock);
    
    if (validStock.length === 0) {
      setStockError(true);
      alert("재고 정보를 입력해주세요. (사이즈와 수량을 모두 입력해야 합니다)");
      return;
    }
    
    if (formData.image.length === 0) {
      alert("이미지를 업로드해주세요.");
      return;
    }
    
    try {
    const totalStock = stock.reduce((total, item) => {
        // 사이즈와 수량이 모두 있고 유효한 경우만 처리
        if (item && 
            item[0] && 
            item[0].trim() !== '' && 
            item[1] && 
            item[1].toString().trim() !== '') {
          const size = item[0].trim();
          const quantity = parseInt(item[1]);
          if (!isNaN(quantity) && quantity > 0) {
            return { ...total, [size]: quantity };
          }
        }
        return total;
    }, {});
      
      console.log('📦 원본 stock 배열:', stock);
      console.log('📦 변환된 totalStock:', totalStock);
      
      // totalStock이 비어있는지 확인
      if (Object.keys(totalStock).length === 0) {
        setStockError(true);
        alert("유효한 재고 정보가 없습니다. 사이즈와 수량을 모두 입력해주세요.");
        return;
      }

    const selectedWashMethodObjects = WASH_METHODS.filter((method) =>
      formData.washMethods.includes(method.value)
    );

    // AI 분석 결과 요약 생성
    const generateSummary = (aiInfo) => {
      if (!aiInfo) return "";
      
      const summaryParts = [];
      
      // 카테고리
      if (aiInfo.category?.primaryCategory) {
        summaryParts.push(aiInfo.category.primaryCategory);
      }
      
      // 주요 색상
      if (aiInfo.colors?.primaryColor) {
        summaryParts.push(aiInfo.colors.primaryColor);
      }
      
      // 패턴
      if (aiInfo.pattern?.type) {
        summaryParts.push(aiInfo.pattern.type);
      }
      
      // 스타일
      if (aiInfo.style?.type) {
        summaryParts.push(aiInfo.style.type);
      }
      
      // 소재
      if (aiInfo.material?.type) {
        summaryParts.push(aiInfo.material.type);
      }
      
      // 추정 세탁
      if (aiInfo.washMethodEstimation?.estimatedMethods) {
        summaryParts.push(aiInfo.washMethodEstimation.estimatedMethods.join(', '));
      }
      
      // 설명 (현재 폼에 입력된 description 사용)
      if (formData.description && formData.description.trim() !== '') {
        summaryParts.push(formData.description);
      }
      
      return summaryParts.join(', ');
    };

    const finalData = {
      ...formData,
      stock: totalStock,
      washMethods: selectedWashMethodObjects,
      // AI 추출 정보 포함 (요약 필드 추가)
      aiExtractedInfo: aiExtractedInfo ? {
        ...aiExtractedInfo,
        summary: generateSummary(aiExtractedInfo)
      } : null,
      aiAnalysis: {
        confidence: aiExtractedInfo?.category?.confidence || 0.5,
        analyzedAt: new Date(),
        modelVersion: "CLIP-ViT-B/32"
      },
      // CLIP 특징벡터 포함 - AI 서버와 일치하는 구조로 변환
      clipFeatures: aiExtractedInfo?.clipFeatures ? {
        imageVector: aiExtractedInfo.clipFeatures.imageVector || [],
        vectorDimension: aiExtractedInfo.clipFeatures.vectorDimension || 512
      } : {
        imageVector: [],
        vectorDimension: 512
      }
    };
      
      console.log('🚀 최종 전송 데이터:', finalData);
      console.log('📊 AI 추출 정보:', aiExtractedInfo);
      console.log('🧠 CLIP 특징벡터:', finalData.clipFeatures);
    
    if (mode === "new") {
        dispatch(createProduct(finalData));
        // 성공 시 즉시 모달 닫기 및 상태 초기화
        setShowDialog(false);
        setAiExtractedInfo(null);
        setAnalysisError("");
        setHasUploadedImage(false);
        setFormData({ ...InitialFormData });
        setStock([]);
        setStockError(false); // stock 오류 상태 초기화
    } else {
      dispatch(
          editProduct({ ...finalData, id: selectedProduct._id })
        );
        // 편집 성공 시 즉시 모달 닫기
        setShowDialog(false);
      }
    } catch (error) {
      console.error('❌ 상품 등록 오류:', error);
      alert('상품 등록 중 오류가 발생했습니다.');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const addStock = () => {
    setStock([...stock, ['', '']]); // [사이즈, 수량] 구조로 초기화
    setStockError(false); // 새로운 사이즈 행이 추가되면 오류 상태 초기화
  };

  const deleteStock = (idx) => {
    const newStock = stock.filter((item, index) => index !== idx);
    setStock(newStock);
    
    // 삭제 후 유효한 사이즈/수량이 있는지 확인
    const hasValidStock = newStock.some(item => 
      item && 
      item[0] && 
      item[0].trim() !== '' && 
      item[1] && 
      item[1].toString().trim() !== '' && 
      parseInt(item[1]) > 0
    );
    
    if (hasValidStock) {
      setStockError(false);
    }
  };

  const handleSizeChange = (value, index) => {
    const newStock = [...stock];
    if (!newStock[index]) {
      newStock[index] = ['', ''];
    }
    newStock[index][0] = value;
    setStock(newStock);
    
    // 사이즈가 입력되면 stockError를 false로 설정
    if (value.trim() !== '') {
      setStockError(false);
    }
  };

  const handleStockChange = (value, index) => {
    const newStock = [...stock];
    if (!newStock[index]) {
      newStock[index] = ['', ''];
    }
    newStock[index][1] = value;
    setStock(newStock);
    
    // 수량이 입력되면 stockError를 false로 설정
    if (value.trim() !== '' && parseInt(value) > 0) {
      setStockError(false);
    }
  };

  const onHandleCategory = (event) => {
    const selectedCategory = event.target.value;
    setFormData({
      ...formData,
      category: [selectedCategory],
    });
  };

  const handleWashMethodChange = (event) => {
    const { value } = event.target;
    const updatedWashMethods = formData.washMethods.includes(value)
      ? formData.washMethods.filter((method) => method !== value)
      : [...formData.washMethods, value];
    setFormData({ ...formData, washMethods: updatedWashMethods });
  };

  const uploadImage = (url) => {
    const newImages = [...formData.image, url];
    setFormData({ ...formData, image: newImages });
    setHasUploadedImage(true);
    // 자동 분석 비활성화 - 수동 버튼으로 변경
      // if (newImages.length > 0) { analyzeImages(newImages); }
};

// 이미지 삭제 핸들러
const deleteImage = (indexToDelete) => {
  console.log('🗑️ 이미지 삭제 호출:', indexToDelete);
  
  if (indexToDelete < 0 || indexToDelete >= formData.image.length) {
    console.warn('⚠️ 잘못된 이미지 인덱스:', indexToDelete);
    return;
  }
  
  const newImages = formData.image.filter((_, index) => index !== indexToDelete);
  setFormData({ ...formData, image: newImages });
  setHasUploadedImage(newImages.length > 0);
  
  // 이미지가 삭제되면 AI 분석 결과도 초기화
  if (newImages.length === 0) {
    setAiExtractedInfo(null);
    setAnalysisError("");
  }
  
  console.log('✅ 이미지 삭제 완료. 남은 이미지 수:', newImages.length);
};

  // AI 분석 시작 버튼 클릭 핸들러
  const handleAnalyzeImages = () => {
    if (formData.image.length === 0) {
      alert("분석할 이미지를 먼저 업로드해주세요.");
      return;
    }
    analyzeImages(formData.image);
  };

  // AI 이미지 분석 함수
  const analyzeImages = async (imageUrls) => {
    if (imageUrls.length === 0) return;
    
    setIsAnalyzing(true);
    setAnalysisError("");
    
    try {
      // 처음 2개 이미지만 분석 (업로드 순서대로)
      const imagesToAnalyze = imageUrls.slice(0, 2);
      console.log('🔍 AI 분석 시작:', imagesToAnalyze);
      console.log(`📸 분석할 이미지: ${imagesToAnalyze.length}개 (총 ${imageUrls.length}개 업로드됨)`);
      
      let response;
      
      // 먼저 백엔드 서버를 통해 요청 시도
      try {
        console.log('🔄 백엔드 서버를 통한 요청 시도...');
        response = await axios.post('/api/product/extract-info', {
          imageUrls: imagesToAnalyze
        }, {
          timeout: 120000 // 120초로 타임아웃 증가
        });
        console.log('✅ 백엔드 서버 응답 성공');
      } catch (backendError) {
        console.warn('⚠️ 백엔드 서버 연결 실패, 직접 AI 서버로 요청 시도...');
        
        // 백엔드 서버가 실패하면 직접 AI 서버로 요청
        const aiServerUrl = process.env.REACT_APP_AI_API_URL || 'http://165.229.89.159:8080';
        console.log('🔄 직접 AI 서버로 요청:', aiServerUrl);
        
        response = await axios.post(`${aiServerUrl}/extract-product-info`, {
          image_urls: imagesToAnalyze,  // AI 서버 형식에 맞춤
          categories: ["Outer", "Top", "Pants", "Shoes", "Acc"]
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 120000 // 120초로 타임아웃 증가
        });
        console.log('✅ 직접 AI 서버 응답 성공');
      }
      
      console.log('📡 서버 응답:', response.data);
      
      // 응답 데이터 추출 (백엔드와 직접 요청 모두 처리)
      let extractedInfo;
      if (response.data.success) {
        // 백엔드 서버 응답 형식
        extractedInfo = response.data.data;
      } else {
        // 직접 AI 서버 응답 형식
        extractedInfo = response.data.data || response.data;
      }
      
      console.log('📊 추출된 정보:', extractedInfo);
      
      // 데이터 구조 검증
      if (!extractedInfo || Object.keys(extractedInfo).length === 0) {
        console.warn('⚠️ 추출된 정보가 비어있음');
        setAnalysisError('AI 분석 결과가 비어있습니다.');
        return;
      }
      
      // CLIP 특징벡터 검증 및 로깅
      if (extractedInfo.clipFeatures) {
        console.log('🧠 CLIP 특징벡터 발견:', {
          imageVectors: extractedInfo.clipFeatures.imageVectors ? extractedInfo.clipFeatures.imageVectors.length : 0,
          averageVector: extractedInfo.clipFeatures.averageVector ? extractedInfo.clipFeatures.averageVector.length : 0,
          vectorDimension: extractedInfo.clipFeatures.vectorDimension
        });
      } else {
        console.warn('⚠️ CLIP 특징벡터가 없음');
      }
      
      // AI 분석 결과를 상태에 저장
      setAiExtractedInfo(extractedInfo);
      
      // AI 추출 정보로 폼 데이터 자동 채우기 (안전한 접근)
      const aiWashMethods = extractedInfo.washMethodEstimation?.estimatedMethods || [];
      console.log('🧼 AI 추출된 wash methods:', aiWashMethods);
      
      setFormData(prev => ({
        ...prev,
        name: extractedInfo.autoGeneratedText?.name || '',
        description: extractedInfo.autoGeneratedText?.description || '',
        category: extractedInfo.category?.primaryCategory ? [extractedInfo.category.primaryCategory] : [],
        washMethods: aiWashMethods
      }));
      
      console.log('✅ 폼 데이터 업데이트 후 washMethods:', aiWashMethods);
      
      console.log('✅ AI 분석 완료 및 폼 업데이트:', extractedInfo);
    } catch (error) {
      console.error('💥 AI 분석 오류:', error);
      
      // 더 자세한 오류 메시지 제공
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        console.error('📡 오류 응답:', { status, data });
        
        if (status === 503) {
          setAnalysisError('백엔드 서버가 실행되지 않았습니다. 백엔드 서버를 시작해주세요.');
        } else if (status === 500) {
          setAnalysisError('AI 서버 내부 오류가 발생했습니다.');
        } else {
          setAnalysisError(`서버 오류 (${status}): ${data?.detail || data?.error || '알 수 없는 오류'}`);
        }
      } else if (error.request) {
        console.error('📡 요청 실패:', error.request);
        setAnalysisError('서버에 연결할 수 없습니다. 네트워크 연결과 서버 상태를 확인해주세요.');
      } else {
        console.error('📡 기타 오류:', error.message);
        setAnalysisError(`AI 분석 중 오류가 발생했습니다: ${error.message}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // AI 추출 정보 표시 컴포넌트
  const AiAnalysisResult = () => {
    if (!aiExtractedInfo) {
      console.log('❌ aiExtractedInfo가 없음');
      return null;
    }
    
    console.log('🎯 AiAnalysisResult 렌더링:', aiExtractedInfo);
    
    // 백엔드에서 제공하는 신뢰도 정보 사용
    const confidenceBreakdown = aiExtractedInfo.confidenceBreakdown || {};
    const categoryConfidence = confidenceBreakdown.category || aiExtractedInfo.category?.confidence || 0;
    const colorConfidences = confidenceBreakdown.colors || aiExtractedInfo.colors?.colorConfidences || [0];
    const patternConfidence = confidenceBreakdown.pattern || aiExtractedInfo.pattern?.confidence || 0;
    const styleConfidence = confidenceBreakdown.style || aiExtractedInfo.style?.confidence || 0;
    const materialConfidence = confidenceBreakdown.material || aiExtractedInfo.material?.confidence || 0;
    
    // 색상 정보 (최대 2개만 표시)
    const colorPalette = aiExtractedInfo.colors?.colorPalette || [];
    
    // 신뢰도 배지 색상 결정 함수
    const getConfidenceBadgeColor = (confidence) => {
      if (confidence >= 0.8) return 'success';
      if (confidence >= 0.6) return 'info';
      if (confidence >= 0.4) return 'warning';
      return 'danger';
    };
    
    // 색상과 신뢰도를 매핑하여 표시할 색상 목록 생성 (신뢰도 0.0 초과인 것만)
    const validColorPairs = colorPalette.map((color, index) => ({
      name: color,
      confidence: colorConfidences[index] || 0
    })).filter(color => color.confidence > 0.0);
    
    // 신뢰도 순으로 정렬
    const sortedColorPairs = validColorPairs.sort((a, b) => b.confidence - a.confidence);
    
    // 최고 신뢰도 찾기
    const maxColorConfidence = sortedColorPairs.length > 0 ? sortedColorPairs[0].confidence : 0;
    
    // 최고 신뢰도와 동일한 신뢰도를 가진 색상들만 선택 (개수 제한 없음)
    const displayColors = sortedColorPairs
      .filter(color => color.confidence === maxColorConfidence);
    
    // 프론트엔드에서 계산하는 평균 신뢰도 (표시되는 모든 신뢰도 포함)
    const allConfidences = [
      categoryConfidence,
      maxColorConfidence, // 색상 최고 신뢰도 사용
      patternConfidence,
      styleConfidence,
      materialConfidence
    ];
    const averageConfidence = allConfidences.reduce((sum, conf) => sum + conf, 0) / allConfidences.length;
    
    // 평균 신뢰도 배지 색상
    const averageConfidenceColor = getConfidenceBadgeColor(averageConfidence);
    
    return (
      <Card className="mb-3">
        <Card.Header>
          <h6 className="mb-0">
            🤖 AI 분석 결과 (앞면/뒷면 신뢰도 기반 선택)
            <Badge bg={averageConfidenceColor} className="ms-2">
              평균 신뢰도: {Math.round(averageConfidence * 100)}%
            </Badge>
          </h6>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong>카테고리:</strong>
                  <Badge bg={getConfidenceBadgeColor(categoryConfidence)} size="sm">
                    {Math.round(categoryConfidence * 100)}%
                  </Badge>
                </div>
                <div className="text-muted small">
                  {aiExtractedInfo.category?.primaryCategory || '분석 중...'}
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong>주요 색상:</strong>
                  <Badge bg={getConfidenceBadgeColor(maxColorConfidence)} size="sm">
                    {Math.round(maxColorConfidence * 100)}%
                  </Badge>
                </div>
                <div className="text-muted small">
                  {displayColors.map((color, index) => (
                    <div key={index}>
                      <span>{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong>패턴:</strong>
                  <Badge bg={getConfidenceBadgeColor(patternConfidence)} size="sm">
                    {Math.round(patternConfidence * 100)}%
                  </Badge>
                </div>
                <div className="text-muted small">
                  {aiExtractedInfo.pattern?.type || '분석 중...'}
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong>스타일:</strong>
                  <Badge bg={getConfidenceBadgeColor(styleConfidence)} size="sm">
                    {Math.round(styleConfidence * 100)}%
                  </Badge>
                </div>
                <div className="text-muted small">
                  {aiExtractedInfo.style?.type || '분석 중...'}
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong>소재:</strong>
                  <Badge bg={getConfidenceBadgeColor(materialConfidence)} size="sm">
                    {Math.round(materialConfidence * 100)}%
                  </Badge>
                </div>
                <div className="text-muted small">
                  {aiExtractedInfo.material?.type || '분석 중...'}
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong>추정 세탁:</strong>
                  <Badge bg="info" size="sm">
                    AI 추정
                  </Badge>
                </div>
                <div className="text-muted small">
                  {aiExtractedInfo.washMethodEstimation?.estimatedMethods?.join(', ') || '분석 중...'}
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  // 이미지 업로드 안내 컴포넌트
  const ImageUploadGuide = () => {
    if (hasUploadedImage) return null;
    
    return (
      <Alert variant="info" className="mb-3">
        <h6>📸 이미지 업로드 안내</h6>
        <p className="mb-0">
          상품 등록을 위해 먼저 이미지를 업로드해주세요. 
          이미지가 업로드되면 AI가 자동으로 상품 정보를 분석하여 입력 폼을 채워드립니다.
        </p>
      </Alert>
    );
  };

  return (
    <Modal show={showDialog} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "new" ? "Add New Item" : "Edit Item"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
          {/* 이미지 업로드 안내 */}
          <ImageUploadGuide />
          
          {/* 이미지 업로드 섹션 */}
          <Form.Group className="mb-3" controlId="Image" required>
            <Form.Label>Image *</Form.Label>
            <CloudinaryUploadWidget uploadImage={uploadImage} />
            <div className="mt-2">
              {formData.image.map((img, index) => (
                <div 
                  key={index} 
                  style={{ position: "relative", display: "inline-block", margin: "5px" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={img}
                    alt={`Product ${index + 1}`}
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      deleteImage(index);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 10,
                      opacity: 0.7,
                      transition: "opacity 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = "1"}
                    onMouseLeave={(e) => e.target.style.opacity = "0.7"}
                    title="이미지 삭제"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {formData.image.length > 0 && (
              <div className="mt-3">
                <Button 
                  variant="primary" 
                  onClick={handleAnalyzeImages}
                  disabled={isAnalyzing}
                  className="me-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      AI 분석 중...
                    </>
                  ) : (
                    "🤖 AI 분석 시작"
                  )}
                </Button>
                <small className="text-muted">
                  이미지를 업로드한 후 AI 분석을 시작하세요.
                </small>
        </div>
      )}
          </Form.Group>

          {/* AI 분석 결과 표시 */}
          {aiExtractedInfo && <AiAnalysisResult />}
          
          {/* 분석 중 표시 */}
          {isAnalyzing && (
            <Alert variant="info" className="mb-3">
              <Spinner animation="border" size="sm" className="me-2" />
              AI가 이미지를 분석하고 있습니다...
            </Alert>
          )}
          
          {/* 분석 오류 표시 */}
          {analysisError && (
            <Alert variant="danger" className="mb-3">
              {analysisError}
            </Alert>
          )}

          {/* 나머지 폼 필드들 (이미지 업로드 후 활성화) */}
          <div className={formData.image.length === 0 ? "opacity-50" : ""}>
            
            {/* 관리자 직접 입력 영역 */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">📝 관리자 직접 입력</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="SKU" required>
                      <Form.Label>SKU *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter SKU"
                        value={formData.sku}
                        onChange={handleChange}
                        name="sku"
                        disabled={formData.image.length === 0}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="Price" required>
                      <Form.Label>Price *</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter price"
                        value={formData.price}
                        onChange={handleChange}
                        name="price"
                        disabled={formData.image.length === 0}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="Height" required>
                      <Form.Label>Height *</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter height"
                        value={formData.height}
                        onChange={handleChange}
                        name="height"
                        disabled={formData.image.length === 0}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="Weight" required>
                      <Form.Label>Weight *</Form.Label>
            <Form.Control
                        type="number"
                        placeholder="Enter weight"
                        value={formData.weight}
              onChange={handleChange}
                        name="weight"
                        disabled={formData.image.length === 0}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                {/* 재고 관리 */}
                <Form.Group className="mb-3" controlId="Stock" required>
                  <Form.Label>Stock *</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {stock.map((item, index) => (
                      <div key={index} className="d-flex align-items-center">
                        <Form.Select
                          value={item[0] || ""}
                          onChange={(e) => handleSizeChange(e.target.value, index)}
                          style={{ width: "100px" }}
                          disabled={formData.image.length === 0}
                        >
                          <option value="">Size</option>
                          {SIZE.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </Form.Select>
                      <Form.Control
                        type="number"
                          value={item[1] || ""}
                          onChange={(e) => handleStockChange(e.target.value, index)}
                          style={{ width: "80px" }}
                          placeholder="Qty"
                          disabled={formData.image.length === 0}
                        />
                      <Button
                          variant="outline-danger"
                        size="sm"
                        onClick={() => deleteStock(index)}
                          disabled={formData.image.length === 0}
                      >
                          X
                      </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={addStock}
                      disabled={formData.image.length === 0}
                    >
                      + Add Size
                    </Button>
                  </div>
                  {(() => {
                    const hasValidStock = stock.some(item => 
                      item && 
                      item[0] && 
                      item[0].trim() !== '' && 
                      item[1] && 
                      item[1].toString().trim() !== '' && 
                      parseInt(item[1]) > 0
                    );
                    return !hasValidStock && stock.length > 0 ? (
                      <div className="text-danger mt-2">
                        Please add at least one size and quantity.
                      </div>
                    ) : null;
                  })()}
            </Form.Group>
              </Card.Body>
            </Card>

            {/* AI 자동 채우기 영역 */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">🤖 AI 자동 채우기 (수정 가능)</h6>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3" controlId="Name" required>
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
              value={formData.name}
                    onChange={handleChange}
                    name="name"
                    disabled={formData.image.length === 0}
            />
          </Form.Group>

                <Form.Group className="mb-3" controlId="Description" required>
                  <Form.Label>Description *</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
                    placeholder="Enter product description"
            value={formData.description}
                    onChange={handleChange}
                    name="description"
                    disabled={formData.image.length === 0}
          />
        </Form.Group>

                <Form.Group className="mb-3" controlId="Category" required>
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={onHandleCategory}
                    name="category"
                    disabled={formData.image.length === 0}
                  >
                    <option value="">Select category</option>
                    {CATEGORY.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>

            <Form.Group className="mb-3">
              <Form.Label>Wash Methods</Form.Label>
              {(() => {
                console.log('🔍 현재 formData.washMethods:', formData.washMethods);
                return null;
              })()}
          <div className="d-flex flex-wrap gap-3">
                {WASH_METHODS.map((method, index) => {
                  const isChecked = formData.washMethods.includes(method.value);
                  console.log(`🔍 ${method.label} (${method.value}): ${isChecked ? '체크됨' : '체크안됨'}`);
                  return (
                    <div key={index} className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  id={`wash-${method.value}`}
                  value={method.value}
                  checked={isChecked}
                  onChange={handleWashMethodChange}
                      disabled={formData.image.length === 0}
                  className="me-2"
                />
                <label htmlFor={`wash-${method.value}`} className="d-flex align-items-center">
                      <img src={method.image} alt={method.label} width={32} height={32} style={{ objectFit: "contain", marginRight: "8px" }} />
                  <span>{method.label}</span>
                </label>
              </div>
                  );
                })}
          </div>
        </Form.Group>

            <Form.Group className="mb-3" controlId="Status" required>
              <Form.Label>Status *</Form.Label>
              <Form.Select
                value={formData.status}
              onChange={handleChange}
                name="status"
                disabled={formData.image.length === 0}
              >
                {STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Select>
          </Form.Group>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
          </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={formData.image.length === 0}
        >
          {mode === "new" ? "Create" : "Update"}
          </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewItemDialog;
