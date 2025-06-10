import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import "./style/register.style.css";

import { registerUser } from "../../features/user/userSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [policyError, setPolicyError] = useState(false);
  const { registrationError } = useSelector((state) => state.user);

  const register = (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword, policy } = formData;
    const checkConfirmPassword = password === confirmPassword;
    if (!checkConfirmPassword) {
      setPasswordError("비밀번호 중복확인이 일치하지 않습니다.");
      return;
    }
    if (!policy) {
      setPolicyError(true);
      return;
    }
    setPasswordError("");
    setPolicyError(false);
    dispatch(registerUser({ name, email, password, navigate }));
  };

  const handleChange = (event) => {
    event.preventDefault();
    let { id, value, type, checked } = event.target;
    if (id === "confirmPassword" && passwordError) setPasswordError("");
    if (type === "checkbox") {
      if (policyError) setPolicyError(false);
      setFormData((prevState) => ({ ...prevState, [id]: checked }));
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const [allChecked, setAllChecked] = useState(false);
  const [checks, setChecks] = useState({
    terms: false,
    privacy: false,
    sms: false,
    email: false,
  });

  // "모두 동의" 체크박스 핸들러
  const handleAllChecked = (e) => {
    const isChecked = e.target.checked;
    setAllChecked(isChecked);
    setChecks({
      privacyCollection: isChecked,
      privacy: isChecked,
      sms: isChecked,
      email: isChecked,
    });
  };

  // 개별 체크박스 핸들러
  const handleCheckChange = (e) => {
    const { name, checked } = e.target;
    setChecks((prev) => ({
      ...prev,
      [name]: checked,
    }));

    // 모든 체크박스가 선택되었는지 확인
    const allSelected = Object.values({ ...checks, [name]: checked }).every(
        (value) => value === true
    );
    setAllChecked(allSelected);
  };

  return (
    <Container className="register-area">
      {registrationError && (
        <div>
          <Alert variant="danger" className="error-message">
            {registrationError}
          </Alert>
        </div>
      )}
      <Form onSubmit={register}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            placeholder="Enter email"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            id="name"
            placeholder="Enter name"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            isInvalid={passwordError}
          />
          <Form.Control.Feedback type="invalid">
            {passwordError}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
        </Form.Group>
        <div className="agreement-section">
          <h3>서비스 이용 동의</h3>
            <label className="checkbox-label">
              <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={handleAllChecked}
              />
              <strong>이용약관에 모두 동의합니다. (선택 정보 포함)  이용약관 및 개인정보수집 및 이용에 모두 동의합니다.</strong>
            </label>
          <div className="sub-checks">
            <label className="checkbox-label">
              <input
                  type="checkbox"
                  name="privacyCollection"
                  checked={checks.privacyCollection}
                  onChange={handleCheckChange}
              />
              [필수] 개인정보 수집 및 이용에 동의합니다.
            </label>
            <label className="checkbox-label">
              <input
                  type="checkbox"
                  name="privacy"
                  checked={checks.privacy}
                  onChange={handleCheckChange}
              />
              [필수] 이용약관에 동의합니다.
            </label>
            <label className="checkbox-label">
              <input
                  type="checkbox"
                  name="sms"
                  checked={checks.sms}
                  onChange={handleCheckChange}
              />
              [선택] SMS 알림에 동의합니다.
            </label>
            <label className="checkbox-label">
              <input
                  type="checkbox"
                  name="email"
                  checked={checks.email}
                  onChange={handleCheckChange}
              />
              [선택] 이메일 알림에 동의합니다.
            </label>
          </div>
        </div>
        <Button type="submit" className="register-button">
          회원가입
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;
