import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import api from "../../utils/api"; // API 인스턴스 가져오기
import Footer from "../../common/component/Footer"; // Footer 컴포넌트 import
import "./NoticeDetailPage.style.css"; // 스타일 파일 import

const NoticeDetailPage = () => {
  const { id } = useParams(); // URL에서 공지사항 ID 가져오기
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 공지사항 데이터를 가져오는 비동기 함수
    const fetchNoticeDetail = async () => {
      try {
        const response = await api.get(`/notices/${id}`); // api 인스턴스를 사용하여 GET 요청
        setNotice(response.data); // 가져온 데이터를 상태에 저장
      } catch (err) {
        setError("공지사항을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false); // 로딩 상태를 false로 설정
      }
    };

    fetchNoticeDetail();
  }, [id]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <><h1 className="mt-4 text-center" style ={{marginBottom: "40px"}}>{notice.title}</h1>
      <Container className="text-left mb-4">
        {notice && (
          <div className="notice-detail" style = {{marginBottom: "100px"}}>
            <div className="notice-item content">
              <div dangerouslySetInnerHTML={{ __html: notice.content }}></div> {/* HTML 내용 렌더링 */}
            </div>
            <div className="notice-item">
              <strong>게시 일자:</strong>
              <p>{new Date(notice.date).toLocaleDateString()}</p>
            </div>
            <Button variant="primary" onClick={() => navigate(-1)}>
              뒤로가기
            </Button>
          </div>
        )}
      </Container>

      {/* Footer 컴포넌트를 하단에 추가 */}
      <Footer/>
    </>
  );
};

export default NoticeDetailPage;