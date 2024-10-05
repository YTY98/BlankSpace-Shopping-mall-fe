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

import React from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();

  // 아이템 객체 콘솔에 출력
  console.log("ProductCard item:", item);

  // 첫 번째 이미지를 사용하도록 설정
  const imageUrl = item.image && item.image.length > 0 ? item.image[0] : "placeholder.jpg";

  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="card" onClick={() => showProduct(item._id)}>
      <img src={imageUrl} alt={item.name} /> {/* 첫 번째 이미지 URL 사용 */}
      <div>{item.name}</div>
      <div>₩ {currencyFormat(item.price)}</div>
    </div>
  );
};

export default ProductCard;
