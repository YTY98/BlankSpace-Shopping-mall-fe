// import React, { useEffect, useState } from "react";
// import { Container } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import ReactPaginate from "react-paginate";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import OrderDetailDialog from "./component/OrderDetailDialog";
// import OrderTable from "./component/OrderTable";
// import SearchBox from "../../common/component/SearchBox";
// import {
//   getOrderList,
//   setSelectedOrder,
// } from "../../features/order/orderSlice";

// const AdminOrderPage = () => {
//   const navigate = useNavigate();
//   const [query, setQuery] = useSearchParams();
//   const dispatch = useDispatch();
//   const orderList = useSelector((state) => state.order.orderList);
//   const totalPageNum = useSelector((state) => state.order.totalPageNum);
//   const [searchQuery, setSearchQuery] = useState({
//     page: query.get("page") || 1,
//     orderNum: query.get("orderNum") || "",
//   });
//   const [open, setOpen] = useState(false);
//   const error = useSelector((state) => state.order.error);
//   const tableHeader = [
//     "#",
//     "Order",
//     "Order Date",
//     "User",
//     "Order Item",
//     "Address",
//     "Total Price",
//     "Status",
//   ];

//   useEffect(() => {
//     dispatch(getOrderList({ ...searchQuery }));
//   }, [query]);

//   useEffect(() => {
//     if (searchQuery.orderNum === "") {
//       delete searchQuery.orderNum;
//     }
//     const params = new URLSearchParams(searchQuery);
//     const queryString = params.toString();

//     navigate("?" + queryString);
//   }, [searchQuery]);

//   const openEditForm = (order) => {
//     setOpen(true);
//     dispatch(setSelectedOrder(order));
//   };

//   const handlePageClick = ({ selected }) => {
//     setSearchQuery({ ...searchQuery, page: selected + 1 });
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <div className="locate-center">
//       <Container>
//         <div className="mt-2 display-center mb-2">
//           <SearchBox
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             placeholder="오더번호"
//             field="orderNum"
//           />
//         </div>

//         <OrderTable
//           header={tableHeader}
//           data={orderList}
//           openEditForm={openEditForm}
//         />
//         <ReactPaginate
//           nextLabel="next >"
//           onPageChange={handlePageClick}
//           pageRangeDisplayed={5}
//           pageCount={totalPageNum}
//           forcePage={searchQuery.page - 1}
//           previousLabel="< previous"
//           renderOnZeroPageCount={null}
//           pageClassName="page-item"
//           pageLinkClassName="page-link"
//           previousClassName="page-item"
//           previousLinkClassName="page-link"
//           nextClassName="page-item"
//           nextLinkClassName="page-link"
//           breakLabel="..."
//           breakClassName="page-item"
//           breakLinkClassName="page-link"
//           containerClassName="pagination"
//           activeClassName="active"
//           className="display-center list-style-none"
//         />
//       </Container>

//       {open && <OrderDetailDialog open={open} handleClose={handleClose} />}
//     </div>
//   );
// };

// export default AdminOrderPage;

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap"; // Row, Col, Button 추가
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { useSearchParams, useNavigate } from "react-router-dom";
import OrderDetailDialog from "./component/OrderDetailDialog";
import OrderTable from "./component/OrderTable";
import SearchBox from "../../common/component/SearchBox";
import { getOrderList, setSelectedOrder } from "../../features/order/orderSlice";

const AdminOrderPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useSearchParams();
  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.order.orderList);
  const totalPageNum = useSelector((state) => state.order.totalPageNum);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    orderNum: query.get("orderNum") || "",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getOrderList({ ...searchQuery }));
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams(searchQuery);
    navigate("?" + params.toString());
  }, [searchQuery]);

  const openEditForm = (order) => {
    setOpen(true);
    dispatch(setSelectedOrder(order));
  };

  const handlePageClick = ({ selected }) => {
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  const handleRefresh = () => {
    // 검색 상태 초기화
    setSearchQuery({
      page: 1,
      orderNum: "",
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="locate-center">
      <Container>
        {/* 검색창 및 새로고침 버튼 */}
        <Row className="mt-2 mb-3">
          <Col md={9}>
            <SearchBox 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="오더번호"
              field="orderNum"
            />
          </Col>
          <Col md={3} className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleRefresh}>
              초기화
            </Button>
          </Col>
        </Row>

        {/* 테이블 */}
        <OrderTable
          header={[
            "#",
            "Order",
            "Order Date",
            "User",
            "Order Item",
            "Address",
            "Total Price",
            "Status",
          ]}
          data={orderList}
          openEditForm={openEditForm}
        />

        {/* 페이지네이션 */}
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPageNum}
          forcePage={searchQuery.page - 1}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          className="display-center list-style-none"
        />

        {open && <OrderDetailDialog open={open} handleClose={handleClose} />}
      </Container>
    </div>
  );
};

export default AdminOrderPage;
