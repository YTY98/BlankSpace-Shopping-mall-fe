import React, { useState } from "react";
import { Row, Col, Container, Modal, Button } from "react-bootstrap";
import Footer from "../common/component/Footer"; 

const CollectionPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = [
    "/image/Collection01.png",
    "/image/Collection02.png",
    "/image/Collection03.png",
    "/image/Collection04.png",
    "/image/Collection05.png",
    "/image/Collection06.png",
    "/image/Collection07.png",
    "/image/Collection08.png",
    "/image/Collection09.png",
    "/image/Collection10.png",
    "/image/Collection11.png",
    "/image/Collection12.png",
    "/image/Collection13.png",
    "/image/Collection14.png",
    "/image/Collection15.png",
    "/image/Collection16.png",
    "/image/Collection17.png",
    "/image/Collection18.png",
    "/image/Collection19.png",
    "/image/Collection20.png",
    "/image/Collection21.png",
    "/image/Collection22.png",
    "/image/Collection23.png",
    "/image/Collection24.png",
    "/image/Collection25.png",
    "/image/Collection26.png",
    "/image/Collection27.png",
    "/image/Collection28.png",
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
      <Container className="d-flex justify-content-center my-4">
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
      </Container>

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
