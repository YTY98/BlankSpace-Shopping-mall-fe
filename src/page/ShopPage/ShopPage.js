import { useSearchParams ,useNavigate} from "react-router-dom";
import { Container, Nav, Dropdown } from "react-bootstrap";
import ProductCard from "../LandingPage/components/ProductCard";
import Footer from "../../common/component/Footer";
import SearchBox from "../../common/component/SearchBox";
import { getProductList } from "../../features/product/productSlice";
import { getProductsSortedBySales } from "../../features/order/orderSlice";
import "./style/ShopPage.style.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ShopPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const productList = useSelector((state) => state.product.productList);
  const sortedSalesProducts = useSelector((state) => state.order.sortedProducts);
  
  const navigate = useNavigate();

  // 초기 상태 설정
  const initialCategory = searchParams.get("category") || "All";
  const initialSearchQuery = searchParams.get("name") || "";

  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState({ name: initialSearchQuery });
  const [sortOrder, setSortOrder] = useState(["createdAt", "desc"]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [hoveredImages, setHoveredImages] = useState({}); // 호버 이미지 관리


  useEffect(() => {
    const categoryFromParams = searchParams.get("category") || "All";
    const nameFromParams = searchParams.get("name") || "";

    // 상태가 동일한 경우 중복 업데이트 방지
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
      setDisplayProducts([]);
    }
  }, [sortOrder, productList, sortedSalesProducts, category]);


  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    if (searchQuery.name) params.name = searchQuery.name;
    setSearchParams(params);
  }, [category, searchQuery, setSearchParams]);
  
  
  
  const handleCategoryClick = (cat) => {
    if (cat !== category) {
      setCategory(cat);
      setSortOrder(["createdAt", "desc"]);
    }
  };
  


  const handleSortChange = (option) => {
    const sortOptions = {
      priceLowToHigh: ["price", "asc"],
      priceHighToLow: ["price", "desc"],
      latest: ["createdAt", "desc"],
      sales: ["sales", "desc"],
    };
    setSortOrder(sortOptions[option] || ["createdAt", "desc"]);
  };

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
    <div>{/** TODO: Navbar 이쁘게 그리고 마우스 대면 밑줄이 생기게 */}
      <Container className="mt-4">
        <Nav className="category-nav mb-4">
          {["All", "Outer", "Top", "Bottom", "Shoes", "Acc"].map((cat) => (
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

        {/* 검색박스와 정렬 기준을 오른쪽으로 정렬하기 위해 div를 사용 */}
        <div className="right-align d-flex justify-content-end mb-4">

          {/* 정렬 기준 드롭다운 */}
          <div>
            <Dropdown className="custom-dropdown">
              <Dropdown.Toggle variant="light" id="dropdown-basic" style={{backgroundColor: "#FAF9F8"}}>
                정렬 기준
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleSortChange("latest")}>
                  신상품순
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleSortChange("priceLowToHigh")}
                >
                  가격 낮은 순
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleSortChange("priceHighToLow")}
                >
                  가격 높은 순
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSortChange("sales")}>
                  판매량 순
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* 검색 박스 */}
          <div className="mr-3">
            <SearchBox
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search"
              field="name"
              className="search-box-custom"
            />
          </div>

        </div>

        <div className="mt-4">
          {displayProducts.length > 0 ? (
            <div className="row">
              {displayProducts.map((item) => (
                <div
                  className="col-md-3 col-sm-6 mb-4" // 한 줄에 4개씩, 작은 화면에서는 2개씩 표시
                  key={item.productId || item._id}
                >
                  <ProductCard item={item.productDetails || item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-align-center empty-bag"
              style={{backgroundColor: "#FAF9F8", padding: "10rem"}}
            >
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