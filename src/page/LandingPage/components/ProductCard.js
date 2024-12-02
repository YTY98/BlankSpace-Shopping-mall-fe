import React, { useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons"; // 속이 찬 하트
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons"; // 속이 빈 하트
const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(item?.image[0] || "");
  const [wishState, setWishState] = useState(false);
  const handleMouseEnter = () => {
    if (item?.image?.length > 1) {
      setMainImage(item.image[1]); // 마우스를 올리면 두 번째 이미지로 변경
    }
  };

  const handleMouseLeave = () => {
    setMainImage(item?.image[0] || ""); // 마우스를 떼면 첫 번째 이미지로 되돌리기
  };

  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const handleWishClick = (event) => {
    event.stopPropagation();
    if (wishState === true) setWishState(false);
    else setWishState(true);
  };

  return (
    <Card
      className="card"
      style={{ backgroundColor: "#FAF9F8", width: "100%", height: "100%" }}
      onClick={() => showProduct(item._id)}
    >
      <Card.Img
        variant="top"
        src={mainImage || item?.image[0]} // 이미지 변경 시 첫 번째 이미지 또는 선택된 이미지 표시
        alt={item?.name}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "relative",
        }}
      />
      <button
        onClick={handleWishClick}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "none",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          padding: "0px",
        }}
      >
        {wishState === true ? (
          <FontAwesomeIcon
            icon={solidHeart}
            
            className="fa-bounce"
            size="2x"
            style={{ color: "#ff0000", cursor: "pointer", width: "80%", animation: "fa-bounce 1s ease-in-out 1"  }}
          />
        ) : (
          <FontAwesomeIcon icon={regularHeart} size="2x" style={{ cursor: "pointer", width: "80%" }} />
        )}
      </button>

      <Card.Body style={{ padding: "0px", height: "3rem" }}>
        <Card.Text sm={3}>
          <Row md={12}>
            <Col
              md={7}
              sm={8}
              style={{
                paddingTop: "1px",
                paddingLeft: "1rem",
                fontSize: "12px",
                fontWeight: "600",
                textAlign: "left",
              }}
            >
              {item.name}
            </Col>
            <Col
              md={5}
              sm={4}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingRight: "16px",
                paddingLeft: "0px",
                fontSize: "13px",
                fontWeight: "700",
                textAlign: "right",
              }}
            >
              ₩ {currencyFormat(item.price)}
            </Col>
          </Row>
        </Card.Text>
        {/* <Card.Title>{item?.name}</Card.Title>
        <Card.Text>
          ₩ {currencyFormat(item?.price)} {/* 가격 표시 }
        </Card.Text> */}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
