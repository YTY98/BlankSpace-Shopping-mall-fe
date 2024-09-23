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

  // 기본 공지사항 목록을 가져옴 (검색모드가 아닐 때)
  useEffect(() => {
    if (!searchMode) {
      dispatch(
        fetchNotices({
          page: currentPage,
          searchType: "",
          keyword: "",
          limit: noticesPerPage,
        })
      );
    }
  }, [dispatch, currentPage, searchMode]);

  // 검색 시 실행
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 검색 시 페이지를 1로 설정
    setSearchMode(true); // 검색 모드 활성화
    dispatch(
      searchNotices({
        page: 1,
        searchType,
        keyword: searchText,
        limit: noticesPerPage,
      })
    );
  };

  // 검색어와 검색 옵션 변경 핸들러
  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleOptionChange = (e) => {
    setSearchType(e.target.value);
  };

  // 페이지 클릭 시 실행
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
    if (searchMode) {
      dispatch(
        fetchNotices({
          page: selected + 1,
          searchType,
          keyword: searchText,
          limit: noticesPerPage,
        })
      );
    } else {
      dispatch(
        fetchNotices({
          page: selected + 1,
          searchType: "",
          keyword: "",
          limit: noticesPerPage,
        })
      );
    }
  };

  return (
    <>
      <Container className="mt-4">
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
            <Col xs={6}>
              <Form.Control
                type="text"
                name="searchText"
                onChange={handleChange}
                value={searchText}
                placeholder="검색어를 입력하세요"
              />
            </Col>
            <Col xs={3} className="text-end">
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
              notices.map((notice, index) => (
                <tr
                  key={notice._id}
                  onClick={() => navigate(`/notice/${notice._id}`)}
                >
                  <td className="notice-number-column">{(currentPage - 1) * noticesPerPage + index + 1}</td>
                  {/* 번호 표시 */}
                  <td className="notice-title-column">{notice.title}</td>
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
          previousLabel={"< 이전"}
          nextLabel={"다음 >"}
          breakLabel={"..."}
          pageCount={totalPageNum} // 전체 페이지 수를 사용
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