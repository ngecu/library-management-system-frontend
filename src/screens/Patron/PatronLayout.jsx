import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FaHome, FaRegUserCircle } from 'react-icons/fa';
import { GiBookshelf } from 'react-icons/gi';
import { MdMenu } from 'react-icons/md';
import { Dropdown, notification } from 'antd';
import { FaAnglesDown, FaAnglesUp, FaUsers } from 'react-icons/fa6';
import { AiOutlineTransaction } from 'react-icons/ai';
import { BsEmojiAngryFill } from 'react-icons/bs';
import { HiDocumentReport } from 'react-icons/hi';

const openNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'topRight',
    duration: 3,
  });
};

const PatronLayout = () => {
  const location = useLocation();
  const { pathname } = location;

  const handleLogout = () => {
    localStorage.removeItem('login');
    openNotification('success', 'Logout Successful', 'You have been logged out.');
    navigate("/");
  };

  const handleMenuToggle = (e) => {
    e.preventDefault();
    const wrapper = document.getElementById('wrapper');
    if (wrapper) {
      wrapper.classList.toggle('toggled');
    }
  };

  const navStyle = (path) => {
    return pathname === path
      ? { backgroundColor: 'rgba(246, 189, 48,1)',borderRadius: '20px',color: '#fff' }
      : {};
  };

  return (
    <div>
   

   <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Library Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#features">Books</Nav.Link>
            <Nav.Link href="#pricing">OverDue</Nav.Link>
            <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link href="#deets">More deets</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Dank memes
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

      <div id="page-content-wrapper">
        <div className="container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PatronLayout;
