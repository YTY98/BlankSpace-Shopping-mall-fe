import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const QnAItem = ({ qna }) => {
    const navigate = useNavigate(); // useNavigate 훅 사용


  const handleViewDetails = () => {
    // 상세보기 로직 추가 (예: 모달 표시 또는 상세 페이지 이동)
    navigate(`/qa/${qna._id}`); // Q&A 글 상세 페이지로 이동
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>제목: {qna.QueryTitle}</Card.Title>
        <Card.Text>
        </Card.Text>
        <Card.Text>
          <strong>답변 여부:</strong> {qna.isAnswered ?
            <span style={{ color: "green" }}>답변 완료</span>
            : 
            <span style={{ color: "red" }}>미답변</span>}
        </Card.Text>
        <strong style={{ marginBottom: "10px"}}>작성 날짜: {new Date(qna.createdAt).toLocaleDateString()}</strong>
        <Row>
            <Col>
            <Button variant="primary" onClick={handleViewDetails}>
                상세보기
            </Button>
            </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default QnAItem;
