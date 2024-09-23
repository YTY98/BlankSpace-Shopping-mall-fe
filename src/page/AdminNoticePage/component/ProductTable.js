import React from "react";
import { Table, Button } from "react-bootstrap";

const ProductTable = ({ header, data, deleteItem, openEditForm }) => {
  // data가 배열인지 확인하고, 그렇지 않다면 빈 배열로 초기화합니다.
  const notices = Array.isArray(data) ? data : [];

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {header.map((heading, index) => (
            <th key={index}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {notices.map((item, index) => (
          <tr key={item._id}>
            <td>{index + 1}</td>
            <td>{item.title}</td>
            <td>{new Date(item.date).toLocaleDateString()}</td>
            <td>
              <Button variant="warning" onClick={() => openEditForm(item)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => deleteItem(item._id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ProductTable;
