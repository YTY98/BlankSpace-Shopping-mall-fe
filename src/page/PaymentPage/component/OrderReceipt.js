import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import { Row, Col } from "react-bootstrap";
import "./OrderReceipt.css";

const OrderReceipt = ({ cartList, totalPrice, mileage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCartPage = location.pathname.includes("/cart");
  const deliveryFee = totalPrice >= 50000 ? 0 : 3000;
  const finalPrice = totalPrice + deliveryFee - (mileage || 0);

  return (
    <div className="receipt-container">
      <div className="receipt-header">
        <h3 className="receipt-title">{isCartPage ? "쇼핑백" : "결제 내역"}</h3>
      </div>
      
      {/* 상품 목록 */}
      <div className="product-list">
        <h4 className="section-title">주문 상품 정보</h4>
        {cartList.length > 0 &&
          cartList.map((item, index) => (
            <div key={index} className="product-item">
              <div className="product-image">
                <img 
                  src={item.productId.image[0]} 
                  alt={item.productId.name}
                  className="thumbnail"
                />
              </div>
              <div className="product-info">
                <div className="product-name">{item.productId.name}</div>
                <div className="product-option">
                  <span className="option-label">구매수량:</span> {item.qty}개
                  {item.size && <span className="size-info">ㆍ{item.size}</span>}
                </div>
                <div className="product-price">₩ {currencyFormat(item.productId.price * item.qty)}</div>
              </div>
            </div>
          ))}
      </div>

      {/* 가격 정보 */}
      <div className="price-summary">
        <h4 className="section-title">결제 예정 금액</h4>
        <div className="summary-row">
          <span>상품 금액</span>
          <span>₩ {currencyFormat(totalPrice)}</span>
        </div>
        <div className="summary-row">
          <span>배송비</span>
          <span>
            {deliveryFee === 0 ? (
              <span className="free-delivery">무료배송</span>
            ) : (
              `₩ ${currencyFormat(deliveryFee)}`
            )}
          </span>
        </div>
        {!isCartPage && mileage > 0 && (
          <div className="summary-row discount">
            <span>마일리지 할인</span>
            <span>- ₩ {currencyFormat(mileage)}</span>
          </div>
        )}
        <div className="total-row">
          <span>총 결제예정금액</span>
          <span className="final-price">₩ {currencyFormat(finalPrice)}</span>
        </div>
      </div>

      {/* 배송비 안내 */}
      <div className="delivery-info">
        {totalPrice < 50000 ? (
          <p className="free-delivery-guide">
            ₩{currencyFormat(50000 - totalPrice)}원 추가 구매 시, 무료배송 혜택을 받으실 수 있습니다.
          </p>
        ) : (
          <p className="free-delivery-applied">
            무료배송 혜택이 적용되었습니다.
          </p>
        )}
      </div>

      {/* 장바구니 페이지에서만 보이는 결제 계속하기 버튼 */}
      {isCartPage && cartList.length > 0 && (
        <Button
          variant="dark"
          className="payment-button"
          onClick={() => navigate("/payment")}
        >
          결제 계속하기
        </Button>
      )}

      {/* 결제 안내 */}
      {!isCartPage && (
        <div className="payment-info">
          <div className="payment-methods">
            <p className="method-title">이용 가능한 결제 수단</p>
            <ul>
              <li>신용카드: 전체 카드사 이용 가능</li>
              <li>체크카드: 전체 카드사 이용 가능</li>
              <li>실시간 계좌이체: 계좌 잔액 내 결제 가능</li>
              <li>무통장 입금: 가상계좌 발급 후 입금</li>
            </ul>
          </div>
          <div className="payment-notice">
            <p className="notice-title">안내사항</p>
            <ul>
              <li>카드사 할부 안내: 무이자할부 혜택은 카드사 정책에 따라 다를 수 있습니다.</li>
              <li>주문 완료 후 평균 1-3일 이내 출고됩니다. (주말/공휴일 제외)</li>
              <li>결제 완료 후 주문 내역은 마이페이지에서 확인하실 수 있습니다.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderReceipt;
