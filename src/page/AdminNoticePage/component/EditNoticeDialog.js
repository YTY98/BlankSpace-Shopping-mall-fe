import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateNotice } from "../../../features/notice/noticeSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ReactQuill 스타일 import

const EditNoticeDialog = ({ show, handleClose, noticeId }) => {
  const dispatch = useDispatch();
  const { notices } = useSelector((state) => state.notice);

  // 선택된 공지사항을 찾음
  const notice = useMemo(() => {
    if (!noticeId) {
      return { title: "", content: "" }; // noticeId가 없을 때 기본값을 반환
    }
    const foundNotice = notices.find((n) => n._id === noticeId);
    // console.log("Selected Notice:", foundNotice);  // 추가된 로그
    return foundNotice || { title: "", content: "" };
  }, [noticeId, notices]);
  

  // 공지사항 수정 시 사용될 상태
  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
    // console.log("check notice", notice);
    // console.log("Notice ID:", noticeId);  // 추가된 로그
    // console.log("Notices State:", notices); 
    
    if (show && notice) {
      // 다이얼로그가 열리면 선택된 공지사항 데이터를 상태에 설정
      setFormData({
        title: notice?.title || "",
        content: notice?.content || ""
      });
    }
  }, [show, notice, noticeId, notices]);

  // 제목 입력 변화 핸들러
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // ReactQuill로 내용 수정 핸들러
  const handleContentChange = (value) => {
    // console.log(value); 잘 전달되고있음.
    setFormData({ ...formData, content: value });
  };

  // 폼 제출 핸들러
  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log("check formData: ", formData);
    dispatch(updateNotice({ id: noticeId, notice: formData })) // notice로 데이터를 감싸서 보내지않아서 수정이 안됐음. 수정완.
      .unwrap()
      .then(() => {
        handleClose();  // 성공 시 다이얼로그 닫기
      })
      .catch((error) => {
        console.error("Error updating notice:", error);
      });
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Notice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
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
              modules={EditNoticeDialog.modules}
              formats={EditNoticeDialog.formats}
              placeholder="Edit content"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

// ReactQuill 툴바와 포맷 설정
EditNoticeDialog.modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline', 'strike'], // 글꼴 스타일링 옵션 추가
    ['blockquote', 'code-block'],  // 블록 요소 추가
    ['link', 'image'],  // 링크 및 이미지 추가
    [{ 'align': [] }],  // 정렬 옵션
    [{ 'color': [] }, { 'background': [] }],  // 글꼴 색상 및 배경색
    ['clean'],  // 포맷 제거
  ],
};

EditNoticeDialog.formats = [
  'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code-block', 'link', 'image', 'align', 'color', 'background'
];

export default EditNoticeDialog;
