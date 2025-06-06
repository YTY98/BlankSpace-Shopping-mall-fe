import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import {
  getAllReviews,
  deleteReview,
} from "../../features/Review/ReviewSlice";

const AdminReviewPage = () => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.reviews);
  const [searchQuery, setSearchQuery] = useState({ keyword: "", page: 1 });

  const reviewsPerPage = 10;

  useEffect(() => {
    dispatch(getAllReviews());
  }, [dispatch]);

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("리뷰를 삭제하시겠습니까?")) {
      try {
        await dispatch(deleteReview(reviewId)).unwrap();
      } catch (err) {
        console.error("삭제 실패:", err);
      }
    }
  };

  const handlePageClick = ({ selected }) => {
    setSearchQuery((prev) => ({ ...prev, page: selected + 1 }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery({ keyword: e.target.value, page: 1 });
  };

  // 상품명 기준 검색
  const filteredReviews = reviews.filter((review) =>
    review.productId?.name?.toLowerCase().includes(searchQuery.keyword.toLowerCase())
  );

  const offset = (searchQuery.page - 1) * reviewsPerPage;
  const currentReviews = filteredReviews.slice(offset, offset + reviewsPerPage);

  return (
    <div className="locate-center">
      <Container>
        <h2 className="mt-3">관리자 리뷰 관리</h2>

        <input
          type="text"
          className="form-control my-3"
          placeholder="상품 이름 검색"
          value={searchQuery.keyword}
          onChange={handleSearchChange}
        />

        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>상품명</th>
              <th>작성자</th>
              <th>내용</th>
              <th>평점</th>
              <th>이미지</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  리뷰가 없습니다.
                </td>
              </tr>
            ) : (
              currentReviews.map((review, index) => (
                <tr key={review._id}>
                  <td>{offset + index + 1}</td>
                  <td>{review.productId?.name || "상품 없음"}</td>
                  <td>{review.name}</td>
                  <td>{review.comment || review.text || "-"}</td>
                  <td>{review.rating} ⭐</td>
                  <td>
                    {review.imageUrls?.[0] ? (
                      <img
                        src={review.imageUrls[0]}
                        alt="리뷰 이미지"
                        width="50"
                        height="50"
                      />
                    ) : (
                      "없음"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteReview(review._id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <ReactPaginate
          previousLabel={"< 이전"}
          nextLabel={"다음 >"}
          pageCount={Math.ceil(filteredReviews.length / reviewsPerPage)}
          onPageChange={handlePageClick}
          forcePage={searchQuery.page - 1}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </Container>
    </div>
  );
};

export default AdminReviewPage;
