import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addNotice } from '../../features/notice/noticeSlice';

const WritePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // body -> content로 변경
  const [error, setError] = useState(null); // 에러 상태 추가

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addNotice({ title, content })); // content로 변경
      navigate('/admin/notices'); // 공지사항 페이지로 이동
    } catch (err) {
      setError('공지사항을 추가하는 데 실패했습니다.'); // 에러 메시지 설정
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">새 공지사항 작성</h1>
      {error && <Alert variant="danger">{error}</Alert>} {/* 에러 메시지 표시 */}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle">
          <Form.Label>제목</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
        </Form.Group>
        <Form.Group controlId="formBody" className="mt-3">
          <Form.Label>내용</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={content} // content로 변경
            onChange={(e) => setContent(e.target.value)} // content로 변경
            placeholder="내용을 입력하세요"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          작성하기
        </Button>
      </Form>
    </Container>
  );
};

export default WritePage;