import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const PasswordPromptModal = ({ show, handleClose, handleSubmit }) => {
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    handleSubmit(password);
    setPassword(''); // 비밀번호 초기화
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>비밀번호 입력</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="password">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          취소
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PasswordPromptModal;