import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';
import { FaHome, FaRegUserCircle } from 'react-icons/fa';
import { GiBookshelf } from 'react-icons/gi';
import { MdMenu } from 'react-icons/md';
import { Dropdown, notification } from 'antd';
import { FaAnglesDown, FaAnglesUp, FaUsers } from 'react-icons/fa6';
import { AiOutlineTransaction } from 'react-icons/ai';
import { BsEmojiAngryFill } from 'react-icons/bs';
import { HiDocumentReport } from 'react-icons/hi';
import home from "../../assets/home.jpeg"
import { VscFeedback } from "react-icons/vsc";

const openNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'topRight',
    duration: 3,
  });
};

const Layout = () => {
  const location = useLocation();
  const { pathname } = location;
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
  const userDetails = JSON.parse(localStorage.getItem('login'))

  return (
    <div id="wrapper">
      <div id="sidebar-wrapper">
        <ul className="sidebar-nav">
          <li className="sidebar-brand">
            <NavLink to="/librarian">
            <img style={{width:"50px",height:"50px",borderRadius:"50%"}} src={home} alt="" />
            <span style={{marginLeft:"20px"}}>Library Mgt Sys</span>

            </NavLink>
          </li>
          <li>
            <NavLink
              to="/librarian"
              className={`d-flex align-items-left justify-content-left`}
              style={{ ...navStyle('/librarian'), alignItems: 'center', paddingLeft: '7%' }}
            >
              <FaHome />
              <span className="ml-2">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/librarian/allBooks"
              className={`d-flex align-items-left justify-content-left`}
              style={{ ...navStyle('/librarian/allBooks'), alignItems: 'center', paddingLeft: '7%' }}
            >
              <GiBookshelf />
              <span className="ml-2">Books</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/librarian/checkout"
              className={`d-flex align-items-left justify-content-left`}
              style={{ ...navStyle('/librarian/checkout'), alignItems: 'center', paddingLeft: '7%' }}
            >
              <FaAnglesUp />
              <span className="ml-2">Checkout</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/librarian/checkin"
              className={`d-flex align-items-left justify-content-left`}
              style={{ ...navStyle('/librarian/checkin'), alignItems: 'center', paddingLeft: '7%' }}
            >
              <FaAnglesDown />
              <span className="ml-2">CheckIn</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/librarian/transactions"
              className={`d-flex align-items-left justify-content-left`}
              style={{ ...navStyle('/librarian/transactions'), alignItems: 'center', paddingLeft: '7%' }}
            >
              <AiOutlineTransaction />
              <span className="ml-2">Loan History</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/librarian/patrons"
              className={`d-flex align-items-left justify-content-left`}
              style={{ ...navStyle('/librarian/patrons'), alignItems: 'center', paddingLeft: '7%' }}
            >
              <FaUsers />
              <span className="ml-2">Patrons</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/librarian/overdue"
              className={`d-flex align-items-left justify-content-left`}
              style={{ ...navStyle('/librarian/overdue'), alignItems: 'center', paddingLeft: '7%' }}
            >
              <BsEmojiAngryFill />
              <span className="ml-2">OverDue</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/librarian/reports"
              className={`d-flex align-items-left justify-content-left`}
              style={{ ...navStyle('/librarian/reports'), alignItems: 'center', paddingLeft: '7%' }}
            >
              <HiDocumentReport />
              <span className="ml-2">Reports</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/librarian/suggestion-box"
              className={`d-flex align-items-left justify-content-left`}
              style={{ ...navStyle('/librarian/suggestion-box'), alignItems: 'center', paddingLeft: '7%' }}
            >
              <VscFeedback />
              <span className="ml-2">Suggestion Box</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <Navbar style={{ background: '#5A5892 !important' }}>
        <Container>
          <Navbar.Brand>
            <MdMenu style={{ cursor: 'pointer' }} onClick={handleMenuToggle} id="menu-toggle" />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
            <Dropdown
    menu={{
      items: [
        { key: '1', label: <NavLink style={{textDecoration:"none"}} to='/librarian/profile'>Profile</NavLink> },
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
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div id="page-content-wrapper">
        <div className="container-fluid">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
