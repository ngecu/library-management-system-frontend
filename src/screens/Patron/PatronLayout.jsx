import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate,Link } from 'react-router-dom';
import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FaHome, FaRegUserCircle } from 'react-icons/fa';
import { Dropdown, notification } from 'antd';

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
  const userDetails = JSON.parse(localStorage.getItem('login'))
  const navigate = useNavigate()
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
        <Navbar.Brand as={Link} to="/patron">Library Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/patron/allbooks">Books</Nav.Link>
            <Nav.Link as={NavLink} to="/patron/overdue">Overdue</Nav.Link>
          </Nav>
          <Nav>
            <Navbar.Text>
              <Dropdown
                menu={{
                  items: [
                    { key: '1', label: <NavLink to='/patron/profile'>Profile</NavLink> },
                    { key: '2', label: <a onClick={handleLogout}>Logout</a> },
                  ],
                  selectable: true,
                }}
              >
                <div style={{cursor:"pointer"}} className="d-flex align-items-center">
                  <span className="me-2">{userDetails.name}</span>
                  <FaRegUserCircle />
                </div>
              </Dropdown>
            </Navbar.Text>
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
