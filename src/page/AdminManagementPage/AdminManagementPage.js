import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  DropdownButton,
  Dropdown,
  Modal,
  Button,
  ProgressBar,
  Navbar,
  Nav,
} from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getProductList } from "../../features/product/productSlice";
import { getOrderList } from "../../features/order/orderSlice";
import { getUserList } from "../../features/user/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faShoppingCart,
  faDollarSign,
  faExclamationTriangle,
  faExchangeAlt,
  faSignOutAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ORDER_STATUS } from "../../constants/order.constants";

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminManagementPage = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.product.productList);
  const orderList = useSelector((state) => state.order.orderList);
  const userList = useSelector((state) => state.user.userList);

  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [monthlySales, setMonthlySales] = useState(Array(12).fill(0));
  const [dailySales, setDailySales] = useState({});
  const [statusCounts, setStatusCounts] = useState(
    ORDER_STATUS.reduce((acc, status) => ({ ...acc, [status]: 0 }), {})
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [displayMode, setDisplayMode] = useState("monthly");
  const [showOutOfStockModal, setShowOutOfStockModal] = useState(false);
  const [isDailyMode, setIsDailyMode] = useState({
    sales: false,
    purchase: false,
  });

  const monthlyGoal = 10000000;
  const currentMonthSales = monthlySales[new Date().getMonth()];

  useEffect(() => {
    dispatch(getProductList());
    dispatch(getUserList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getOrderList({ year: selectedYear, month: selectedMonth }));
  }, [dispatch, selectedYear, selectedMonth]);

  useEffect(() => {
    if (productList.length > 0) {
      const outOfStockItems = productList.filter((item) =>
        Object.values(item.stock).some((qty) => qty === 0)
      );

      const outOfStockProductsWithSizes = outOfStockItems.map((product) => {
        const outOfStockSizes = Object.keys(product.stock).filter(
          (size) => product.stock[size] === 0
        );
        return {
          name: product.name,
          sizes: outOfStockSizes,
        };
      });

      setOutOfStockCount(outOfStockItems.length);
      setOutOfStockProducts(outOfStockProductsWithSizes);
    }
  }, [productList]);

  useEffect(() => {
    if (orderList.length > 0) {
      const sales = orderList.reduce((total, order) => total + order.totalPrice, 0);
      setTotalSales(sales);
      setPurchaseCount(orderList.length);

      const newMonthlySales = Array(12).fill(0);
      const newDailySales = {};
      const newStatusCounts = ORDER_STATUS.reduce((acc, status) => ({ ...acc, [status]: 0 }), {});

      orderList.forEach((order) => {
        const date = new Date(order.createdAt);
        const orderYear = date.getFullYear();
        const orderMonth = date.getMonth();
        const day = date.toISOString().split("T")[0];

        if (orderYear === selectedYear) {
          newMonthlySales[orderMonth] += order.totalPrice;

          if (selectedMonth && orderMonth + 1 === selectedMonth) {
            newDailySales[day] = newDailySales[day]
              ? newDailySales[day] + order.totalPrice
              : order.totalPrice;
          }
        }

        newStatusCounts[order.status] += 1;
      });

      setMonthlySales(newMonthlySales);
      setDailySales(newDailySales);
      setStatusCounts(newStatusCounts);
    }
  }, [orderList, selectedYear, selectedMonth]);

  useEffect(() => {
    setUserCount(userList.length);
  }, [userList]);

  const handleDisplayModeToggle = () => {
    setDisplayMode(displayMode === "monthly" ? "daily" : "monthly");
  };

  const handleYearSelect = (year) => {
    setSelectedYear(parseInt(year));
    setSelectedMonth(null);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(parseInt(month));
  };

  const handleOutOfStockClick = () => {
    setShowOutOfStockModal(true);
  };

  const handleCloseOutOfStockModal = () => {
    setShowOutOfStockModal(false);
  };

  const handleToggleDailyMode = (type) => {
    setIsDailyMode((prevMode) => ({
      ...prevMode,
      [type]: !prevMode[type],
    }));
  };

  const barData = {
    labels:
      displayMode === "monthly"
        ? ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
        : Object.keys(dailySales),
    datasets: [
      {
        label: "매출액",
        data: displayMode === "monthly" ? monthlySales : Object.values(dailySales),
        backgroundColor: "#FF6D28",
      },
    ],
  };

  const pieData = {
    labels: ORDER_STATUS,
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const availableYears = Array.from({ length: 77 }, (_, i) => 2024 + i);
  const availableMonths = Array.from({ length: 12 }, (_, i) => i + 1);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <Container fluid>
      {/* 네비게이션 바 */}
      <Navbar bg="light" variant="light" expand="lg" className="shadow-sm p-3 mb-4">
        <Container fluid>
          <Navbar.Brand href="#home">
           
          </Navbar.Brand>
          <Nav className="ml-auto">
            <FontAwesomeIcon icon={faUserCircle} size="lg" style={{ marginRight: "5px" }} />
            <span style={{ fontWeight: "bold", fontSize: "13px", marginTop: "3px" }}>Admin</span>
            <FontAwesomeIcon icon={faSignOutAlt} size="lg" style={{ marginLeft: "20px",  }} />
          </Nav>
        </Container>
      </Navbar>

      {/* 4개의 카드가 들어갈 섹션 */}
      <Row className="mb-4" style={{ marginTop: "20px", marginLeft: "40px" }}>
        <Col md={6}>
          <div className="p-3 shadow-sm rounded" style={{ backgroundColor: "#f8f9fa" }}>
            <Row>
              <Col md={6}>
                <Card
                  className="text-center"
                  style={{ backgroundColor: "#4CAF50", color: "white", height: "128px" }}
                >
                  <Card.Body>
                    <FontAwesomeIcon icon={faUsers} size="2x" />
                    <Card.Title>회원수</Card.Title>
                    <Card.Text>{userCount}명</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card
                  className="text-center"
                  style={{ backgroundColor: "#FFC107", color: "white" }}
                >
                  <Card.Body style={{ position: "relative" }}>
                    <FontAwesomeIcon
                      icon={faDollarSign}
                      size="2x"
                      style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faExchangeAlt}
                      style={{
                        cursor: "pointer",
                        fontSize: "1.5rem",
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      onClick={() => handleToggleDailyMode("sales")}
                    />
                    <div style={{ marginTop: "40px" }}>
                      <Card.Title>
                        {isDailyMode.sales ? "일 매출" : "총 매출"}
                      </Card.Title>
                      <Card.Text>
                        {isDailyMode.sales
                          ? dailySales[new Date().toISOString().split("T")[0]]?.toLocaleString() ||
                            "0원"
                          : totalSales.toLocaleString() + "원"}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={6}>
                <Card
                  className="text-center"
                  style={{ backgroundColor: "#03A9F4", color: "white" }}
                >
                  <Card.Body style={{ position: "relative" }}>
                    <FontAwesomeIcon
                      icon={faShoppingCart}
                      size="2x"
                      style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faExchangeAlt}
                      style={{
                        cursor: "pointer",
                        fontSize: "1.5rem",
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      onClick={() => handleToggleDailyMode("purchase")}
                    />
                    <div style={{ marginTop: "40px" }}>
                      <Card.Title>
                        {isDailyMode.purchase ? "일 구매 건수" : "총 구매 건수"}
                      </Card.Title>
                      <Card.Text>
                        {isDailyMode.purchase
                          ? orderList.filter(
                              (order) =>
                                new Date(order.createdAt).toISOString().split("T")[0] ===
                                new Date().toISOString().split("T")[0]
                            ).length + "회"
                          : purchaseCount + "회"}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card
                  className="text-center"
                  style={{ backgroundColor: "#F44336", color: "white", height: "128px" }}
                  onClick={handleOutOfStockClick}
                >
                  <Card.Body style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
                    <Card.Title>재고 부족 상품</Card.Title>
                    <Card.Text>{outOfStockCount}개</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Col>

        {/* 월 매출 통계 */}
        <Col md={6}>
          <div className="p-3 shadow-sm rounded" style={{ backgroundColor: "#f8f9fa" }}>
            <Card className="text-center">
              <Card.Body>
                <h5>MONTHLY GOAL</h5>
                <ProgressBar
                  now={(currentMonthSales / monthlyGoal) * 100}
                  label={`${currentMonthSales.toLocaleString()}원 / ${monthlyGoal.toLocaleString()}원`}
                  animated
                />
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* 통계 섹션 */}
      <Row>
        <Col md={6}>
          <div className="p-3 shadow-sm rounded" style={{ backgroundColor: "#f8f9fa", marginTop: 30 }}>
            <h4>주문 상태별 통계</h4>
            <div style={{ height: "450px" }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="p-3 shadow-sm rounded" style={{ backgroundColor: "#f8f9fa", marginTop: 30 }}>
            <div className="d-flex justify-content-between align-items-center">
              <h4>
                {displayMode === "monthly" ? `${selectedYear}년 월별 매출액` : "날짜별 매출액"}
              </h4>
              <div className="d-flex">
                <FontAwesomeIcon
                  icon={faExchangeAlt}
                  size="2x"
                  style={{ cursor: "pointer", marginRight: "10px" }}
                  onClick={handleDisplayModeToggle}
                />
                <DropdownButton
                  id="year-dropdown"
                  title={`${selectedYear}년`}
                  variant="light"
                  onSelect={handleYearSelect}
                >
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {availableYears.map((year) => (
                      <Dropdown.Item key={year} eventKey={year}>
                        {year}년
                      </Dropdown.Item>
                    ))}
                  </div>
                </DropdownButton>
                {displayMode === "daily" && (
                  <DropdownButton
                    id="month-dropdown"
                    title={selectedMonth ? `${selectedMonth}월` : "월 선택"}
                    variant="light"
                    onSelect={handleMonthSelect}
                  >
                    {availableMonths.map((month) => (
                      <Dropdown.Item key={month} eventKey={month}>
                        {month}월
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                )}
              </div>
            </div>
            <div style={{ marginTop: 60 }}>
              <Bar data={barData} />
            </div>
          </div>
        </Col>
      </Row>

      {/* 재고 부족 상품 모달 */}
      <Modal show={showOutOfStockModal} onHide={handleCloseOutOfStockModal}>
        <Modal.Header closeButton>
          <Modal.Title>재고 부족 상품 목록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {outOfStockProducts.length > 0 ? (
            outOfStockProducts.map((product, index) => (
              <div key={index}>
                <strong>{product.name}</strong> - 재고 부족 사이즈: {product.sizes.join(", ")}
              </div>
            ))
          ) : (
            <p>재고 부족 상품이 없습니다.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOutOfStockModal}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminManagementPage;
