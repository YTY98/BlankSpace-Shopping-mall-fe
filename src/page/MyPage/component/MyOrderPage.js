import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import { Row, Col, Container } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import { getOrder, setDateFilter, setStatusFilter } from "../../../features/order/orderSlice";
import OrderStatusCard from "./subComponent/OrderStatusCard";
import "../style/myOrder.style.css";

const MyOrderPage = () => {
  const dispatch = useDispatch();
  const { orderList, dateFilter, statusFilter } = useSelector((state) => state.order);

  // Fetch orders whenever filters change
  useEffect(() => {
    dispatch(getOrder({ dateFilter, statusFilter }));
  }, [dispatch, dateFilter, statusFilter]);

  // Handle date filter change
  const handleDateFilter = (filter) => {
    dispatch(setDateFilter(filter));
  };

  // Handle status filter change
  const handleStatusFilter = (filter) => {
    dispatch(setStatusFilter(filter));
  };

  return (
    <>
      {["Light"].map((variant) => (
        <Card
          bg={variant.toLowerCase()}
          key={variant}
          text={variant.toLowerCase() === "light" ? "dark" : "white"}
          className="orderBox"
        >
          <Card.Header className="orderHeader">
            <Row style={{ cursor: "pointer" }}>
              <Col>주문내역 조회({orderList.length})</Col>
              {/* <Col>취소/교환/반품 내역(0)</Col> */}
            </Row>
          </Card.Header>
          <Card.Body className="orderBody">
            <Card.Title />
            <Card.Text>
              <Container className="orderStateSelectBox">
                <span style={{ fontSize: 13, fontWeight: "500" }}>상태</span>
                <Dropdown>
                  <Dropdown.Toggle
                    id="custom-dropdown-toggle"
                    className="orderDropdown"
                  >
                    {statusFilter === "all" ? "all" : statusFilter}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="orderDropdownMenu">
                    <Dropdown.Item onClick={() => 
                      handleStatusFilter("all")
                      }>
                      all
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => 
                      handleStatusFilter("preparing")}>
                      preparing
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStatusFilter("shipping")}>
                      shipping
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStatusFilter("delivered")}>
                      delivered
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStatusFilter("refund")}>
                      refund
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <br />
                <span style={{ fontSize: 13, fontWeight: "500" }}>기간</span>
                <br />
                <Button
                  variant={dateFilter === "today" ? "primary" : "light"}
                  className="periodButton"
                  onClick={() => handleDateFilter("today")}
                >
                  오늘
                </Button>
                <Button
                  variant={dateFilter === "1month" ? "primary" : "light"}
                  className="periodButton"
                  onClick={() => handleDateFilter("1month")}
                >
                  1개월
                </Button>
                <Button
                  variant={dateFilter === "3months" ? "primary" : "light"}
                  className="periodButton"
                  onClick={() => handleDateFilter("3months")}
                >
                  3개월
                </Button>
                <Button
                  variant={dateFilter === "6months" ? "primary" : "light"}
                  className="periodButton"
                  onClick={() => handleDateFilter("6months")}
                >
                  6개월
                </Button>
                <Button
                  variant={dateFilter === "all" ? "primary" : "light"}
                  className="periodButton"
                  onClick={() => handleDateFilter("all")}
                >
                  전체기간
                </Button>
              </Container>
              <br />
              <br />
              <Container className="status-card-container">
                {orderList.map((item) => (
                  <OrderStatusCard
                    orderItem={item}
                    className="status-card-container"
                    key={item._id}
                  />
                ))}
              </Container>
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

export default MyOrderPage;
