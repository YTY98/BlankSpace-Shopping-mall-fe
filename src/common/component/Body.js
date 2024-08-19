import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Body = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{ textAlign: "center", marginBottom: "100px", marginTop: "100px" }}
    >
      <div>
        <h1>Elevate Your Style with Minimalism</h1>
      </div>
      <div style={{ marginBottom: "40px", marginTop: "30px" }}>
        <h5>
          Discover difference in the minimalism. Our curated minimalist designs
          transform your style into something simple yet sophisticated.
        </h5>
      </div>
      <div>
        <button
          className="btn btn-dark"
          style={{ borderRadius: "8px", marginBottom: "30px" }}
          onClick={() => navigate("/collection")}
        >
          Shop the Collection
        </button>
      </div>

      <Row
        style={{
          marginTop: "80px",
          marginBottom: "100px",
          marginLeft: "10px",
          marginRight: "10px",
        }}
        className="justify-content-center"
      >
        <Col xs={12} md={6} lg={4} style={{ marginBottom: "80px" }}>
          <Card style={{ width: "100%", height: "450px" }}>
            <Card.Img
              variant="top"
              src="./image/Essential.jpg"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Card.Body>
              <Card.Title>ESSENTIALS</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4} style={{ marginBottom: "80px" }}>
          <Card style={{ width: "100%", height: "450px" }}>
            <Card.Img
              variant="top"
              src="./image/TIMELESS.jpg"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Card.Body>
              <Card.Title>TIMELESS IN STYLE</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4} style={{ marginBottom: "40px" }}>
          {" "}
          {/* 상하 간격을 40px로 설정 */}
          <Card style={{ width: "100%", height: "450px" }}>
            <Card.Img
              variant="top"
              src="./image/SIMPLICITY.jpg"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Card.Body>
              <Card.Title>SIMPLICITY IN STYLE</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Body;
