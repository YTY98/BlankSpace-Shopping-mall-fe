import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Container, Form, Button, Card } from "react-bootstrap";
import DraftEditor from "./Component/DraftEditor";
import Footer from "../../common/component/Footer";
import { createQnA } from "../../features/qna/qnaSlice";
import "./style/Query.style.css";

const Query = () => {
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const { id: productId } = useParams();
  const user = useSelector((state) => state.user.user); // 유저 정보 가져오기
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [QueryTitle, setQueryTitle] = useState("");
  const [QueryContent, setQueryContent] = useState("");
  const [AnswerTitle] = useState("");
  const [AnswerContent] = useState("");
  const [category, setCategory] = useState("");
  const [isSecret, setIsSecret] = useState(true);
  const [password, setPassword] = useState("");
  const [isAnswered] = useState(false);
  const [isDeleted] = useState(false);

  useEffect(() => {
    // console.log(selectedProduct);
    // console.log("이건 productID", productId);
    if (!selectedProduct || selectedProduct._id !== productId) {
      console.error("Selected Product does not match Product ID");
      alert("상품 정보가 잘못되었습니다.");
    }
  }, [selectedProduct, productId]);

  const handleTitleChange = (e) => {
    setQueryTitle(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSecretChange = (e) => {
    setIsSecret(e.target.checked);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleContentChange = (editorContent) => {
    setQueryContent(editorContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("User is not logged in");
      alert("로그인이 필요합니다.");
      return;
    }

    if (!productId) {
      console.error("Product ID is missing");
      alert("상품 정보가 누락되었습니다.");
      return;
    }

    if (!QueryTitle.trim()) {
      console.error("Title is empty");
      alert("제목을 입력하세요.");
      return;
    }

    if (!QueryContent.trim()) {
      console.error("Content is empty");
      alert("내용을 입력하세요.");
      return;
    }

    if (category === "") {
      console.error("Category is empty");
      alert("문의 분류를 선택해주세요.");
      return;
    }

    const qnaData = {
      user: user._id,
      product: productId,
      category,
      isSecret,
      password: isSecret ? password : undefined, // 비밀번호 필요시만 설정
      QueryTitle,
      QueryContent,
      AnswerTitle,
      AnswerContent,
      isAnswered,
      isDeleted,
    };

    dispatch(createQnA(qnaData))
      .unwrap()
      .then((result) => {
        console.log("Q&A created successfully:", result);
        navigate(`/product/${productId}`);
      })
      .catch((error) => {
        console.error("Failed to create Q&A:", error);
        alert(
          `Q&A 생성 중 오류가 발생했습니다: ${error.message || "Unknown error"}`
        );
      });
  };

  return (
    <div>
      <Container>
        {selectedProduct && selectedProduct._id === productId ? (
          <>
            <div className="product-container">
              <div className="product-img-container">
                <Card.Img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  onError={(e) => {
                    e.target.src = "//img.echosting.cafe24.com/thumb/75x75.gif";
                  }}
                  className="product-img"
                />
              </div>
              <div className="product-content">
                <Card.Body>
                  <Card.Title>{selectedProduct.name}</Card.Title>
                  <Button variant="primary" onClick={() => navigate(-1)}>
                    돌아가기
                  </Button>
                </Card.Body>
              </div>
            </div>

            <Form className="mb-4" onSubmit={handleSubmit}>
              <Form.Group controlId="queryCategory" className="mb-3">
                <Form.Select value={category} onChange={handleCategoryChange}>
                  <option value="">문의 분류</option>
                  <option value="배송 문의">배송 문의</option>
                  <option value="교환 문의">교환 문의</option>
                  <option value="반품 문의">반품 문의</option>
                  <option value="배송전 취소/교환 문의">
                    배송전 취소/교환 문의
                  </option>
                  <option value="기타 문의">기타 문의</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="querySecret" className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="비밀글 설정"
                  checked={isSecret}
                  onChange={handleSecretChange}
                />
              </Form.Group>

              <Form.Group controlId="queryPassword" className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={!isSecret}
                />
              </Form.Group>

              <Form.Group controlId="queryTitle" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="제목을 입력하세요"
                  value={QueryTitle}
                  onChange={handleTitleChange}
                />
              </Form.Group>

              <DraftEditor
                className="mb-3"
                content={QueryContent}
                onChange={handleContentChange}
              />

              <div className="submit-button-container">
                <Button
                  variant="primary"
                  type="submit"
                  className="submit-button"
                >
                  완료
                </Button>
              </div>
            </Form>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default Query;