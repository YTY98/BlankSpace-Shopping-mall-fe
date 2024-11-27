import React, { useEffect } from "react";
import Footer from '../Footer';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ScrollToTopButton from "./ScrollToTopButton";


function SendPage() {

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
          <h5 className='term-title'>배송/환불 규정</h5>
          <br />
          <div className="term-content">
          <p><strong><u>반품 및 교환은 제품 수령일로부터 7일 이내에 접수하신 경우에만 가능합니다.</u></strong><br />
          구매 확정을 하신 후에는 반품 및 교환 접수가 불가하며, 모든 주문건은 배송 완료 7일 후 자동으로 구매 확정 처리됩니다.<br />
          제품을 보내주실 때에는 수령한 상태 그대로 발송해주세요. 보내드린 사은품 및 옷걸이 등 모든 구성품이 동봉되지 않았을 경우에는 추가 비용이 청구될 수 있습니다.<br />
          제품을 사용한 흔적이 있거나 이염, 택/라벨 훼손 등으로 인해 제품 가치가 상실된 경우에는 교환/반품이 어려울 수 있습니다.<br /><br />

          제품 생산 과정에서 발생할 수 있는 미세한 잡사, 마감 처리 실밥, 초크 자국, 불규칙한 패턴 등은 불량으로 간주되지 않습니다.<br /><br /></p>

          <h6>반품/교환 주소지</h6>
          <p>(41736) 경상북도 경산시 대학로 280 BLANKSPACE<br /><br /></p>

          <h6>반품 절차</h6>
          <p>1. 이 사이트에서 주문 조회를 클릭합니다.<br />
          2. 해당 구매내역에 있는 반품신청 항목을 클릭합니다.<br />
          3. 반품 신청 하실 제품을 체크한 후 반품 사유를 입력합니다.<br />
          4. 수거 신청 또는 직접 발송 옵션 중 편리한 방법으로 선택해주세요.<br />
          수거 신청 요청 시 수거지를 입력해주시면 자동으로 택배사 수거 접수되며 1-2일 내에 기사님이 방문하여 반품 상품을 수거합니다.<br />
          5. 반품상품이 수거되고 나면 반품택배비 차감 후 결제하신 수단으로 환불이 처리됩니다.<br />
          불량/오배송의 경우 반품택배비는 BLANKSPACE에서 부담합니다.<br /><br /></p>

          <h6>교환 절차</h6>
          <p>교환을 원하시는 경우 Q&A 게시판을 통해 접수해주세요.<br />
          재고 가능 여부를 확인하지 않고 접수하시는 경우 품절로 교환 처리가 어려울 수 있습니다.<br />
          *동일 상품에 대한 교환은 1회만 가능합니다.<br /><br /></p>

          <h6>환불 안내</h6>
          <p>반품하신 제품이 저희에게 도착하면, 상품 확인 절차를 마친 후 고객님께서 결제 시 사용하셨던 지불 수단을 이용하여 환불해드립니다.<br />
          상품 도착 후 환불까지는 영업일 기준 2~4일 정도가 소요될 수 있습니다.<br />
          무통장입금 결제 건은 환불 계좌를 남겨주셔야 합니다.<br />
          휴대폰 결제 건은 부분취소/익월 취소가 불가능하여 예치금으로 환불 처리될 수 있습니다.</p>

          <ScrollToTopButton />
          </div>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
}

export default SendPage;