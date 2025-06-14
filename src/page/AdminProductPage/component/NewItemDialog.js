import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";
import { CATEGORY, STATUS, SIZE } from "../../../constants/product.constants";
import "../style/adminProduct.style.css";
import {
  clearError,
  createProduct,
  editProduct,
} from "../../../features/product/productSlice";
import { WASH_METHODS } from "../../../constants/product.constants";

const InitialFormData = {
  name: "",
  sku: "",
  stock: {},
  image: [],
  description: "",
  category: [],
  status: "active",
  price: 0,
  height: 0,
  weight: 0,
  washMethods: [], // 세탁 방법 필드 추가
};

const NewItemDialog = ({ mode, showDialog, setShowDialog }) => {
  const { error, success, selectedProduct } = useSelector(
    (state) => state.product
  );
  const [formData, setFormData] = useState(
    mode === "new" ? { ...InitialFormData } : selectedProduct
  );
  const [stock, setStock] = useState([]);
  const dispatch = useDispatch();
  const [stockError, setStockError] = useState(false);

  useEffect(() => {
    if (success) setShowDialog(false);
  }, [success]);

  useEffect(() => {
    if (error || !success) {
      dispatch(clearError());
    }
    if (showDialog) {
      if (mode === "edit") {
        setFormData(selectedProduct);
        const sizeArray = Object.keys(selectedProduct.stock).map((size) => [
          size,
          selectedProduct.stock[size],
        ]);
        setStock(sizeArray);
      } else {
        setFormData({ ...InitialFormData });
        setStock([]);
      }
    }
  }, [showDialog]);

  const handleClose = () => {
    setShowDialog(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (stock.length === 0) return setStockError(true);
    const totalStock = stock.reduce((total, item) => {
      return { ...total, [item[0]]: parseInt(item[1]) };
    }, {});

    const selectedWashMethodObjects = WASH_METHODS.filter((method) =>
      formData.washMethods.includes(method.value)
    );

    const finalData = {
      ...formData,
      stock: totalStock,
      washMethods: selectedWashMethodObjects, // ✅ 변환된 객체 배열로 저장
    };
    
    if (mode === "new") {
      dispatch(createProduct({ ...formData, stock: totalStock }));
    } else {
      dispatch(
        editProduct({ ...formData, stock: totalStock, id: selectedProduct._id })
      );
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const addStock = () => {
    setStock([...stock, []]);
  };

  const deleteStock = (idx) => {
    const newStock = stock.filter((item, index) => index !== idx);
    setStock(newStock);
  };

  const handleSizeChange = (value, index) => {
    const newStock = [...stock];
    newStock[index][0] = value;
    setStock(newStock);
  };

  const handleStockChange = (value, index) => {
    const newStock = [...stock];
    newStock[index][1] = value;
    setStock(newStock);
  };

  const onHandleCategory = (event) => {
    const selectedCategory = event.target.value;
    setFormData({
      ...formData,
      category: [selectedCategory], // 카테고리를 하나만 선택할 수 있도록 설정
    });
  };

  const handleWashMethodChange = (event) => {
    const { value } = event.target;
    const updatedWashMethods = formData.washMethods.includes(value)
      ? formData.washMethods.filter((method) => method !== value)
      : [...formData.washMethods, value];
    setFormData({ ...formData, washMethods: updatedWashMethods });
  };

  const uploadImage = (url) => {
    setFormData({ ...formData, image: [...formData.image,url] });
  };

  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        {mode === "new" ? (
          <Modal.Title>Create New Product</Modal.Title>
        ) : (
          <Modal.Title>Edit Product</Modal.Title>
        )}
      </Modal.Header>
      {error && (
        <div className="error-message">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}
      <Form className="form-container" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="sku">
            <Form.Label>Sku</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Enter Sku"
              required
              value={formData.sku}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Name"
              required
              value={formData.name}
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="string"
            placeholder="Description"
            as="textarea"
            onChange={handleChange}
            rows={3}
            value={formData.description}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="stock">
          <Form.Label className="mr-1">Stock</Form.Label>
          {stockError && (
            <span className="error-message">재고를 추가해주세요</span>
          )}
          <Button size="sm" onClick={addStock}>
            Add +
          </Button>
          <div className="mt-2">
            {stock.map((item, index) => (
              <Row key={index}>
                <Col sm={4}>
                  <Form.Select
                    onChange={(event) =>
                      handleSizeChange(event.target.value, index)
                    }
                    required
                    defaultValue={item[0] ? item[0].toLowerCase() : ""}
                  >
                    <option value="" disabled selected hidden>
                      Please Choose...
                    </option>
                    {SIZE.map((item, index) => (
                      <option
                        inValid={true}
                        value={item.toLowerCase()}
                        disabled={stock.some(
                          (size) => size[0] === item.toLowerCase()
                        )}
                        key={index}
                      >
                        {item}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col sm={6}>
                  <Form.Control
                    onChange={(event) =>
                      handleStockChange(event.target.value, index)
                    }
                    type="number"
                    placeholder="number of stock"
                    value={item[1]}
                    required
                  />
                </Col>
                <Col sm={2}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteStock(index)}
                  >
                    -
                  </Button>
                </Col>
              </Row>
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Image" required>
          <Form.Label>Image</Form.Label>
          <CloudinaryUploadWidget uploadImage={uploadImage} />
          <img
            id="uploadedimage"
            src={formData.image}
            className="upload-image mt-2"
          ></img>
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={formData.price}
              required
              onChange={handleChange}
              type="number"
              placeholder="0"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={formData.category[0]} // 하나의 카테고리만 선택 가능
              onChange={onHandleCategory}
              required
            >
              <option value="" disabled hidden>
                Please Choose...
              </option>
              {CATEGORY.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formData.status}
              onChange={handleChange}
              required
            >
              {STATUS.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="washMethods">
          <Form.Label>세탁 방법</Form.Label>
          <div className="d-flex flex-wrap gap-3">
            {WASH_METHODS.map((method, idx) => (
              <div key={idx} className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  id={`wash-${method.value}`}
                  value={method.value}
                  checked={formData.washMethods.includes(method.value)}
                  onChange={handleWashMethodChange}
                  className="me-2"
                />
                <label htmlFor={`wash-${method.value}`} className="d-flex align-items-center">
                  <img
                    src={method.image}
                    alt={method.label}
                    width={32}
                    height={32}
                    style={{ objectFit: "contain", marginRight: "8px" }}
                  />
                  <span>{method.label}</span>
                </label>
              </div>
            ))}
          </div>
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="height">
            <Form.Label>Height</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="number"
              placeholder="Enter Height"
              required
              value={formData.height}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="weight">
            <Form.Label>Weight</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="number"
              placeholder="Enter Weight"
              required
              value={formData.weight}
            />
          </Form.Group>
        </Row>
        
        {mode === "new" ? (
          <Button variant="primary" type="submit">
            Submit
          </Button>
        ) : (
          <Button variant="primary" type="submit">
            Edit
          </Button>
        )}
      </Form>
    </Modal>
  );
};

export default NewItemDialog;
