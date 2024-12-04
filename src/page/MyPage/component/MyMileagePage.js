import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import { Row, Col, Container, ListGroup } from "react-bootstrap";


import "../style/myMileage.style.css";

const MyMileagePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  console.log(user);
  const [totalMileage, setTotalMileage] = useState(); // 총 마일리지
  const [availableMileage, setAvailableMileage] = useState(); // 사용가능 마일리지
  const [usedMileage, setUsedMileage] = useState(); // 사용된 마일리지

  useEffect(() => {
    if (user) {
      setTotalMileage(user.mileage || 0);
      setAvailableMileage(user.mileage - user.usedMileage || 0);
      setUsedMileage(user.usedMileage || 0);
    }
  });

  return (
    <Row style={{justifyContent: "center"}}>
      {["Light"].map((variant) => (
        <Col xs={12} sm={10} md={8} lg={6} key={variant} className="my-4">
        <Card
          bg={variant.toLowerCase()}
          key={variant}
          text={variant.toLowerCase() === "light" ? "dark" : "white"}
          className="MileageBox"
          md={4}
        >
          <Card.Header className="MileageHeader"></Card.Header>
          <Card.Body className="MileageBody">
            <Card.Title />
            <Card.Text>
              <Container>
                {/* <span style={{ fontSize: 13, fontWeight: "500" }}>상태</span> */}
                <ListGroup>
                  <ListGroup.Item
                    active
                    style={{
                      backgroundColor: "#737781",
                      fontWeight: "700",
                      fontSize: "15px",
                    }}
                  >
                    적립금
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <span className="listMileage">총 적립금</span>
                      </Col>
                      <Col>
                        <span className="listMileageCash" style={{color: "#018BCC"}}>
                          {totalMileage}원
                        </span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                    <Col>
                      <span className="listMileage" >사용가능 적립금</span>
                    </Col>
                    <Col>
                      <span className="listMileageCash" style={{ color: "#018BCC"}}>{availableMileage}원</span>
                    </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                    <Col>
                      <span className="listMileage">사용된 적립금</span>
                    </Col>
                    <Col>
                      <span className="listMileageCash">{usedMileage}원</span>
                    </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Container>
              <br />
            </Card.Text>
          </Card.Body>
        </Card>
        </Col>
      ))}
    </Row>
    // <Container>
    //   {["Light"].map((variant) => (
    //     <Card
    //       bg={variant.toLowerCase()}
    //       key={variant}
    //       text={variant.toLowerCase() === "light" ? "dark" : "white"}
    //       className="MileageBox"
    //       md={4}
    //     >
    //       <Card.Header className="MileageHeader"></Card.Header>
    //       <Card.Body className="MileageBody">
    //         <Card.Title />
    //         <Card.Text>
    //           <Container>
    //             {/* <span style={{ fontSize: 13, fontWeight: "500" }}>상태</span> */}
    //             <ListGroup>
    //               <ListGroup.Item
    //                 active
    //                 style={{
    //                   backgroundColor: "#737781",
    //                   fontWeight: "700",
    //                   fontSize: "15px",
    //                 }}
    //               >
    //                 적립금
    //               </ListGroup.Item>
    //               <ListGroup.Item>
    //                 <Row>
    //                   <Col>
    //                     <span className="listMileage">총 적립금</span>
    //                   </Col>
    //                   <Col>
    //                     <span className="listMileageCash" style={{color: "#018BCC"}}>
    //                       {totalMileage}원
    //                     </span>
    //                   </Col>
    //                 </Row>
    //               </ListGroup.Item>
    //               <ListGroup.Item>
    //                 <Row>
    //                 <Col>
    //                   <span className="listMileage" >사용가능 적립금</span>
    //                 </Col>
    //                 <Col>
    //                   <span className="listMileageCash" style={{ color: "#018BCC"}}>{availableMileage}원</span>
    //                 </Col>
    //                 </Row>
    //               </ListGroup.Item>
    //               <ListGroup.Item>
    //                 <Row>
    //                 <Col>
    //                   <span className="listMileage">사용된 적립금</span>
    //                 </Col>
    //                 <Col>
    //                   <span className="listMileageCash">{usedMileage}원</span>
    //                 </Col>
    //                 </Row>
    //               </ListGroup.Item>
    //             </ListGroup>
    //           </Container>
    //           <br />
    //         </Card.Text>
    //       </Card.Body>
    //     </Card>
    //   ))}
    // </Container>
  );
};

export default MyMileagePage;
