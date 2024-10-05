import React from "react";
import { Button } from "react-bootstrap";

const Cbutton = ({ children, type, onClick }) => {
  return (
    <Button variant="primary" type={type} onClick={onClick}>
      {children}
    </Button>
  );
};

export default Cbutton;