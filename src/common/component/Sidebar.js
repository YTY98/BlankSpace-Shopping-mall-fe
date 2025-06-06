import React, { useState } from "react";
import { Offcanvas, Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaThLarge, FaShoppingCart, FaClipboardList, FaInfoCircle, FaStar } from "react-icons/fa"; 

const Sidebar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleSelectMenu = (url) => {
    setShow(false);
    navigate(url);
  };

  const NavbarContent = () => {
    return (
      <div>
        <Link to="/">
          <img
            src="/image/blankspace-logo.png"
            alt="logo.png"
            style={{
              display: "block",
              margin: "5px auto 20px auto",
              width: "65%",
            }}
          />
        </Link>

        <div
          className="sidebar-item"
          onClick={() => handleSelectMenu("/")}
          style={{ display: "flex", alignItems: "center", padding: "10px 0" }}
        >
          <FaHome style={{ marginRight: "30px", color: "#6c757d" }} /> 
          <span style={{ color: "#000000" }}>Home</span>
        </div>

        <div
          className="sidebar-item"
          onClick={() => handleSelectMenu("/admin/management?page=1")}
          style={{ display: "flex", alignItems: "center", padding: "10px 0" }}
        >
          <FaThLarge style={{ marginRight: "30px", color: "#6c757d" }} /> 
          <span style={{ color: "#000000" }}>Dashboard</span>
        </div>

        <div
          className="sidebar-item"
          onClick={() => handleSelectMenu("/admin/product?page=1")}
          style={{ display: "flex", alignItems: "center", padding: "10px 0" }}
        >
          <FaShoppingCart style={{ marginRight: "30px", color: "#6c757d" }} /> 
          <span style={{ color: "#000000" }}>Products</span>
        </div>

        <div
          className="sidebar-item"
          onClick={() => handleSelectMenu("/admin/order?page=1")}
          style={{ display: "flex", alignItems: "center", padding: "10px 0" }}
        >
          <FaClipboardList style={{ marginRight: "30px", color: "#6c757d" }} /> 
          <span style={{ color: "#000000" }}>Orders</span>
        </div>

        <div
          className="sidebar-item"
          onClick={() => handleSelectMenu("/admin/notices")}
          style={{ display: "flex", alignItems: "center", padding: "10px 0" }}
        >
          <FaInfoCircle style={{ marginRight: "30px", color: "#6c757d" }} /> 
          <span style={{ color: "#000000" }}>Notices</span>
        </div>

        <div
          className="sidebar-item"
          onClick={() => handleSelectMenu("/admin/review")}
          style={{ display: "flex", alignItems: "center", padding: "10px 0" }}
        >
          <FaStar style={{ marginRight: "30px", color: "#6c757d" }} /> 
          <span style={{ color: "#000000" }}>Reviews</span>
        </div>

      </div>
    );
  };

  return (
    <>
      <div className="sidebar-toggle">{NavbarContent()}</div>

      <Navbar bg="light" expand={false} className="mobile-sidebar-toggle">
        <Container fluid>
          <img width={80} src="/image/blankspace.png" alt="blankspace.png" />
          <Navbar.Brand href="#"></Navbar.Brand>
          <Navbar.Toggle
            aria-controls="offcanvasNavbar-expand"
            onClick={() => setShow(true)}
          />
          <Navbar.Offcanvas
            id="offcanvasNavbar-expand"
            aria-labelledby="offcanvasNavbarLabel-expand"
            placement="start"
            className="sidebar"
            show={show}
          >
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body>{NavbarContent()}</Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default Sidebar;
