import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getQnADetail, addAnswer } from "../../features/qna/qnaSlice"; // QnA 상세 정보 가져오는 thunk
import { Spinner, Card, Button, Alert, Modal } from "react-bootstrap"; // 로딩 스피너
import "./AnswerPage.style.css";
import DOMPurify from "dompurify";
import { Editor } from "@toast-ui/react-editor";
import '@toast-ui/editor/dist/toastui-editor.css';
import Footer from "../../common/component/Footer";
function AnswerPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const qna = useSelector((state) => state.qna.qnaDetail);
  const error = useSelector((state) => state.qna.error);
  const user = useSelector((state) => state.user.user);
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const [answerContent, setAnswerContent] = useState(""); // 에디터에서 입력된 답변
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getQnADetail(id));
  }, [dispatch, id]);

  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  // QueryContent HTML 변환 및 보안 취약점 제거
  const cleanHTML = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  // 어드민 확인 함수
  const isAdmin = () => {
    return user && user.level === "admin"; // 유저의 role이 "admin"이면 어드민
  };
  // 에디터 내용 변경 시 호출
  const handleEditorChange = () => {
    const editorInstance = editorRef.current.getInstance();
    setAnswerContent(editorInstance.getHTML()); // 에디터에서 HTML 가져오기
  };

  // 모달 열기 및 닫기 함수
  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  // 답변 제출 함수
  const handleSubmitAnswer = () => {
    dispatch(addAnswer({ id, answerContent }))
      .unwrap()
      .then(() => {
        setShowModal(false); // 모달 닫기
        dispatch(getQnADetail(id));
      });
  };

  // ToastUI 에디터 레퍼런스
  const editorRef = React.createRef();
  return (
    <div>
      <div className="container my-5">
        <Button // 뒤로가기 버튼 구현.
          variant="outline-secondary"
          size="sm"
          active
          className="backButton"
          onClick={() => navigate("/qa")}
        >
          이전페이지
        </Button>

        <div className="product-container">
          <div className="product-img-container">
            {/* 방어적인 코드를 추가하여 qna?.product가 존재하는지 확인 */}
            {qna?.product ? (
              <Card.Img
                src={qna.product.image[0]}
                alt="qnaProduct"
                onError={(e) => {
                  e.target.src = "//img.echosting.cafe24.com/thumb/75x75.gif";
                }}
                className="product-img"
              />
            ) : (
              <Spinner animation="border" role="status" />
            )}
          </div>
          <div className="product-content">
            <Card.Body>
              <Card.Title>{qna?.product?.name}</Card.Title>
              <Button variant="primary" size="sm" onClick={() => navigate(`/product/${qna.product._id}`)}>
                상품페이지
              </Button>
            </Card.Body>
          </div>
        </div>

        {/*************  본격적인 QnA 컴포넌트 구현 ******************/}
        {/* TODO: UI 수정 필. */}
        {/* Query Form */}

        <h3>질문</h3>
        <Card className="mb-4" style={{ background: "#FAF9F8" }}>
          <Card.Body>
            <dl className="row">
              <dt className="col-sm-3">질문 제목</dt>
              <dd className="col-sm-9">{qna?.QueryTitle}</dd>
              <dt className="col-sm-3">카테고리</dt>
              <dd className="col-sm-9">{qna?.category}</dd>
              <dt className="col-sm-3">작성일</dt>
              <dd className="col-sm-9">
                {new Date(qna?.createdAt).toLocaleDateString()}
              </dd>
            </dl>
              <Card style={{ paddingTop: "2rem", backgroundColor: "#FAF9F8"}}>
                <Card.Body
                  className="queryContentBox"
                  dangerouslySetInnerHTML={cleanHTML(qna?.QueryContent)}
                />
              </Card>
          </Card.Body>
        </Card>

        {/* Answer Form */}
        <h3>답변</h3>
        {qna?.isAnswered ? (
          <Card className="mb-4" style={{ background: "#FAF9F8" }}>
            <Card.Body>
            <Card style={{ paddingTop: "2rem", backgroundColor: "#FAF9F8"}}>
              {/* <Card.Header as="h2">{qna?.AnswerTitle}</Card.Header> */}
              <Card.Body
                className="queryContentBox"
                dangerouslySetInnerHTML={cleanHTML(qna?.AnswerContent)} // 답변글 표시
              />
            </Card>
            </Card.Body>
          </Card>
        ) : (
          <div>
            <div className="spinnerStyle">
              <Spinner
                className="AnswerSpinner"
                animation="border"
                role="status"
              />
            </div>
            <Card className="mt-4" style={{backgroundColor: "#FAF9F8"}}>
              <Card.Body style={{ textAlign: "center" }}>
                신속하게 답변을 준비중 입니다. 잠시만 기다려주세요!
              </Card.Body>
            </Card>
          </div>
        )}

        {/* 어드민만 답변 추가 버튼을 볼 수 있게 설정 */}
        {!qna?.isAnswered && isAdmin() && (
          <Button variant="success" className="mt-4" onClick={handleModalOpen}>
            답변 추가
          </Button>
        )}

        {/* 답변 작성 모달 */}
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>답변 작성</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* ToastUI 에디터 */}
            <Editor
              ref={editorRef}
              initialValue=""
              previewStyle="vertical"
              height="400px"
              initialEditType="wysiwyg"
              useCommandShortcut={false}
              onChange={handleEditorChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSubmitAnswer}>
              답변 제출
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Footer className="footer" />
    </div>
  );
}

export default AnswerPage;