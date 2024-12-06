import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import GaugeChart from "react-gauge-chart";
import {
  Container,
  Row,
  Col,
  Card,
  DropdownButton,
  Dropdown,
  Modal,
  Button,
  Table,
  Tabs,
  Tab,
  Badge,
  Image,
  Pagination,
} from "react-bootstrap";
import { Bar } from "react-chartjs-2";
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
import { getAdminOrderList } from "../../features/order/orderSlice";
import { getUserList } from "../../features/user/userSlice";
import { getQnAList } from "../../features/qna/qnaSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faShoppingCart,
  faDollarSign,
  faExclamationTriangle,
  faExchangeAlt,
  faBoxOpen,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ORDER_STATUS, badgeBg } from "../../constants/order.constants";
const QnA_STATUS = ["completed", "preparing"];
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashBoardPage = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.product.productList);
  const orderList = useSelector((state) => state.order.orderList);
  const userList = useSelector((state) => state.user.userList);
  // const qnaList = useSelector((state) => state.qna.qnaList);
  const qnaList = useSelector((state) => state.qna.qnaList) || [];

  const [adminQnAList, setAdminQnAList] = useState([]);
  const [filteredQnAList, setFilteredQnAList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("completed"); // 기본값: "답변 완료"
  const [adminCurrentPage, setAdminCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const adminLimit = 20; // 페이지당 Q&A 개수

  const [userManagementModal, setUserManagementModal] = useState(false);
  const [adminManagementModal, setAdminManagementModal] = useState(false);
  const [userListState, setUserListState] = useState([]);
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
  const [qnaStatusCounts, setQnaStatusCounts] = useState( 
    QnA_STATUS.reduce((acc, status) => ({ ...acc, [status]: 0 }), {})
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [displayMode, setDisplayMode] = useState("monthly");
  const [showOutOfStockModal, setShowOutOfStockModal] = useState(false);
  const [isDailyMode, setIsDailyMode] = useState({
    sales: false,
    purchase: false,
  });
  const [selectedTab, setSelectedTab] = useState("preparing");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [admins, setAdmins] = useState([]);

  const monthlyGoal = 10000000;
  const currentMonthSales = monthlySales[new Date().getMonth()];

  const cardDefaultStyle = {
    backgroundColor: "#f8f9fa",
    cursor: "pointer",
    transition: "transform 0.3s ease-in-out",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // 기본 그림자
  };

  const cardHoverStyle = {
    transform: "scale(1.05)", // 크기 증가
  };

  useEffect(() => {
    dispatch(getProductList());
    dispatch(getAdminOrderList({ all: true }));
    dispatch(getUserList());
    dispatch(getQnAList());
  }, [dispatch]);

  useEffect(() => {
    if (userList.length > 0) {
      setUserListState(userList);
    }
  }, [userList]);

  useEffect(() => {
    dispatch(getAdminOrderList({ year: selectedYear, month: selectedMonth }));
  }, [dispatch, selectedYear, selectedMonth]);

  useEffect(() => {
    const fetchAdminQnAList = async () => {
      const { data, totalPageNum } = await dispatch(
        getQnAList({ page: adminCurrentPage, limit: adminLimit })
      ).unwrap();
      setTotalPages(totalPageNum);
      setAdminQnAList(data);
    };
    fetchAdminQnAList();
  }, [dispatch, adminCurrentPage]);

  // 상태 필터링 함수: 답변 완료 및 미답변 필터링 기능 추가
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    // qnaList가 배열인지 확인 후 필터링 수행
    const filtered = Array.isArray(qnaList)
      ? qnaList.filter((qna) =>
          status === "completed" ? qna.isAnswered : !qna.isAnswered
        )
      : [];
    setAdminQnAList(filtered);
  };

  // useEffect(() => {
  //   if (Array.isArray(qnaList) && qnaList.length > 0) {
  //     setAdminQnAList(qnaList);
  //   }
  // }, [qnaList]);

  useEffect(() => {
    if (!qnaList || !Array.isArray(qnaList.data)) {
      // qnaList가 없거나, data가 배열이 아닌 경우 초기화
      setQnaStatusCounts({ completed: 0, preparing: 0 });
      return;
    }
  
    const completedCount = qnaList.data.filter((qna) => qna.isAnswered).length;
    const preparingCount = qnaList.data.length - completedCount;
  
    setQnaStatusCounts((prevCounts) => {
      if (
        prevCounts.completed !== completedCount ||
        prevCounts.preparing !== preparingCount
      ) {
        return {
          completed: completedCount,
          preparing: preparingCount,
        };
      }
      return prevCounts; // 상태 변경이 없으면 이전 상태 유지
    });
  }, [qnaList]);
  

  useEffect(() => {
    // Q&A 데이터 로드
    const fetchQnAList = async () => {
      const { data } = await dispatch(getQnAList({})).unwrap();
      setFilteredQnAList(data);
    };

    fetchQnAList();
  }, [dispatch]);

  useEffect(() => {
    if (qnaList.length > 0) {
      setAdminQnAList(qnaList);
    }
  }, [qnaList]);

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
      const sales = orderList.reduce(
        (total, order) => total + order.totalPrice,
        0
      );
      setTotalSales(sales);
      setPurchaseCount(orderList.length);
  
      const newMonthlySales = Array(12).fill(0);
      const newDailySales = {};
      const today = new Date().toISOString().split("T")[0]; // 오늘 날짜
      const newStatusCounts = ORDER_STATUS.reduce(
        (acc, status) => ({ ...acc, [status]: 0 }),
        {}
      );
  
      orderList.forEach((order) => {
        const date = new Date(order.createdAt);
        const orderYear = date.getFullYear();
        const orderMonth = date.getMonth();
        const day = date.toISOString().split("T")[0];
  
        if (orderYear === selectedYear) {
          // 월별 매출
          newMonthlySales[orderMonth] += order.totalPrice;
  
          // 날짜별 매출
          newDailySales[day] = (newDailySales[day] || 0) + order.totalPrice;
        }
  
        // 주문 상태별 카운트
        newStatusCounts[order.status] += 1;
      });
  
      // 오늘 날짜를 기본값으로 추가
      if (!newDailySales[today]) {
        newDailySales[today] = 0;
      }
  
      setMonthlySales(newMonthlySales);
      setDailySales(newDailySales);
      setStatusCounts(newStatusCounts);
    }
  }, [orderList, selectedYear]);

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

  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };

  // 사용자 관리 모달 열기
  const handleUserManagementModalOpen = () => {
    setUserManagementModal(true);
  };

  const handleUserManagementModalClose = () => {
    setUserManagementModal(false);
    // setSelectedUser(null);
    // setUpdatedRole("");
  };

  // 사용자 관리 모달 열기
  const handleAdminManagementModalOpen = () => {
    setAdminManagementModal(true);
  };

  const handleAdminManagementModalClose = () => {
    setAdminManagementModal(false);
    // setSelectedUser(null);
    // setUpdatedRole("");
  };

  // 역할 변경을 위한 선택
  const handleRoleSelect = (userId, newRole) => {
    setUserListState((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, level: newRole } : user
      )
    );
  };

  const handleMembershipSelect = (userId, newMembership) => {
    setUserListState((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, membership: newMembership } : user
      )
    );
  };

  const handleRoleUpdate = async (userId) => {
    const userToUpdate = userListState.find((user) => user._id === userId);

    if (!userToUpdate) {
      alert("사용자가 선택되지 않았습니다.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ level: userToUpdate.level }), // 변경할 level 값 전송
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const updatedUser = data.user;

      setUserListState((prev) =>
        prev.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );

      alert("사용자 역할이 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("역할 업데이트 실패:", error.message);
      alert("역할 업데이트 중 오류가 발생했습니다.");
    }
  };

  const handleMembershipUpdate = async (userId) => {
    const userToUpdate = userListState.find((user) => user._id === userId);

    if (!userToUpdate) {
      alert("사용자가 선택되지 않았습니다.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ membership : userToUpdate.membership }), // 변경할 level 값 전송
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const updatedUser = data.user;

      setUserListState((prev) =>
        prev.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );

      alert("사용자 역할이 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("역할 업데이트 실패:", error.message);
      alert("역할 업데이트 중 오류가 발생했습니다.");
    }
  };


  const filteredOrderList = selectedTab
    ? orderList.filter((order) => order.status === selectedTab)
    : orderList; // selectedTab이 null이면 전체 주문 표시

  // const filteredQnAList = qnaList.filter((qna) => !qna.isAnswered);

  const qnaAdminData = useSelector((state) => state.qna.adminData);

  const todayTasks = {
    newOrders: orderList.filter((order) => order.status === "preparing").length,
    refundOrders: orderList.filter((order) => order.status === "refund").length,
    newSignUps: userList.filter(
      (user) =>
        new Date(user.createdAt).toDateString() === new Date().toDateString()
    ).length,
    inquiries: qnaAdminData
      ? qnaAdminData.filter((qna) => !qna.isAnswered).length
      : 0,
  };

  const barDataMonthlySales = {
    labels:
      displayMode === "monthly"
        ? [
            "1월",
            "2월",
            "3월",
            "4월",
            "5월",
            "6월",
            "7월",
            "8월",
            "9월",
            "10월",
            "11월",
            "12월",
          ]
        : Object.keys(dailySales),
    datasets: [
      {
        label: "매출액",
        data:
          displayMode === "monthly" ? monthlySales : Object.values(dailySales),
        backgroundColor: "rgba(75,192,192,0.4)",
      },
    ],
  };

  const barDataUserSignUps = {
    labels: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    datasets: [
      {
        label: `${selectedYear}년 가입자 수`,
        data: userList.reduce((acc, user) => {
          if (user.createdAt) {
            const month = new Date(user.createdAt).getMonth();
            acc[month] += 1;
          }
          return acc;
        }, Array(12).fill(0)),
        backgroundColor: "rgba(75,192,192,0.4)",
      },
    ],
  };

  const availableYears = Array.from({ length: 77 }, (_, i) => 2024 + i);
  const availableMonths = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Container fluid>
      {/* 오늘의 할 일 섹션 */}
      <div
        className="p-3 shadow rounded mb-4"
        style={{
          ...cardDefaultStyle,
          backgroundColor: "#f8f9fa",
          marginTop: "30px",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, cardHoverStyle); // hover 시 크기 증가
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)"; // hover 해제 시 원래 크기로
        }}
      >
        <h4>
          <strong>오늘의 할일</strong>{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>
            {Object.values(todayTasks).reduce((a, b) => a + b, 0)}
          </span>
        </h4>
        <div
          className="d-flex justify-space-between"
          style={{ gap: "80px", marginTop: "20px" }}
        >
          <span>신규 주문 {todayTasks.newOrders}</span>
          <span>환불 주문 {todayTasks.refundOrders}</span>
          <span>신규 가입 {todayTasks.newSignUps}</span>
          <span>문의 {todayTasks.inquiries}</span>
        </div>
      </div>

      {/* 6개의 카드가 들어갈 섹션 */}
      <Row className="mb-4" style={{ marginTop: "40px" }}>
        <Col sm={12} md={6}>
          <div
            className="p-3 shadow rounded"
            style={{
              ...cardDefaultStyle,
              backgroundColor: "#f8f9fa",
              cursor: "pointer",
              height: "570px",
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, cardHoverStyle); // hover 시 크기 증가
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"; // hover 해제 시 원래 크기로
            }}
          >
            <Row>
              <Col md={6}>
                <Card
                  className="text-center"
                  style={{
                    ...cardDefaultStyle,
                    backgroundColor: "#4CAF50",
                    color: "white",
                    height: "128px",
                    marginTop: "30px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, cardHoverStyle); // hover 시 크기 증가
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)"; // hover 해제 시 원래 크기로
                  }}
                >
                  <Card.Body>
                    <FontAwesomeIcon icon={faUsers} size="2x" />
                    <Card.Title>
                      <strong>회원수</strong>
                    </Card.Title>
                    <Card.Text>{userCount}명</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card
                  className="text-center"
                  style={{
                    ...cardDefaultStyle,
                    backgroundColor: "#FFC107",
                    color: "white",
                    marginTop: "30px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, cardHoverStyle); // hover 시 크기 증가
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)"; // hover 해제 시 원래 크기로
                  }}
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
                        <strong>
                          {isDailyMode.sales ? "일 매출" : "총 매출"}
                        </strong>
                      </Card.Title>
                      <Card.Text>
                        {isDailyMode.sales
                          ? dailySales[
                              new Date().toISOString().split("T")[0]
                            ]?.toLocaleString() + "원" || "0원"
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
                  style={{
                    ...cardDefaultStyle,
                    backgroundColor: "#03A9F4",
                    color: "white",
                    cursor: "pointer",
                    marginTop: "20px",
                  }}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, cardHoverStyle); // hover 시 크기 증가
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)"; // hover 해제 시 원래 크기로
                  }}
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
                        <strong>
                          {isDailyMode.purchase
                            ? "일 구매 건수"
                            : "총 구매 건수"}
                        </strong>
                      </Card.Title>
                      <Card.Text>
                        {isDailyMode.purchase
                          ? orderList.filter(
                              (order) =>
                                new Date(order.createdAt)
                                  .toISOString()
                                  .split("T")[0] ===
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
                  style={{
                    ...cardDefaultStyle,
                    backgroundColor: "#F44336",
                    color: "white",
                    height: "128px",
                    cursor: "pointer",
                    marginTop: "20px",
                  }}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, cardHoverStyle); // hover 시 크기 증가
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)"; // hover 해제 시 원래 크기로
                  }}
                  onClick={handleOutOfStockClick}
                >
                  <Card.Body style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
                    <Card.Title>
                      <strong>재고 부족 상품</strong>
                    </Card.Title>
                    <Card.Text>{outOfStockCount}개</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              {/* 첫 번째 카드 추가 */}
              <Col md={6}>
                <Card
                  className="text-center shadow rounded"
                  style={{
                    ...cardDefaultStyle,
                    backgroundColor: "#9C27B0",
                    color: "white",
                    cursor: "pointer",
                    marginTop: "40px",
                  }}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, cardHoverStyle); // hover 시 크기 증가
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)"; // hover 해제 시 원래 크기로
                  }}
                >
                  <Card.Body>
                    <FontAwesomeIcon icon={faQuestionCircle} size="2x" />
                    <Card.Title>
                      <strong>미확인 Q/A</strong>
                    </Card.Title>
                    <Card.Text>{todayTasks.inquiries}개</Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              {/* 두 번째 카드 추가 */}
              <Col md={6}>
                <Card
                  className="text-center shadow rounded"
                  style={{
                    ...cardDefaultStyle,
                    backgroundColor: "#4DB6AC",
                    color: "white",
                    cursor: "pointer",
                    marginTop: "40px",
                  }}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, cardHoverStyle); // hover 시 크기 증가
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)"; // hover 해제 시 원래 크기로
                  }}
                >
                  <Card.Body>
                    <FontAwesomeIcon icon={faBoxOpen} size="2x" />
                    <Card.Title>
                      <strong>반품 요청</strong>
                    </Card.Title>
                    <Card.Text>{todayTasks.refundOrders}개</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Col>

        {/* 월 매출 통계 */}
        <Col xs={12} sm={12} md={6}>
          <div
            className="p-3 shadow rounded"
            style={{
              ...cardDefaultStyle,
              backgroundColor: "#f8f9fa",
              padding: "1.5rem",
              cursor: "pointer",
              height: "570px",
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, cardHoverStyle); // hover 시 크기 증가
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"; // hover 해제 시 원래 크기로
            }}
          >
            <Card className="text-center">
              <Card.Body>
                <h5>
                  <strong>MONTHLY GOAL</strong>
                </h5>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.5rem",
                      color: "#2caeba",
                      marginBottom: "10px",
                    }}
                  >
                    {monthlySales[11].toLocaleString()}원
                  </div>
                  <GaugeChart
                    id="monthly-goal-gauge"
                    nrOfLevels={30}
                    percent={monthlySales[11] / 10000000}
                    arcPadding={0.02}
                    colors={["#2caeba", "#f0f0f0"]}
                    needleColor="#000"
                    textColor="#000"
                    formatTextValue={(value) => `${value.toFixed(0)}%`}
                  />
                  <div style={{ fontSize: "1.5rem", color: "#888" }}>
                    ₩10,000,000
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* 통계 섹션 */}
      <Row>
        <Col md={6}>
          <div
            className="p-3 shadow rounded"
            style={{
              ...cardDefaultStyle,
              backgroundColor: "#f8f9fa",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              marginTop: "20px",
              cursor: "pointer",
              height: "600px",
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, cardHoverStyle); // hover 시 크기 증가
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"; // hover 해제 시 원래 크기로
            }}
          >
            <h4>
              <strong>신규 가입 고객</strong>
            </h4>
            <div style={{ height: "501px" }}>
              <Bar
                data={barDataUserSignUps}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </Col>

        {/* 월별 매출액 */}
        <Col md={6}>
          <div
            className="p-3 shadow rounded"
            style={{
              ...cardDefaultStyle,
              backgroundColor: "#f8f9fa",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              marginTop: "20px",
              cursor: "pointer",
              height: "600px",
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, cardHoverStyle); // hover 시 크기 증가
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"; // hover 해제 시 원래 크기로
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h4>
                <strong>
                  {displayMode === "monthly"
                    ? `${selectedYear}년 월별 매출액`
                    : "날짜별 매출액"}
                </strong>
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
                  <div style={{ overflowY: "auto" }}>
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
            <div style={{ height: "501px" }}>
              <Bar data={barDataMonthlySales} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </Col>
      </Row>

      {/* 주문 상태 테이블 추가 */}
      <Row style={{ marginTop: "30px" }}>
        <Col md={12}>
          <div
            className="p-3 shadow rounded"
            style={{
              ...cardDefaultStyle,
              backgroundColor: "#f8f9fa",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              marginTop: "20px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, cardHoverStyle); // hover 시 크기 증가
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"; // hover 해제 시 원래 크기로
            }}
          >
            <h4>
              <strong>주문 상태</strong>
            </h4>
            <Tabs
              activeKey={selectedTab}
              onSelect={handleTabSelect}
              className="mb-3"
            >
              {ORDER_STATUS.map((status) => (
                <Tab
                  eventKey={status}
                  title={
                    <span>
                      {status === "preparing" && "준비 중"}
                      {status === "shipping" && "배송 중"}
                      {status === "delivered" && "배송 완료"}
                      {status === "refund" && "환불"}
                      {status === "refunded" && "환불 완료"}
                      <Badge bg={badgeBg[status]} style={{ marginLeft: "8px" }}>
                        {statusCounts[status]}
                      </Badge>
                    </span>
                  }
                />
              ))}
            </Tabs>
            <Table
              striped
              bordered
              hover
              className="shadow-sm"
              style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" }}
            >
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>주문일자</th>
                  <th>구매자</th>
                  <th>의류명</th>
                  <th>총 주문액</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrderList.map((order) => (
                  <tr key={order.orderNum}>
                    <td>{order.orderNum}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.userId?.name || ""}</td>
                    <td>
                      {order.items
                        .map((item) => item.productId?.name)
                        .join(", ")}
                    </td>
                    <td>{order.totalPrice.toLocaleString()}원</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      <Row style={{ marginTop: "30px" }}>
        <Col md={12}>
          <div
            className="p-3 shadow rounded"
            style={{
              ...cardDefaultStyle,
              backgroundColor: "#f8f9fa",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              marginTop: "20px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, cardHoverStyle); // hover 시 크기 증가
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"; // hover 해제 시 원래 크기로
            }}
          >
            <h4>
              <strong>Q&A 목록</strong>
            </h4>

            <Tabs
              activeKey={selectedStatus}
              onSelect={handleStatusFilter}
              className="mb-3"
            >
              {QnA_STATUS.map((status) => (
                <Tab
                  eventKey={status}
                  title={
                    <span>
                      {status === "completed" && "답변 완료"}
                      {status === "preparing" && "미답변"}
                      {/* <Badge bg={status === "completed" ? "success" : "warning"} style={{ marginLeft: "8px" }}>
          {Array.isArray(qnaList) 
            ? qnaList.filter((qna) => status === "completed" ? qna.isAnswered : !qna.isAnswered).length
            : 0}
        </Badge> */}
                      <Badge
                        bg={status === "completed" ? "success" : "warning"}
                        style={{ marginLeft: "8px" }}
                      >
                        {qnaStatusCounts[status]} {/* TODO: 이거 고쳐야함. qna 갯수 세기 */}
                      </Badge>
                    </span>
                  }
                />
              ))}
            </Tabs>

            <Table responsive bordered striped hover className="shadow-sm">
              <thead>
                <tr>
                  <th>분류</th>
                  <th>상품</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>작성일</th>
                  <th>답변 상태</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(adminQnAList) && adminQnAList.length > 0 ? (
                  adminQnAList.map((qna) => (
                    <tr key={qna._id}>
                      <td>{qna.category}</td>
                      <td>
                        {qna.product?.image ? (
                          <Image
                            src={qna.product.image[0]}
                            alt="Product"
                            style={{ width: "30px", height: "auto" }}
                          />
                        ) : (
                          <span>이미지 없음</span>
                        )}
                      </td>
                      <td>{qna.QueryTitle}</td>
                      <td>{qna.user?.name || "Unknown"}</td>
                      <td>{new Date(qna.createdAt).toLocaleDateString()}</td>
                      <td>
                        {qna.isAnswered ? (
                          <Badge bg="success">답변 완료</Badge>
                        ) : (
                          <Badge bg="warning">미답변</Badge>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Q&A 데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
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
                <strong>{product.name}</strong> - 재고 부족 사이즈:{" "}
                {product.sizes.join(", ")}
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

      <Row className="mb-4" style={{ marginTop: "60px" }}>
        {/* Admin 권한 관리 카드 */}
        <Col md={6}>
          <Card
            className="d-flex justify-content-between align-item-center shadow rounded"
            style={{
              ...cardDefaultStyle,
              backgroundColor: "#f8f9fa",
              cursor: "pointer",
              marginBottom: "100px",
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, cardHoverStyle); // hover 시 크기 증가
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"; // hover 해제 시 원래 크기로
            }}
            onClick={handleAdminManagementModalOpen}
          >
            <Card.Body>
              <Card.Title>
                <h4>
                  <strong>Admin 권한 관리</strong>
                </h4>
              </Card.Title>
              <Card.Text>Total: {userListState.length}명</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* 사용자 권한 관리 카드 */}
        <Col md={6}>
          <Card
            className="d-flex justify-content-between align-item-center shadow rounded"
            style={{
              ...cardDefaultStyle,
              backgroundColor: "#f8f9fa",
              cursor: "pointer",
              marginBottom: "100px",
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, cardHoverStyle); // hover 시 크기 증가
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"; // hover 해제 시 원래 크기로
            }}
            onClick={handleUserManagementModalOpen}
          >
            <Card.Body>
              <Card.Title>
                <h4>
                  <strong>User 권한 관리</strong>
                </h4>
              </Card.Title>
              <Card.Text>Total: {userListState.length}명</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Admin 관리 모달 */}
      <Modal
        show={adminManagementModal}
        onHide={handleAdminManagementModalClose}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Admin 권한 관리</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>이메일</th>
                <th>역할</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {userListState.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.level}
                      onChange={(e) =>
                        handleRoleSelect(user._id, e.target.value)
                      } // 드롭다운 변경 시 상태 갱신
                    >
                      <option value="admin">Admin</option>
                      <option value="customer">Customer</option>
                    </select>
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleRoleUpdate(user._id)} // 해당 사용자 업데이트
                    >
                      확인
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAdminManagementModalClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 멤버십 관리 모달 */}
      <Modal
        show={userManagementModal}
        onHide={handleUserManagementModalClose}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>User 멤버십 권한 관리</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>이메일</th>
                <th>역할</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {userListState.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.membership}
                      onChange={(e) =>
                        handleMembershipSelect(user._id, e.target.value)
                      } // 드롭다운 변경 시 상태 갱신
                    >
                      <option value="bronze">Bronze</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="platinum">Platinum</option>
                      <option value="diamond">Diamond</option>
                    </select>
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleMembershipUpdate(user._id)} // 해당 사용자 업데이트
                    >
                      확인
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUserManagementModalClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashBoardPage;
