import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import SearchBox from "../../common/component/SearchBox";
import ProductTable from "./component/ProductTable";
import CreateNoticeDialog from "./component/CreateNoticeDialog";
import EditNoticeDialog from "./component/EditNoticeDialog";
import {
  fetchNotices,
  deleteNotice,
  adminsearchNotices,
} from "../../features/notice/noticeSlice";

const AdminNoticePage = () => {
  const dispatch = useDispatch();
  const notices = useSelector((state) => state.notice.notices);
  const totalNotices = useSelector((state) => state.notice.totalCount);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState({ page: 1, keyword: "" }); // 'keyword'로 변경

  const noticesPerPage = 10;
  const tableHeader = ["#", "Title", "Date", "Actions"];

  // Notices 데이터를 가져오기
  useEffect(() => {
    if (searchQuery.keyword) {
      // 검색어가 있을 경우 searchNotices 호출
      dispatch(
        adminsearchNotices({
          keyword: searchQuery.keyword, // keyword로 수정
          page: searchQuery.page,
        })
      );
    } else {
      // 검색어가 없을 경우 fetchNotices 호출
      dispatch(fetchNotices({ page: searchQuery.page }));
    }
  }, [dispatch, searchQuery]);

  const handleClickCreateNotice = () => {
    setShowCreateDialog(true);
  };

  const handleEditNotice = (notice) => {
    setSelectedNotice(notice);
    setSelectedNoticeId(notice._id);
    setShowEditDialog(true);
  };

  const handleDeleteNotice = async (noticeId) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await dispatch(deleteNotice(noticeId)).unwrap();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handlePageClick = ({ selected }) => {
    setSearchQuery((prev) => ({ ...prev, page: selected + 1 }));
  };

  // 검색어가 바뀔 때마다 쿼리 상태 업데이트
  const handleSearchChange = (keyword) => {
    console.log("검색어:", keyword);
    setSearchQuery((prev) => ({
      ...prev,
      keyword, // 검색어를 keyword로 지정
      page: 1, // 검색할 때 페이지를 1로 초기화
    }));
  };

  const refreshNotices = () => {
    setSearchQuery((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2 mb-2">
          <SearchBox
            searchQuery={searchQuery.keyword} // keyword로 변경
            setSearchQuery={handleSearchChange} // 올바르게 핸들러 지정
            placeholder="Search by title"
            field="title"
            className="search-box-custom"
          />
        </div>
        <Button className="mt-2 mb-2" onClick={handleClickCreateNotice}>
          Add New Notice +
        </Button>

        <ProductTable
          header={tableHeader}
          data={notices}
          deleteItem={handleDeleteNotice}
          openEditForm={handleEditNotice}
        />

        <ReactPaginate
          previousLabel={"< previous"}
          nextLabel={"next >"}
          pageCount={Math.ceil(totalNotices / noticesPerPage)}
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
          activeClassName={"active"}
          forcePage={searchQuery.page - 1}
        />
      </Container>

      <CreateNoticeDialog
        show={showCreateDialog}
        handleClose={() => {
          setShowCreateDialog(false);
          refreshNotices(); // 새 공지 추가 후 목록 새로고침
        }}
      />

      <EditNoticeDialog
        show={showEditDialog}
        handleClose={() => {
          setShowEditDialog(false);
          refreshNotices(); // 수정 후 목록 새로고침
        }}
        notice={selectedNotice}
        noticeId={selectedNoticeId}
      />
    </div>
  );
};

export default AdminNoticePage;
