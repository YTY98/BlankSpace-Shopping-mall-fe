import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotices, searchNotices } from "../../features/notice/noticeSlice";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import Cbutton from "../../common/component/Cbutton";
import Footer from "../../common/component/Footer";
import "./NoticePage.style.css"; // 스타일 CSS 파일 import

const NoticePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for search functionality
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [searchMode, setSearchMode] = useState(false); // 검색 모드 여부

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 10; // 페이지당 공지사항 수

  // Redux state
  const { notices, totalPageNum } = useSelector((state) => state.notice);

  // 공지사항 목록을 가져옴 (검색 모드 여부에 따라 다르게 동작)
  useEffect(() => {
    if (searchMode) {
      dispatch(
        searchNotices({
          page: currentPage,
          searchType,
          keyword: searchText,
          limit: noticesPerPage,
        })
      );
    } else {
      dispatch(
        fetchNotices({
          page: currentPage,
          searchType: "",
          keyword: "",
          limit: noticesPerPage,
        })
      );
    }
  }, [dispatch, currentPage, searchMode, searchText, searchType, noticesPerPage]);

  // 검색 시 실행
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 검색 시 페이지를 1로 설정
    setSearchMode(true); // 검색 모드 활성화
  };

  // 검색어와 검색 옵션 변경 핸들러
  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleOptionChange = (e) => {
    setSearchType(e.target.value);
  };

  const handlePageClick = ({ selected }) => {
    const newPage = selected + 1; // ReactPaginate는 0부터 시작
    console.log("New Page:", newPage); // 확인용 콘솔
    setCurrentPage(newPage);
  
    if (searchMode) {
      dispatch(
        searchNotices({
          page: newPage,
          searchType,
          keyword: searchText,
          limit: noticesPerPage,
        })
      );
    } else {
      dispatch(
        fetchNotices({
          page: newPage,
          searchType: "",
          keyword: "",
          limit: noticesPerPage,
        })
      );
    }
  };
  
  return (
    <>
      <Container className="mt-4" style= {{marginBottom:"100px"}}>
        <h1 className="text-center mb-4">Notice</h1>
        <Form method="get" onSubmit={handleSearchSubmit} className="mb-4">
          <Row className="align-items-center">
            <Col xs={3}>
              <Form.Select value={searchType} onChange={handleOptionChange}>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="title+content">제목+내용</option>
              </Form.Select>
            </Col>
            <Col xs={8}>
              <Form.Control
                type="text"
                name="searchText"
                onChange={handleChange}
                value={searchText}
                placeholder="검색어를 입력하세요"
              />
            </Col>
            <Col xs={1} className="text-center">
              <Cbutton type="submit">검색</Cbutton>
            </Col>
          </Row>
        </Form>

        <Table responsive>
          <colgroup>
            <col style={{ width: "6%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "7%" }} />
          </colgroup>
          <thead>
            <tr className="notice-table-head">
              <th>번호</th> {/* 번호 열 추가 */}
              <th>제목</th>
              <th className="notice-date-column">게시 일자</th>
            </tr>
          </thead>
          <tbody>
  {notices.length > 0 ? (
    notices
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // 날짜를 기준으로 역순 정렬
      .map((notice, index) => (
        <tr key={notice._id}>
          <td className="notice-number-column">{(currentPage - 1) * noticesPerPage + index + 1}</td>
          <td className="notice-title-column text-start">
            <span
              className="hover-pointer"
              onClick={() => navigate(`/notice/${notice._id}`)}
            >
              {notice.title}
            </span>
          </td>
          <td className="notice-date-column">
            {new Date(notice.date).toLocaleDateString()}
          </td>
        </tr>
      ))
  ) : (
    <tr>
      <td colSpan="3" className="text-center">
        검색 결과가 없습니다.
      </td>
    </tr>
  )}
</tbody>

        </Table>

        {/* 페이지네이션 UI */}
        <ReactPaginate
  previousLabel={"<"}
  nextLabel={">"}
  breakLabel={"..."}
  pageCount={totalPageNum || 0}
  marginPagesDisplayed={2}
  pageRangeDisplayed={5}
  onPageChange={handlePageClick}
  containerClassName={"pagination justify-content-center"}
  pageClassName={"page-item"}
  pageLinkClassName={"page-link"}
  previousClassName={"page-item"}
  previousLinkClassName={"page-link"}
  nextClassName={"page-item"}
  nextLinkClassName={"page-link"}
  breakClassName={"page-item"}
  breakLinkClassName={"page-link"}
  activeClassName={"active"}
  forcePage={currentPage - 1}
/>

      </Container>
      
      <Footer />
    </>
  );
};

export default NoticePage;
