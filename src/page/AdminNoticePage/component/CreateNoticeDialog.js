import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addNotice } from "../../../features/notice/noticeSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // react-quill 스타일 import

const CreateNoticeDialog = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
    if (show) {
      // 다이얼로그가 열릴 때 상태를 초기화
      setFormData({ title: "", content: "" });
    }
  }, [show]); // show prop이 변경될 때마다 formData를 초기화

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addNotice(formData));
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" >
      <Modal.Header closeButton>
        <Modal.Title>Create Notice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="content">
            <Form.Label>Content</Form.Label>
            <ReactQuill
              value={formData.content}
              onChange={handleContentChange}
              modules={CreateNoticeDialog.modules}
              formats={CreateNoticeDialog.formats}
              placeholder="Enter content"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Create
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

CreateNoticeDialog.modules = {
  toolbar: [
    [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline'],
    ['link'],
    ['image'],
    [{ 'align': [] }],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ],
};

CreateNoticeDialog.formats = [
  'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'link', 'image', 'align', 'color', 'background'
];

export default CreateNoticeDialog;