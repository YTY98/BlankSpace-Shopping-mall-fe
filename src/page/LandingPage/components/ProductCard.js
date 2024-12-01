// // import React from "react";
// // import { useNavigate } from "react-router-dom";
// // import { currencyFormat } from "../../../utils/number";

// // const ProductCard = ({ item }) => {
// //   const navigate = useNavigate();
// //   const showProduct = (id) => {
// //     navigate(`/product/${id}`);
// //   };
// //   return (
// //     <div className="card" onClick={() => showProduct(item._id)}>
// //       <img src={item?.image} alt={item?.image} />
// //       <div>{item?.name}</div>
// //       <div>₩ {currencyFormat(item?.price)}</div>
// //     </div>
// //   );
// // };

// // export default ProductCard;


// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { currencyFormat } from "../../../utils/number";

// const ProductCard = ({ item }) => {
//   const navigate = useNavigate();


//   const showProduct = (id) => {
//     navigate(`/product/${id}`);
//   };

//   return (
//     <div className="card" onClick={() => showProduct(item._id)}>
//       <img src={item?.image} alt={item?.image} />
//       <div>{item?.name}</div>
//       <div>₩ {currencyFormat(item?.price)}</div>
//     </div>
//   );
// };

// export default ProductCard;

import React , { useState }from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(item?.image[0] || "");

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

  return (
    <Card className="card" onClick={() => showProduct(item._id)}>
      <Card.Img
        variant="top"
        src={mainImage || item?.image[0]} // 이미지 변경 시 첫 번째 이미지 또는 선택된 이미지 표시
        alt={item?.name}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <Card.Body>
        <Card.Title>{item?.name}</Card.Title>
        <Card.Text>
          ₩ {currencyFormat(item?.price)} {/* 가격 표시 */}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
