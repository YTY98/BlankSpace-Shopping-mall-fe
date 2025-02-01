import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserQnAList, resetState } from "../../../features/qna/qnaSlice";

import { useParams } from "react-router-dom";
import { Container,Row,Col, Alert, Pagination, Spinner } from "react-bootstrap";

import QnAItem from "./subComponent/QnAItem";




const MyQnaPage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user);
  const userId = user._id;
  const { qnaList, loading, totalPageNum, currentPage, error } = useSelector((state) => state.qna);

  useEffect(() => {
    // 상태 초기화
    dispatch(resetState());

    if (userId) {
      dispatch(getUserQnAList({ userId, page: 1, limit: 10 }));
    }
  }, [dispatch, userId]);

  const handlePageChange = (page) => {
    dispatch(getUserQnAList({ userId, page, limit: 10 }));
  };

  console.log(qnaList);


  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2 className="text-center mb-4">내가 쓴 Q&A</h2>
        </Col>
      </Row>
      {loading && (
        <Row>
          <Col className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      )}
      {error && (
        <Row>
          <Col>
            <Alert variant="danger">에러가 발생했습니다: {error}</Alert>
          </Col>
        </Row>
      )}
      {!loading && qnaList.length === 0 && (
        <Row>
          <Col>
            <Alert style={{ backgroundColor: "white", borderColor: "black"}} variant="info">작성한 Q&A가 없습니다.</Alert>
          </Col>
        </Row>
      )}
      <Row className="g-3">
        {qnaList.data.map((qna) => (
          <Col key={qna._id} xs={12} md={6} lg={4}>
            <QnAItem qna={qna} />
          </Col>
        ))}
      </Row>
      {totalPageNum > 1 && (
        <Row>
          <Col className="d-flex justify-content-center mt-4">
            <Pagination>
              {[...Array(totalPageNum).keys()].map((pageNum) => (
                <Pagination.Item
                  key={pageNum + 1}
                  active={pageNum + 1 === currentPage}
                  onClick={() => handlePageChange(pageNum + 1)}
                >
                  {pageNum + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MyQnaPage;
