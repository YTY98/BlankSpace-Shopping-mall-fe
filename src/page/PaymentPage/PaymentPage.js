import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import "./style/paymentPage.style.css";
import { cc_expires_format } from "../../utils/number";
import { createOrder } from "../../features/order/orderSlice";
import { fetchUserInfo } from "../../features/user/userSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.user);
  const { cartList, totalPrice } = useSelector((state) => state.cart);
  const { orderNum, error } = useSelector((state) => state.order);
  const [cardValue, setCardValue] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });
  const navigate = useNavigate();
  const [firstLoading, setFirstLoading] = useState(true);
  const [shipInfo, setShipInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    address2: "",
    city: "",
    zip: "",
  });
  const currentMileage = user.mileage;
  const [useMileage, setUseMileage] = useState(0);



  useEffect(() => {
    if (user?.mileage !== undefined) {
      setUseMileage(user.mileage); // user 객체가 로드되면 mileage 값 설정
    }
  }, [user]);

  useEffect(() => {
    if (firstLoading) {
      // useEffect가 처음에 호출될 때 오더 성공페이지로 넘어가는 것을 막기 위해서
      setFirstLoading(false);
    } else {
      if (orderNum !== "") {
        navigate("/payment/success");
      }
    }
  }, [orderNum]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const { firstName, lastName, contact, address, address2, city, zip } = shipInfo;
    dispatch(
      createOrder({
        totalPrice,
        useMileage,
        currentMileage,
        shipTo: { address: `${address} ${address2 || ''}`, city, zip },
        contact: { contact, lastName, firstName },
        orderList: cartList.map((item) => {
          return {
            productId: item.productId._id,
            price: item.productId.price,
            qty: item.qty,
            size: item.size,
          };
        }),
      })
    );
  };
  
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setShipInfo({ ...shipInfo, [name]: value });
  };

  const handleUseMileage = (event) => {
    const { value } = event.target;

    if (value === "") {
      // 입력값이 비어있을 때는 빈 문자열로 설정
      setUseMileage("");
      return;
    }

    const inputMileage = parseInt(value, 10); // 입력값을 정수로 변환
    if (
      isNaN(inputMileage) ||
      inputMileage > user.mileage ||
      inputMileage < 0
    ) {
      // 유효하지 않거나 사용 가능한 마일리지보다 크면 제한
      setUseMileage(user.mileage);
    } else {
      // 유효한 값만 설정
      setUseMileage(inputMileage);
    }
  };

  const handlePaymentInfoChange = (event) => {
    const { name, value } = event.target;
    if (name === "expiry") {
      let newValue = cc_expires_format(value);

      setCardValue({ ...cardValue, [name]: newValue });
      return;
    }
    setCardValue({ ...cardValue, [name]: value });
  };

  const handleInputFocus = (e) => {
    setCardValue({ ...cardValue, focus: e.target.name });
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        setShipInfo({
          ...shipInfo,
          zip: data.zonecode,
          address: data.address,
          city: data.sido,
        });
      }
    }).open();
  };

  if (cartList?.length === 0) {
    navigate("/cart");
  }
  return (
    <Container>
      <Row>
        <Col lg={7}>
          <div>
            <h2 className="mb-2">배송 주소</h2>
            <div>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="lastName">
                    <Form.Label>성</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="lastName"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="firstName">
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="firstName"
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>연락처</Form.Label>
                  <Form.Control
                    placeholder="010-xxx-xxxxx"
                    onChange={handleFormChange}
                    required
                    name="contact"
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} md={4} controlId="formGridZip">
                    <Form.Label>우편번호</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        value={shipInfo.zip}
                        readOnly
                        name="zip"
                        className="readonly-input"
                      />
                      <Button variant="outline-secondary" onClick={handleAddressSearch} className="ms-2 address-search-btn">
                        검색
                      </Button>
                    </div>
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress">
                  <Form.Label>주소</Form.Label>
                  <Form.Control
                    value={shipInfo.address}
                    readOnly
                    name="address"
                    className="readonly-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label>상세주소</Form.Label>
                  <Form.Control
                    placeholder="상세주소를 입력하세요"
                    onChange={handleFormChange}
                    name="address2"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridCity">
                  <Form.Label>도시</Form.Label>
                  <Form.Control
                    value={shipInfo.city}
                    readOnly
                    name="city"
                    className="readonly-input"
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridMileage">
                    <Form.Label>마일리지</Form.Label>
                    <Form.Control
                      type="number" // 숫자만 입력 가능
                      placeholder={`${user.mileage} 사용가능`} // 사용 가능한 마일리지 표시
                      value={useMileage} // mileage 상태와 연동
                      onChange={handleUseMileage} // 입력값 제한 함수 연결
                      name="mileage"
                    />
                  </Form.Group>
                </Row>
                <div className="mobile-receipt-area">
                  <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
                </div>
                <div>
                  <h2 className="payment-title">결제 정보</h2>
                  <PaymentForm
                    cardValue={cardValue}
                    handlePaymentInfoChange={handlePaymentInfoChange}
                    handleInputFocus={handleInputFocus}
                  />
                </div>

                <Button
                  variant="dark"
                  className="payment-button pay-button"
                  type="submit"
                >
                  결제하기
                </Button>
              </Form>
            </div>
          </div>
        </Col>
        <Col lg={5} className="receipt-area">
          <OrderReceipt cartList={cartList} totalPrice={totalPrice} mileage={useMileage} />
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
