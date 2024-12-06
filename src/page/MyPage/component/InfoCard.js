import Card from 'react-bootstrap/Card';
import { Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import "../style/infoCard.style.css";
import MembershipIcon from './subComponent/MembershipIcon';


function InfoCard() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    return (
    <>
      {[
        'Light'
      ].map((variant) => (
        <Card
          bg={variant.toLowerCase()}
          key={variant}
          text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
          style={{ width: '30rem', justifySelf: 'center' }}
          className="mb-2"
        >
          <Card.Header className="cardHeader">내 정보</Card.Header>
          <Card.Body className="cardBody">
            <Card.Title> <MembershipIcon membership={user.membership}/>
            <span>  </span>{user.name} 고객님 반갑습니다! </Card.Title>
            <Card.Text>
              <Card className="cardContent">
                <div>
                <Row> {/* TODO: 위에 선 그어야함 */}
                    <Col className="infoSection">
                        <Container 
                            className='cardContainer'
                            onClick={() => navigate(`/mypage/order`)}
                        >
                            <span className='infocardHead'>Order</span>
                            <span className='infocardBody'>
                                <br/>
                                <br/>
                                고객님께서 주문하신 상품의 <br/>주문내역을 확인하실 수 있습니다.
                            </span>
                        </Container>
                    </Col>
                    <Col className="infoSection">
                        <Container 
                            className='cardContainer'
                            onClick={() => navigate(`/mypage/profile`)}
                            >
                            <span className='infocardHead'>Profile</span>
                            <span className='infocardBody'>
                                <br/>
                                <br/>
                                회원이신 고객님의 개인정보를<br/> 관리하는 공간입니다
                            </span>
                        </Container>
                    </Col>
                </Row>
                <Row>
                <Col className="infoSection">
                        <Container
                            className='cardContainer'
                            onClick={() => navigate(`/mypage/wishlist`)}
                            >
                            <span className='infocardHead'>Wishlist</span>
                            <span className='infocardBody'>
                                <br/>
                                <br/>
                                관심상품으로 등록하신<br/>상품의 목록을 보여드립니다.
                            </span>
                        </Container>
                    </Col>
                    <Col className="infoSection">
                        <Container
                            className='cardContainer'
                            onClick={() => navigate(`/mypage/mileage`)}
                            >
                            <span className='infocardHead'>Mileage</span>
                            <span className='infocardBody'>
                                <br/>
                                <br/>
                                적립금은 상품 구매 시<br/> 사용하실 수 있습니다.
                            </span>
                        </Container>
                    </Col>
                </Row>
                <Row>
                <Col className="infoSection">
                        <Container
                            className='cardContainer'
                            onClick={() => navigate(`/mypage/membership`)}
                            >
                            <span className='infocardHead'>Membership</span>
                            <span className='infocardBody'>
                                <br/>
                                <br/>
                                고객님의 멤버쉽 정보를 확인하실 수 있습니다.
                            </span>
                        </Container>
                    </Col>
                    <Col className="infoSection">
                        <Container 
                            className='cardContainer'
                            onClick={() => navigate(`/mypage/qna`)}
                        >
                            <span className='infocardHead'>QnA</span>
                            <span className='infocardBody'>
                                <br/>
                                <br/>
                                고객님께서 작성하신 QnA을 관리하는 공간입니다.
                            </span>
                        </Container>
                    </Col>
                </Row>
                </div>
              </Card>
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </>
  );
}

export default InfoCard;