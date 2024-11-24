import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Row, Col, Container, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Card, Form, ListGroup, Button } from "react-bootstrap";
import { fetchUserInfo, deleteUser, updateUserInfo } from "../../../features/user/userSlice";

import "../style/myProfile.style.css";

const MyProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState(""); // 이메일 (수정 불가, 초기값만 설정)
  const [name, setName] = useState(""); // 이름
  const [currentPassword, setCurrentPassword] = useState(""); // 현재 비밀번호
  const [newPassword, setNewPassword] = useState(""); // 새 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); // 새 비밀번호 확인


  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);


  useEffect(() => {
    dispatch(fetchUserInfo()); // 사용자 정보 가져오기
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setName(user.name || "");
    }
  }, [user]);


  {/** 로딩,에러 모달창 state */}
  useEffect(() => {
    if (loading) {
      setShowLoadingModal(true);
    } else {
      setShowLoadingModal(false);
    }

    if (error) {
      setShowErrorModal(true);
    } else {
      setShowErrorModal(false);
    }
  }, [loading, error]);




  {/** 회원탈퇴 버튼 컴포넌트의 delete 기능 구현 */}
  const handleDeleteUser = () => {
    if (!currentPassword) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }
  
    if (window.confirm("정말로 회원탈퇴를 진행하시겠습니까?")) {
      dispatch(deleteUser({ currentPassword }))
        .unwrap()
        .then(() => {
          alert("회원탈퇴가 완료되었습니다.");
          navigate("/"); // 메인 페이지로 이동
        })
        .catch((err) => {
          alert(err.error || "비밀번호가 틀립니다.");
        });
    }
  };

  {/** 회원정보수정 버튼 컴포넌트의 update 기능 구현 */}
  const handleUpdateUserInfo = () => {
    if (!currentPassword) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
  
    dispatch(updateUserInfo({ name, newPassword, currentPassword }))
      .unwrap()
      .then(() => {
        alert("회원정보가 성공적으로 수정되었습니다.");
        dispatch(fetchUserInfo()); // 업데이트된 정보 다시 로드
      })
      .catch((err) => {
        alert(err.error || "회원정보 수정에 실패했습니다.");
      });
  };



  return (
    <>
    {/* 로딩 모달 */}
    <Modal show={showLoadingModal} centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">로딩 중...</p>
        </Modal.Body>
      </Modal>

      {/* 에러 모달 */}
      <Modal show={showErrorModal} centered onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>에러 발생</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
      <Card className="profileCard">
        <Card.Header className="profileCardHeader">
          <Row>
            <Col>
              <span>기본 정보</span>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <span style={{ color: "blue" }}>* </span>
              <span>필수</span>
            </Col>
          </Row>
        </Card.Header>
         {/** 회원정보 칸 */}
        <ListGroup variant="flush" className="profileListGroup">

          {/** 이메일 */}
          <ListGroup.Item className="listItemStyle">
            <Form.Group
              as={Row}
              className="mb-2"
              controlId="formHorizontaluserId"
            >
              <Form.Label column sm={3} className="listText">
                <span>이메일</span>
                <span style={{ color: "blue" }}> </span>
              </Form.Label>
              <Col sm={8}>
                <Form.Control disabled type="text" value={email || ""} />
              </Col>
            </Form.Group>
          </ListGroup.Item>

          {/** 현재 비밀번호 */}
          <ListGroup.Item className="listItemStyle">
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm={3} className="listText">
                <span>현재 비밀번호</span>
                <span style={{ color: "blue" }}>* </span>
              </Form.Label>
              <Col sm={8}>
                <Form.Control 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)} // 상태 업데이트
                  placeholder="현재 비밀번호를 입력하세요" />
              </Col>
            </Form.Group>
          </ListGroup.Item>

          {/** 새 비밀번호 */}
          <ListGroup.Item className="listItemStyle">
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formHorizontaluserId"
            >
              <Form.Label column sm={3} className="listText">
                <span>새 비밀번호</span>
                {/* <span style={{ color: "blue" }}>* </span> */}
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} 
                />
              </Col>
            </Form.Group>
          </ListGroup.Item>
          <ListGroup.Item className="listItemStyle">
            {/** 새 비밀번호 확인 */}
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formHorizontaluserId"
            >
              <Form.Label column sm={3} className="listText">
                <span>새 비밀번호 확인</span>
                {/* <span style={{ color: "blue" }}>* </span> */}
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Col>
            </Form.Group>
          </ListGroup.Item>
          <ListGroup.Item className="listItemStyle">
            {/** 이름 */}
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formHorizontaluserId"
            >
              <Form.Label column sm={3} className="listText">
                <span>이름</span>
                {/* <span style={{ color: "blue" }}>* </span> */}
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                type="text"
                value={name || ""}
                onChange={(e) => setName(e.target.value)}
                />
              </Col>
            </Form.Group>
          </ListGroup.Item>
        </ListGroup>
      </Card>
      <Card.Footer
        className="profileCardFooter"
        style={{
          border: "0px",
        }}
      >
        <Row className="justify-content-center">
          <Col xs="auto" className="d-flex justify-content-center">
            <Button 
              variant="secondary"
              className="me-2 profile-btn periodButton"
              onClick={handleUpdateUserInfo}
            >
              회원정보수정
            </Button>
            <Button 
              variant="primary" 
              className="me-2 profile-btn periodButton"
              onClick={handleDeleteUser}
            >
              회원탈퇴
            </Button>
            <Button 
              variant="primary" 
              className="profile-btn periodButton"
              onClick={() => navigate(`/mypage`)}
              >
              취소
            </Button>
          </Col>
        </Row>
      </Card.Footer>
    </>
  );
};

export default MyProfilePage;
