import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import SearchBox from "../../common/component/SearchBox";
import ProductTable from "./component/ProductTable";
import CreateNoticeDialog from "./component/CreateNoticeDialog";
import EditNoticeDialog from "./component/EditNoticeDialog";
import { fetchNotices, deleteNotice } from "../../features/notice/noticeSlice";

const AdminNoticePage = () => {
  const dispatch = useDispatch();
  const notices = useSelector((state) => state.notice.notices);
  const totalNotices = useSelector((state) => state.notice.totalCount); // 전체 공지 사항 수
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    title: "",
  });

  const noticesPerPage = 10; // 페이지 당 공지사항 수

  const tableHeader = ["#", "Title", "Date", "Actions"];

  // Notices 데이터를 가져오기
  useEffect(() => {
    dispatch(fetchNotices(searchQuery));
  }, [dispatch, searchQuery]);

  const handleClickCreateNotice = () => {
    setShowCreateDialog(true);
  };

  // TODO: handleEditNotice(선택한 노티스) 거 작동하는지 확인.
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
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2 mb-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
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
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={Math.ceil(totalNotices / noticesPerPage)}  // 총 페이지 수 계산
          forcePage={searchQuery.page - 1}
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
        />
      </Container>

      <CreateNoticeDialog
        show={showCreateDialog}
        handleClose={() => setShowCreateDialog(false)}
      />

      <EditNoticeDialog
        show={showEditDialog}
        handleClose={() => setShowEditDialog(false)}
        notice={selectedNotice}
        noticeId={selectedNoticeId}
      />
    </div>
  );
};

export default AdminNoticePage;
