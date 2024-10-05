import { Container, Table, Image, Pagination } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getQnAList } from "../features/qna/qnaSlice";
import { getProductDetail } from "../features/product/productSlice";
import PasswordPromptModal from "../common/component/QnAauth";
import Footer from "../common/component/Footer";
import "../App.css";

const Qna = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [productImages, setProductImages] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 상태
  const [limit] = useState(10); // 페이지 당 항목 수
  const qnaList = useSelector((state) => state.qna.qnaList);
  const qnaError = useSelector((state) => state.qna.error);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedQnA, setSelectedQnA] = useState(null);

  useEffect(() => {
    const fetchQnAList = async () => {
      try {
        const { data, totalPageNum } = await dispatch(
          getQnAList({ page: currentPage, limit })
        )
          .unwrap()
          .catch((error) => {
            console.error("dispatch 에러 확인: ", error);
          });

        const productIds = [
          ...new Set(data?.data?.map((qna) => qna.product._id)),
        ];
        const productPromises = productIds.map((id) =>
          dispatch(getProductDetail(id)).unwrap()
        );
        const products = await Promise.all(productPromises);

        const images = {};
        products.forEach((product) => {
          images[product._id] = product.image;
        });

        setProductImages(images);

        // console.log("Total Pages from server: ", totalPageNum);
        setTotalPages(totalPageNum); // 전체 페이지 수 설정
        // console.log("total result: ", totalPages);
      } catch (error) {
        console.error("Failed to fetch QnA list", error);
      }
    };

    fetchQnAList();
  }, [dispatch, currentPage, limit, totalPages]);

  if (qnaError) return <div>Error: {qnaError}</div>;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // 페이지 번호를 업데이트하고 useEffect에서 다시 데이터 요청
  };

  const handleOpenModal = (qna) => {
    setSelectedQnA(qna);
    setShowPasswordModal(true);
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setSelectedQnA(null);
  };

  const handlePasswordSubmit = (password) => { // 저장된 비밀번호 출력
    if (password === selectedQnA.password) {
      navigate(`/qa/${selectedQnA._id}`);
      handleCloseModal();
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div>
      <Container className="qnaBox">
        <h1 className="text-center mb-4">QnA</h1>
        <Table responsive style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "6%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "7%" }} />
            <col style={{ width: "40%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "7%" }} />
          </colgroup>
          <thead>
            <tr className="qnaTableHead">
              <th>분류</th>
              <th>{/* 자물쇠 */}</th>
              <th>상품</th>
              <th>제목</th>
              <th>이름</th>
              <th>날짜</th>
              <th>답변상태</th>
            </tr>
          </thead>
          <tbody>
          {qnaList?.data?.map((qna) => (
              <QnaRow 
                key={qna._id} 
                qna={qna} 
                productImages={productImages}
                handleOpenModal={handleOpenModal} // 여기에서 handleOpenModal 전달
              />
            ))}
          </tbody>
        </Table>

        {/* 페이지네이션 컴포넌트 */}
        {/* TODO: Answer에서 이전페이지 
        누르면 이전 페이지네이션으로 돌아가게 수정 필. + 그냥 페이지네이션 수정해야함. */}

        <Pagination className="qnaPagination justify-content-center">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Pagination>
      </Container>
      <PasswordPromptModal
        show={showPasswordModal}
        handleClose={handleCloseModal}
        handleSubmit={handlePasswordSubmit}
      />
      <Footer />
    </div>
  );
};

const QnaRow = ({ qna, handleOpenModal }) => {
  // console.log("Qna Row Data: ", qna);
  // api 데이터의 송수신을 확인하려면 위에 주석풀고 확인 ㄱㄱ
  const qnalock = "image/qna/qnalock.png";
  const answeredImg = "image/qna/greenCheck.png";
  const noAnswerdImg = "image/qna/grey-checkmark.png";
  const navigate = useNavigate();
  const navigateToProduct = () => {
    navigate(`/product/${qna.product._id}`);
  };

  return (
    <tr>
      <td>{qna.category}</td>
      <td>
        {qna.isSecret ? (
          <img
            src={qnalock}
            alt={`qnalock`}
            style={{ width: "20px", height: "auto" }}
          />
        ) : (
          "🔓"
        )}
      </td>
      <td>
        {qna.product && qna.product.image ? ( // qna.product와 qna.product.image가 있는지 확인
          <Image
            src={qna.product.image} // product.image가 있으면 사용
            alt="Product"
            style={{ width: "30px", height: "auto" }}
          />
        ) : (
          <span>No Image</span>
        )}
      </td>
      {/*console.log(qna)*/}
      <td className="qnaTITLE">
        <span onClick={navigateToProduct} className="qnaProductName">
          [{qna.product ? qna.product.name : "no name"}]
        </span>{" "}
        <span onClick={() => handleOpenModal(qna)}>{qna.QueryTitle}</span>
      </td>
      <td>{qna.user?.name}</td>
      <td>{new Date(qna.createdAt).toLocaleDateString()}</td>
      <td>
        {qna.isAnswered ? (
          <img
            src={answeredImg}
            alt={`is answered qna`}
            className="qnaCheckMarkImage"
          />
        ) : (
          <img
            src={noAnswerdImg}
            alt={`is no answered Img`}
            className="qnaCheckMarkImage"
          />
        )}
      </td>
    </tr>
  );
};

export default Qna;