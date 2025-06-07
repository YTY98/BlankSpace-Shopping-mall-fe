import React, { useState } from "react";
import { Container, Form, Button, Alert, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./style/findAccount.style.css";

const FindAccountPage = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState("id");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFindId = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/find-email", { name: formData.name });
      setMessage(response.data.message);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "오류가 발생했습니다.");
      setMessage(null);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // 비밀번호 유효성 검사
    if (formData.newPassword.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await api.post("/auth/reset-password", {
        email: formData.email,
        newPassword: formData.newPassword,
      });
      setMessage(response.data.message);
      setError(null);
      // 비밀번호 변경 성공 시 입력 필드 초기화
      setFormData(prev => ({
        ...prev,
        email: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setError(err.response?.data?.error || "오류가 발생했습니다.");
      setMessage(null);
    }
  };

  return (
    <Container className="find-account-area">
      {message && (
        <Alert variant="success" className="mb-3 white-space-pre-line">
          {message}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      <Tabs
        id="find-account-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-2"
      >
        <Tab eventKey="id" title="아이디 찾기">
          <Form onSubmit={handleFindId}>
            <Form.Group className="mb-3">
              <Form.Label>이름</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="가입 시 등록한 이름을 입력하세요"
                required
              />
              <Form.Text className="text-muted">
                회원가입 시 등록한 이름을 입력하시면 해당 이름으로 등록된 이메일 주소를 알려드립니다.
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" style={{ color: 'white' }}>
              아이디 찾기
            </Button>
          </Form>
        </Tab>

        <Tab eventKey="password" title="비밀번호 찾기">
          <Form onSubmit={handleResetPassword}>
            <Form.Group className="mb-3">
              <Form.Label>이메일</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="가입 시 등록한 이메일을 입력하세요"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>새 비밀번호</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="새로운 비밀번호를 입력하세요"
                required
                minLength={6}
              />
              <Form.Text className="text-muted">
                비밀번호는 최소 6자 이상이어야 합니다.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>비밀번호 확인</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="새로운 비밀번호를 다시 입력하세요"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" style={{ color: 'white' }}>
              비밀번호 변경하기
            </Button>
          </Form>
        </Tab>
      </Tabs>

      <div className="text-center mt-3">
        <Button variant="link" onClick={() => navigate("/login")}>
          로그인 페이지로 돌아가기
        </Button>
      </div>
    </Container>
  );
};

export default FindAccountPage; 