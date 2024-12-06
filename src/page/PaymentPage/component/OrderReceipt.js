import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import { Row, Col } from "react-bootstrap";
const OrderReceipt = ({ cartList, totalPrice, mileage }) => {
  const location = useLocation();
  const navigate = useNavigate();

  console.log(totalPrice, mileage);

  return (
    <div className="receipt-container">
      <h3 className="receipt-title">주문 내역</h3>
      <ul className="receipt-list">
        <Row>
          {cartList.length > 0 &&
            cartList.map((item, index) => (
              <Row style={{paddingRight: "0px"}}>
                <Col xs={8} sm={8} md={6} lg={8} style={{paddingRight: "0px"}}>
                  <div>{item.productId.name}</div>
                </Col>
                <Col xs={1} sm={1} md={1} lg={1} style={{ textAlign: "right" }}>
                  <div>₩</div>
                </Col>
                <Col xs={3} sm={3} md={4} lg={3} style={{ justifyContent: "flex-end", textAlign: "right", paddingRight: "0px"}}>
                  <div>{currencyFormat(item.productId.price * item.qty)}</div>
                </Col>
                </Row>
            ))}
        </Row>
      </ul>
      <div className="display-flex space-between receipt-title">
        <div>
          <strong>Total:</strong>
        </div>
        <div>
      {location.pathname.includes("/cart") ? (
        // "/cart" 페이지에서는 마일리지 관련 표시 안 함
        <strong>₩ {currencyFormat(totalPrice)}</strong>
      ) : (
        // 다른 페이지 (예: "/payment")에서 마일리지 조건에 따라 표시
        <div>
          {mileage !== 0 ? (
            <>
              <strong style={{ textDecoration: "line-through" }}>
                ₩ {currencyFormat(totalPrice)}
              </strong>
              <strong> ₩ {currencyFormat(totalPrice - mileage)}</strong>
            </>
          ) : (
            <strong>₩ {currencyFormat(totalPrice)}</strong>
          )}
        </div>
      )}
    </div>
      </div>
      {location.pathname.includes("/cart") && cartList.length > 0 && (
        <Button
          variant="dark"
          className="payment-button"
          onClick={() => navigate("/payment")}
        >
          결제 계속하기
        </Button>
      )}

      <div>
        가능한 결제 수단 귀하가 결제 단계에 도달할 때까지 가격 및 배송료는
        확인되지 않습니다.
        <div>
          30일의 반품 가능 기간, 반품 수수료 및 미수취시 발생하는 추가 배송 요금
          읽어보기 반품 및 환불
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
