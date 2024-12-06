import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Nav, Dropdown } from "react-bootstrap";
import ProductCard from "../LandingPage/components/ProductCard";
import Footer from "../../common/component/Footer";
import SearchBox from "../../common/component/SearchBox";
import { getProductList } from "../../features/product/productSlice";
import { getProductsSortedBySales } from "../../features/order/orderSlice";
import "./style/ShopPage.style.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate"; // ReactPaginate import

const ShopPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const productList = useSelector((state) => state.product.productList);
  const sortedSalesProducts = useSelector((state) => state.order.sortedProducts);
  const totalPageNum = useSelector((state) => state.product.totalPageNum); // 전체 페이지 수

  const navigate = useNavigate();

  // 초기 상태 설정
  const initialCategory = searchParams.get("category") || "All";
  const initialSearchQuery = searchParams.get("name") || "";

  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState({ name: initialSearchQuery });
  const [sortOrder, setSortOrder] = useState(["createdAt", "desc"]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [hoveredImages, setHoveredImages] = useState({}); // 호버 이미지 관리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가

  // URL 파라미터에서 카테고리와 검색어를 가져와 상태를 설정
  useEffect(() => {
    const categoryFromParams = searchParams.get("category") || "All";
    const nameFromParams = searchParams.get("name") || "";

    if (category !== categoryFromParams || searchQuery.name !== nameFromParams) {
      setCategory(categoryFromParams);
      setSearchQuery({ name: nameFromParams });
    }
  }, [searchParams]);

  // 정렬 방식, 카테고리 또는 검색어 변경 시 API 호출
  useEffect(() => {
    if (sortOrder[0] === "sales") {
      dispatch(getProductsSortedBySales(category.toLowerCase()));
    } else {
      dispatch(
        getProductList({
          name: searchQuery.name,
          category: category.toLowerCase() === "all" ? "" : category.toLowerCase(),
          // category: category.toLowerCase(),
        })
      );
    }
  }, [dispatch, sortOrder, category, searchQuery]);

  // 상품 목록 가져오기
  useEffect(() => {
    dispatch(
      getProductList({
        name: searchQuery.name,
        category: category.toLowerCase() === "all" ? "" : category.toLowerCase(),
        page: currentPage, // 페이지 번호 추가
      })
    );
  }, [dispatch, category, searchQuery, currentPage]); // currentPage 추가

  // 정렬 방식, 카테고리 또는 검색어 변경 시 상태 업데이트
  useEffect(() => {
    if (sortOrder[0] === "sales" && sortedSalesProducts.length > 0) {
      const filtered = sortedSalesProducts
        .filter((group) => group._id.toLowerCase() === category.toLowerCase())
        .flatMap((group) => group.products.map((product) => product));
      setDisplayProducts(filtered);
    } else if (productList.length > 0) {
      const [key, direction] = sortOrder;
      const sorted = [...productList].sort((a, b) => {
        if (direction === "asc") {
          return a[key] > b[key] ? 1 : -1;
        } else {
          return a[key] > b[key] ? -1 : 1;
        }
      });
      setDisplayProducts(sorted);
    } else {
      setDisplayProducts(productList);
    }
  }, [sortOrder, productList, sortedSalesProducts, category]);

  // URL 파라미터 동기화
  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    if (searchQuery.name) params.name = searchQuery.name;
    setSearchParams(params);
  }, [category, searchQuery, setSearchParams]);

  // 카테고리 클릭 시 핸들러
  const handleCategoryClick = (cat) => {
    if (cat !== category) {
      setCategory(cat);
      setSortOrder(["createdAt", "desc"]);
      setCurrentPage(1); // 페이지를 초기화
    }
  };

  // 정렬 기준 변경 핸들러
  const handleSortChange = (option) => {
    const sortOptions = {
      priceLowToHigh: ["price", "asc"],
      priceHighToLow: ["price", "desc"],
      latest: ["createdAt", "desc"],
      sales: ["sales", "desc"],
    };
    setSortOrder(sortOptions[option] || ["createdAt", "desc"]);
  };

  // React Paginate에서 페이지 변경 시 호출
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  // 이미지 호버 이벤트 핸들러
  const handleMouseEnter = (productId, images) => {
    if (images.length > 1) {
      setHoveredImages((prev) => ({ ...prev, [productId]: images[1] })); // 두 번째 이미지로 변경
    }
  };

  const handleMouseLeave = (productId, images) => {
    if (images.length > 0) {
      setHoveredImages((prev) => ({ ...prev, [productId]: images[0] })); // 첫 번째 이미지로 복구
    }
  };

  return (
    <div>
      <Container className="mt-4" style ={{marginBottom: "100px"}}>
        <Nav className="category-nav mb-4">
          {["All", "Outer", "Top", "Pants", "Shoes", "Acc"].map((cat) => (
            <Nav.Item key={cat}>
              <Nav.Link
                active={category.toLowerCase() === cat.toLowerCase()}
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(cat);
                }}
              >
                {cat}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <div className="right-align d-flex justify-content-end mb-4">
          <Dropdown className="custom-dropdown">
            <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ backgroundColor: "#FAF9F8" }}>
              정렬 기준
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSortChange("latest")}>신상품순</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange("priceLowToHigh")}>가격 낮은 순</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange("priceHighToLow")}>가격 높은 순</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange("sales")}>판매량 순</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search"
            field="name"
            className="search-box-custom ml-3"
          />
        </div>

        <div className="mt-4">
          {displayProducts.length > 0 ? (
            <div>
              <div className="row">
                {displayProducts.map((item) => (
                  <div className="col-md-3 col-sm-6 mb-4" key={item.productId || item._id}>
                    <ProductCard item={item.productDetails || item} />
                  </div>
                ))}
              </div>
              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                pageCount={totalPageNum} // 총 페이지 수
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick} // 페이지 변경 핸들러
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
              />
            </div>
          ) : (
            <div className="text-align-center empty-bag" style={{ backgroundColor: "#FAF9F8", padding: "10rem" }}>
              <h2>{category}에 해당하는 상품이 없습니다.</h2>
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default ShopPage;
