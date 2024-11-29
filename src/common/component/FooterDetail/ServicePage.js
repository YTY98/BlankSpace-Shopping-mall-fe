import React, { useEffect } from "react";
import Footer from '../Footer';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ScrollToTopButton from "./ScrollToTopButton";


function ServicePage() {
  
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
          <h5 className='term-title'>이용 안내</h5>
          <br />
          <div className="term-content">
          <h6>회원가입 안내</h6>
            <p>[회원가입] 메뉴를 통해 이용약관, 개인정보보호정책 동의 및 일정 양식의 가입항목을 기입함으로써 회원에 가입되며, 가입 즉시 서비스를 무료로 이용하실 수 있습니다.<br />
            주문하실 때에 입력해야 하는 각종 정보들을 일일이 입력하지 않으셔도 됩니다. 그리고 공동구매 및 경매행사에 항상 참여하실 수 있고, 회원을 위한 이벤트 및 각종 할인행사에 참여하실 수 있습니다.<br /><br /></p>

            <h6>주문 안내</h6>
            <p>상품주문은 다음 단계로 이루어집니다.<br />
            - Step1: 상품검색<br />
            - Step2: 장바구니에 담기<br />
            - Step3: 회원ID 로그인<br />
            - Step4: 주문서 작성<br />
            - Step5: 결제방법 선택 및 결제<br />
            - Step6: 주문 성공 화면 (주문번호)<br /><br /></p>

            <h6>배송 안내</h6>
            <p>배송 방법 : 택배<br />
            배송 지역 : 전국지역<br />
            배송 비용 : 조건부 무료 - 주문 금액 70,000원 미만일 때 배송비 3,000원을 추가합니다.<br />
            배송 기간 : 3일 ~ 7일<br />
            - 산간벽지나 도서지방은 별도의 추가금액을 지불하셔야 하는 경우가 있습니다.<br />
            고객님께서 주문하신 상품은 입금 확인 후 배송해 드립니다. 다만, 상품 종류에 따라서 상품의 배송이 다소 지연될 수 있습니다.<br /><br /></p>

            <h6>교환/반품 안내</h6>
            <p>교환 및 반품이 가능한 경우<br />
            - 상품을 공급 받으신 날로부터 7일 이내 단, 상품가치가 상실된 경우에는 교환/반품이 불가능합니다.<br /></p>

            <p>교환 및 반품이 불가능한 경우<br />
            - 고객님의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우<br />
            - 포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우<br />
            - 고객님의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우<br />
            - 시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우<br />
            (자세한 내용은 고객센터 상담을 이용해 주시기 바랍니다.)<br /></p>

            <p><strong><u>※ 고객님의 마음이 바뀌어 교환, 반품을 하실 경우 상품 반송 비용은 고객님께서 부담하셔야 합니다.</u></strong><br />
            (색상 교환, 사이즈 교환 등 포함)<br /><br /></p>

            <h6>환불 안내</h6>
            <p>환불 시 반품 확인 여부를 확인한 후 3영업일 이내에 결제 금액을 환불해 드립니다.<br />
            신용카드로 결제하신 경우는 신용카드 승인을 취소하여 결제 대금이 청구되지 않게 합니다.<br />
            (단, 신용카드 결제일자에 맞추어 대금이 청구될 수 있으면 이 경우 익월 신용카드 대금청구 시 카드사에서 환급 처리됩니다.)</p>

            <ScrollToTopButton />
          </div>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
}

export default ServicePage;