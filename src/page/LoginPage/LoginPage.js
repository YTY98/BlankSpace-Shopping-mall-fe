import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
// import { GoogleOAuthProvider } from "@react-oauth/google";
import "./style/login.style.css";
import { loginWithEmail, loginWithGoogle } from "../../features/user/userSlice";
import { clearErrors } from "../../features/user/userSlice";
import { loginWithToken } from "../../features/user/userSlice";
import {setAuthToken} from "../../utils/api";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loginError } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const SOCIAL_LOGIN_URLS = {
    naver: "http://localhost:5000/auth/naver",
    kakao: "http://localhost:5000/auth/kakao",
    google: "http://localhost:5000/auth/google/",
  };

  // useEffect(() => {
  //   if (loginError) {
  //     dispatch(clearErrors());
  //   }
  // }, [navigate]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const error = query.get("error");

    if (error) {
      console.error("소셜 로그인 에러:", error);
      window.history.replaceState({}, document.title, "/login");
      return;
    }

    if (token) {
      try {
        // 토큰을 localStorage에 저장
        localStorage.setItem("token", token);
        // API 헤더에 토큰 설정
        setAuthToken(token);
        // URL에서 토큰 파라미터 제거
        window.history.replaceState({}, document.title, "/login");

        // loginWithToken 액션 크리에이터 사용
        dispatch(loginWithToken())
            .unwrap()
            .then((response) => {
              if (response && response.user) {
                // 사용자 정보가 있으면 메인 페이지로 이동
                navigate("/", { replace: true });
              } else {
                throw new Error("사용자 정보를 가져오는데 실패했습니다.");
              }
            })
            .catch((error) => {
              console.error("소셜 로그인 실패:", error);
              localStorage.removeItem("token");
              setAuthToken("");
              dispatch(clearErrors());
            });
      } catch (error) {
        console.error("토큰 처리 중 에러 발생:", error);
        localStorage.removeItem("token");
        setAuthToken("");
      }
    }
  }, [location.search, dispatch, navigate]);

  // 컴포넌트 마운트 시 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      try {
        setAuthToken(token);
        dispatch(loginWithToken())
            .unwrap()
            .then((response) => {
              if (!response || !response.user) {
                throw new Error("사용자 정보를 가져오는데 실패했습니다.");
              }
            })
            .catch((error) => {
              console.error("토큰으로 로그인 실패:", error);
              localStorage.removeItem("token");
              setAuthToken("");
            });
      } catch (error) {
        console.error("토큰 처리 중 에러 발생:", error);
        localStorage.removeItem("token");
        setAuthToken("");
      }
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (loginError) {
      dispatch(clearErrors());
    }
  }, [loginError, dispatch]);

  const handleLoginWithEmail = (event) => {
    event.preventDefault();
    dispatch(loginWithEmail({ email, password }));
  };

  const handleGoogleLogin = async (googleData) => {
    //구글 로그인 하기
    dispatch(loginWithGoogle(googleData.credential));
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 페이지로 리다이렉트
    window.location.href = SOCIAL_LOGIN_URLS.kakao;
  };

  const handleNaverLogin = () => {
    window.location.href = SOCIAL_LOGIN_URLS.naver;
  }

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
      <>
        <Container className="login-area">
          {loginError && (
              <div className="error-message">
                <Alert variant="danger">{loginError}</Alert>
              </div>
          )}
          <Form className="login-form" onSubmit={handleLoginWithEmail}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                  type="email"
                  placeholder="Enter email"
                  required
                  onChange={(event) => setEmail(event.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                  type="password"
                  placeholder="Password"
                  required
                  onChange={(event) => setPassword(event.target.value)}
              />
            </Form.Group>
            <div className="display-space-between login-button-area">
              <Button className="login-button" type="submit">
                Login
              </Button>
            </div>
            <div className="account-links-area">

              <Link className="account-links" to="/find-account">아이디 | 비밀번호 찾기 | </Link>
              <Link className="account-links" to="/register"> 회원가입</Link>{" "}
            </div>
          </Form>

          <div className="social-login-list">
            <button
                className="btnSns naver-login"
                onClick={handleNaverLogin}
                type="button"
            >
              <span className="sns-icon">
                <img src="/naver_logo.png" alt="네이버 로고" width="24" height="24" />
              </span>
              <span className="divider" />
              <span className="text-label">네이버로 로그인</span>
            </button>

            <button
                className="btnSns kakao-login"
                onClick={handleKakaoLogin}
                type="button"
            >
              <span className="sns-icon">
                <img src="/kakao_logo.png" alt="네이버 로고" width="24" height="24" />
              </span>
              <span className="divider" />
              <span className="text-label">카카오로 로그인</span>
            </button>

            {/* <button
              className="btnSns google-login"
              onClick={() => window.location.href = SOCIAL_LOGIN_URLS.google}
              type="button"
            >
              <span className="sns-icon">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill="#4285F4"/>
                  <text x="6" y="18" fill="white" fontSize="14" fontWeight="bold">G</text>
                </svg>
              </span>
              <span className="divider" />
              <span className="text-label">구글로 로그인</span>
            </button> */}
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <div className="google-login-wrapper">
                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => console.log("Google Login Failed")}
                    theme="outline"
                    size="large"
                    text="signin_with"
                    locale="ko"
                />
              </div>
            </GoogleOAuthProvider>
          </div>
        </Container>
      </>
  );
};

export default Login;
