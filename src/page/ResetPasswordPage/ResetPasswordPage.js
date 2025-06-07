import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";
import "./style/resetPasswordPage.style.css";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get("token");

    const [formData, setFormData] = useState({
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await api.post("/auth/reset-password", {
                token,
                newPassword: formData.newPassword,
            });
            setMessage(response.data.message);
            setError(null);
            // 3초 후 로그인 페이지로 이동
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || "오류가 발생했습니다.");
            setMessage(null);
        }
    };

    if (!token) {
        return (
            <Container className="reset-password-area">
                <Alert variant="danger">
                    유효하지 않은 접근입니다. 비밀번호 재설정 링크를 다시 요청해주세요.
                </Alert>
                <Button variant="primary" onClick={() => navigate("/find-account")}>
                    아이디/비밀번호 찾기로 이동
                </Button>
            </Container>
        );
    }

    return (
        <Container className="reset-password-area">
            {message && (
                <Alert variant="success" className="mt-3">
                    {message}
                    <br />
                    잠시 후 로그인 페이지로 이동합니다...
                </Alert>
            )}
            {error && (
                <Alert variant="danger" className="mt-3">
                    {error}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>새 비밀번호</Form.Label>
                    <Form.Control
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="새 비밀번호를 입력하세요"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>비밀번호 확인</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="비밀번호를 다시 입력하세요"
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    비밀번호 재설정
                </Button>
            </Form>
        </Container>
    );
};

export default ResetPasswordPage;