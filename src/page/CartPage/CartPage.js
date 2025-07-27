import React, { useState } from "react";
import { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CartProductCard from "./component/CartProductCard";
import CartTryOnModal from "./component/CartTryOnModal";
import TryOnModal from "../ProductDetailPage/components/TryOnModal";
import OrderReceipt from "../PaymentPage/component/OrderReceipt";
import "./style/cart.style.css";
import { getCartList } from "../../features/cart/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartList, totalPrice } = useSelector((state) => state.cart);
  const [showCartTryOnModal, setShowCartTryOnModal] = useState(false);
  const [showIndividualTryOnModal, setShowIndividualTryOnModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(getCartList());
  }, [dispatch]);

  useEffect(() => {
  }, [cartList, totalPrice]);

  const handleCartTryOnClick = () => {
    setShowCartTryOnModal(true);
  };

  const handleIndividualTryOnClick = (product) => {
    setSelectedProduct(product);
    setShowIndividualTryOnModal(true);
  };
  return (
    <Container>
      <Row>
        <Col xs={12} md={7}>
          {cartList.length > 0 ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>장바구니 상품</h3>
                <Button 
                  variant="primary" 
                  onClick={handleCartTryOnClick}
                  className="try-on-all-btn"
                >
                  전체 가상 시착
                </Button>
              </div>
              {cartList.map((item) => (
                <CartProductCard 
                  item={item} 
                  key={item._id} 
                  onTryOnClick={() => handleIndividualTryOnClick(item.productId)}
                />
              ))}
            </>
          ) : (
            <div className="text-align-center empty-bag">
              <h2>카트가 비어있습니다.</h2>
              <div>상품을 담아주세요!</div>
            </div>
          )}
        </Col>
        <Col xs={12} md={5}>
          <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
        </Col>
      </Row>

      {/* 전체 가상 시착 모달 */}
      <CartTryOnModal
        show={showCartTryOnModal}
        onClose={() => setShowCartTryOnModal(false)}
        cartItems={cartList}
        apiKey={process.env.REACT_APP_FASHN_API_KEY}
      />

      {/* 개별 상품 가상 시착 모달 */}
      {selectedProduct && (
        <TryOnModal
          show={showIndividualTryOnModal}
          onClose={() => setShowIndividualTryOnModal(false)}
          clothImageUrl={selectedProduct.image[0]}
          clothImageUrl2={selectedProduct.image[1] || selectedProduct.image[0]}
          apiKey={process.env.REACT_APP_FASHN_API_KEY}
        />
      )}
    </Container>
  );
};

export default CartPage;
