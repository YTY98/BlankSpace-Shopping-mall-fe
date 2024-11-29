import React, { useEffect } from "react";
import Footer from '../Footer';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ScrollToTopButton from "./ScrollToTopButton";


function StorePage() {
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
  });
  }, []);
  
  return (
    <Container fluid className="custom-container">
      <Row className="justify-content-center">
        <Col xs={12} md={12} lg={10}>
          <h5 className='term-title'>입점 문의</h5>
          <br />
          <div className="term-content">
          <h6>1. 입점 절차</h6>
          <p>입점 신청: 하단의 문의 양식을 작성하여 접수해 주세요.<br />
          검토: 접수된 내용을 바탕으로 담당자가 검토 후 연락드립니다.<br />
          계약 체결 및 입점 준비: 계약 체결 후 입점에 필요한 자료(상품 정보, 이미지 등)를 준비합니다.<br />
          상품 등록 및 판매 시작: 준비가 완료되면 상품을 등록하고 판매를 시작할 수 있습니다.<br /><br /></p>

          <h6>2. 문의 방법</h6>
          <p>입점을 희망하시는 분은 아래 정보를 포함하여 입점 문의 이메일을 보내주시면 담당자가 신속히 검토 후 답변드리겠습니다.<br /><br />

          회사명/브랜드명:<br />
          담당자명:<br />
          연락처:<br />
          이메일:<br />
          취급 상품:<br />
          입점 희망 카테고리:<br />
          기타 요청 사항:<br /><br />

          <strong>문의 이메일</strong>: blankspace@naver.com<br />
          <strong>전화번호</strong>: 010-9955-5354</p>
          
          <ScrollToTopButton />
          </div>
        </Col>
      </Row>


      <Footer />
    </Container>
  );
}

export default StorePage;