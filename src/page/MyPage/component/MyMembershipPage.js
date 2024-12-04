import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import { Row, Col, Container, ListGroup } from "react-bootstrap";

import "../style/myMembership.style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceGrinSquint,
  faFaceGrinWide,
  faFaceGrinWink,
  faFaceMehBlank,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import MembershipIcon from "./subComponent/MembershipIcon";

const membershipName = (user) => {
  if (user.membership === "bronze") {
    return (
      <span>
        <MembershipIcon membership={user.membership} />
        <span> 브론즈</span>
      </span>
    );
  } else if (user.membership === "silver") {
    return (
      <span>
        <MembershipIcon membership={user.membership} />
        <span> 실버</span>
      </span>
    );
  } else if (user.membership === "gold") {
    return (
      <span>
        <MembershipIcon membership={user.membership} />
        <span> 골드</span>
      </span>
    );
  } else if (user.membership === "platinum") {
    return (
      <span>
        <MembershipIcon membership={user.membership} />
        <span> 플레티넘</span>
      </span>
    );
  } else if (user.membership === "diamond") {
    return (
      <span>
        <MembershipIcon membership={user.membership} />
        <span> 다이아</span>
      </span>
    );
  }

  return (
    <FontAwesomeIcon
      icon={faFaceMehBlank}
      size="2x"
      style={{ color: "#643521" }}
    />
  );
};

const MyMembershipPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  return (
    <Row style={{ justifyContent: "center" }}>
      {["Light"].map((variant) => (
        <Col xs={12} sm={10} md={8} lg={7} key={variant} className="my-4">
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
                        backgroundColor: "whitesmoke",
                        borderColor: "#e5e5e5",
                        color: "black",
                        fontWeight: "700",
                        fontSize: "15px",
                      }}
                    >
                      <span>
                        저희 쇼핑몰을 이용해 주셔서 감사합니다. {user.name}님은{" "}
                      </span>
                      {membershipName(user)}
                      <span> 회원이십니다.</span>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <FontAwesomeIcon
                            icon={faFaceMehBlank}
                            size="2x"
                            style={{ color: "#643521" }}
                          />
                          <span
                            className="listMembership"
                            style={{ color: "#643521" }}
                          >
                            {" "}
                            Bronze{" "}
                          </span>
                        </Col>
                        <Col>
                          <span
                            className="listMileageCash"
                            style={{ color: "#018BCC" }}
                          >
                            {" "}
                            마일리지 1% 적립
                          </span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <FontAwesomeIcon
                            icon={faFaceSmile}
                            size="2x"
                            style={{ color: "#A0B5BA" }}
                          />
                          <span
                            className="listMembership"
                            style={{ color: "#A0B5BA" }}
                          >
                            {" "}
                            Silver{" "}
                          </span>
                        </Col>
                        <Col>
                          <span
                            className="listMileageCash"
                            style={{ color: "#018BCC" }}
                          >
                            {" "}
                            마일리지 2% 적립
                          </span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <FontAwesomeIcon
                            icon={faFaceGrinWide}
                            size="2x"
                            style={{ color: "#DC9F3E" }}
                          />
                          <span
                            className="listMembership"
                            style={{ color: "#DC9F3E" }}
                          >
                            {" "}
                            Gold{" "}
                          </span>
                        </Col>
                        <Col>
                          <span
                            className="listMileageCash"
                            style={{ color: "#018BCC" }}
                          >
                            {" "}
                            마일리지 3% 적립
                          </span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <FontAwesomeIcon
                            icon={faFaceGrinWink}
                            size="2x"
                            style={{ color: "#37e895" }}
                          />
                          <span
                            className="listMembership"
                            style={{ color: "#35c683" }}
                          >
                            {" "}
                            Platinum{" "}
                          </span>
                        </Col>
                        <Col>
                          <span
                            className="listMileageCash"
                            style={{ color: "#018BCC" }}
                          >
                            {" "}
                            마일리지 4% 적립
                          </span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <FontAwesomeIcon
                            icon={faFaceGrinSquint}
                            size="2x"
                            style={{ color: "#3de5e5" }}
                          />
                          <span
                            className="listMembership"
                            style={{ color: "#37cece" }}
                          >
                            {" "}
                            Diamond{" "}
                          </span>
                        </Col>
                        <Col>
                          <span
                            className="listMileageCash"
                            style={{ color: "#018BCC" }}
                          >
                            {" "}
                            마일리지 5% 적립
                          </span>
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
  );
};

export default MyMembershipPage;
