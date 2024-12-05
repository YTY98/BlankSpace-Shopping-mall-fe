import React, { useState } from "react";
import { Row, Col, Container, Modal, Button } from "react-bootstrap";
import Footer from "../../common/component/Footer"; 
import "./style/CollectionPage.style.css";

const CollectionPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = [
    "/image/Collection1-1.png",
    "/image/Collection1-2.png",
    "/image/Collection1-3.png",
    "/image/Collection1-4.png",
    "/image/Collection1-5.png",
    "/image/Collection1-6.png",
    "/image/Collection1-7.png",
    "/image/Collection1-8.png",
    "/image/Collection1-9.png",
    "/image/Collection1-10.png",
    "/image/Collection1-11.png",
    "/image/Collection1-12.png",
    "/image/Collection1-13.png",
    "/image/Collection1-14.png",
    "/image/Collection1-15.png",
    "/image/Collection1-16.png",
    "/image/Collection1-17.png",
    "/image/Collection1-18.png",
    "/image/Collection1-19.png",
    "/image/Collection1-20.png",
    "/image/Collection1-21.png",
    "/image/Collection1-22.png",
  ];

  const handleClose = () => setShowModal(false);
  const handleShow = (index) => {
    setSelectedImageIndex(index);
    setShowModal(true);
  };

  const handlePrev = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    
    <div>
      
      {/* <Container className="d-flex justify-content-center my-4">
        <Row className="justify-content-center">
          {images.map((image, index) => (
            <Col key={index} xs={12} sm={6} md={3} lg={3} className="mb-4">
              <img 
                src={image} 
                alt={`Product ${index + 1}`}
                className="img-fluid"
                onClick={() => handleShow(index)}
                style={{ cursor: 'pointer' }}
              />
            </Col>
          ))}
        </Row>
      </Container> */}
      <div className="collection-grid1">
          {images.map((image, index) => (
            <img 
              src={image} 
              alt={`Product ${index + 1}`}
              className="collection-grid1-item"
              onClick={() => handleShow(index)}
              style={{ cursor: 'pointer' }}
            />
          ))}
      </div>

      <div className="collection-grid2">
        <img src="/image/Collection2-1.jpg" className="collection-grid2-item" />
        <img src="/image/Collection2-2.jpg" className="collection-grid2-item" />
        <div className="collection-grid2-item">
          <h4 className='collection-header-1'>
          BLANKSPACE COLLECTION<br /><br />
          </h4>

          <p className='collection-paragraph-1'>
          WE FOCUSED OUR ATTENTION ON THE DETAILS,<br />
          THE STORYTELLING, AND THE NUANCES.<br />
          EACH ITEM IN OUR LINEUP FOLLOWS A UNIQUE NARRATIVE,<br />
          CRAFTED TO TELL ITS OWN STORY,<br />
          WHILE EMBODYING OUR DISTINCTIVE STYLE AND VIBE.
          </p>
        </div>
        <img src="/image/Collection2-3.jpg" className="collection-grid2-item" />
        <img src="/image/Collection2-4.jpg" className="collection-grid2-item" />
        <img src="/image/Collection2-5.jpg" className="collection-grid2-item" />
        <img src="/image/Collection2-6.jpg" className="collection-grid2-item" />
        <img src="/image/Collection2-5.jpg" className="collection-grid2-item" />
        <img src="/image/Collection2-6.jpg" className="collection-grid2-item" />
        <img src="/image/Collection2-7.jpg" className="collection-grid2-item" />
        <img src="/image/Collection2-8.jpg" className="collection-grid2-item" />
      </div>

      

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Body className="p-0">
          <img 
            src={images[selectedImageIndex]} 
            alt="Selected"
            className="img-fluid w-100"
          />
          <Button
            variant="dark"
            onClick={handlePrev}
            style={{
              position: "absolute",
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
              opacity: 0.7,
            }}
          >
            &#8592;
          </Button>
          <Button
            variant="dark"
            onClick={handleNext}
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              opacity: 0.7,
            }}
          >
            &#8594;
          </Button>
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
};

  
export default CollectionPage;
