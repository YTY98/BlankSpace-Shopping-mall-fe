import React from "react";
import { Row, Col, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { badgeBg } from "../../../../constants/order.constants";
import { currencyFormat } from "../../../../utils/number";

const OrderStatusCard = ({ orderItem }) => {
  return (
    <div>
      <Row className="status-card">
        <Col xs={2}>
          <img
            src={orderItem.items[0]?.productId?.image[0]}
            alt={orderItem.items[0]?.productId?.image}
            height={96}
          />
        </Col>
        <Col xs={8} className="order-info">
          <div>
            <strong>주문번호: {orderItem.orderNum}</strong>
          </div>

          <div className="text-12">{orderItem.createdAt.slice(0, 10)}</div>

          <div>
            {orderItem.items[0].productId.name}
            {orderItem.items.length > 1 && `외 ${orderItem.items.length - 1}개`}
          </div>
          <div>₩ {currencyFormat(orderItem.totalPrice)}</div>
        </Col>
        <Col md={2} className="vertical-middle">
          <div className="text-align-center text-12">주문상태</div>
          <Badge bg={badgeBg[orderItem.status]}>{orderItem.status}</Badge>

          <div className="mt-1 text-align-center">
            {orderItem.status === "delivered" ? 
              orderItem.isReviewed === true ? (<span style={{ fontSize: "12px"}}>리뷰 작성 완료</span>) : (
              <Link to={`/write-review/${orderItem.items[0]?.productId?._id}`}
              state={{
                orderId: orderItem._id, // 주문 ID
                orderNum: orderItem.orderNum, // 주문 번호
                productId: orderItem.items[0]?.productId?._id, // 상품 ID
                productName: orderItem.items[0]?.productId?.name, // 상품 이름
                userName: orderItem.userId.name, // 유저 이름
              }}
              >
                <Button variant="primary" size="sm" >
                  리뷰 작성
                </Button>
              </Link>
            ) : (
              <div className="text-danger text-12"></div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default OrderStatusCard;