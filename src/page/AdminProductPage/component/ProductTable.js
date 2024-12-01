import React from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { currencyFormat } from "../../../utils/number";

const ProductTable = ({ header, data, deleteItem, openEditForm }) => {
  return (
    <div className="overflow-x">
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <th>{index}</th>
                <th>{item.sku}</th>
                <th style={{ minWidth: "100px" }}>{item.name}</th>
                <th>{currencyFormat(item.price)}</th>
                <th>
                  {Object.keys(item.stock).map((size, idx) => (
                    <div key={idx}>
                      {size}:{item.stock[size]}
                    </div>
                  ))}
                </th>
                <th>
                  {item.image && item.image[0] ? (
                    <img src={item.image[0]} width={100} alt="image" />
                  ) : (
                    <span>No Image</span>
                  )}
                </th>
                <th>{item.status}</th>
                <th style={{ minWidth: "100px" }}>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteItem(item._id)}
                    className="mr-1"
                  >
                    Delete
                  </Button>
                  <Button size="sm" onClick={() => openEditForm(item)}>
                    Edit
                  </Button>
                </th>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={header.length} style={{ textAlign: "center" }}>
                No Data to show
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
export default ProductTable;
