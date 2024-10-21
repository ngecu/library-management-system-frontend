import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';
import { FaHome, FaRegUserCircle } from 'react-icons/fa';
import { GiBookshelf } from 'react-icons/gi';
import { MdMenu } from 'react-icons/md';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Typography } from 'antd';
import { FaAnglesDown, FaAnglesUp, FaUsers } from 'react-icons/fa6';
import { AiOutlineTransaction } from 'react-icons/ai';

const PatronLayout = () => {

  const location = useLocation();
  const { pathname } = location;

  const items = [
    {
      key: '1',
      label: 'Item 1',
    },
    {
      key: '2',
      label: 'Item 2',
    },
    {
      key: '3',
      label: 'Item 3',
    },
  ];

  return (
    <div id="wrapper">

    <div id="sidebar-wrapper">
        <ul class="sidebar-nav">
            <li class="sidebar-brand">
            <NavLink 
                to="/librarian">
                    Library Management System
                </NavLink>
            </li>
            <li>
            <NavLink 
                to="/librarian" 
                className={`d-flex align-items-left justify-content-left `}
                style={{alignItems: "center",paddingLeft: "7%"}}
                >
               <FaHome />
                <span className="ml-2">Dashboard</span>
                </NavLink>

            </li>
            <li>
                <NavLink to="/librarian/allBooks"
                className={`d-flex align-items-left justify-content-left `}
                style={{alignItems: "center",paddingLeft: "7%"}}
                
                > 
                <GiBookshelf />
                <span className="ml-2">Books</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/librarian/checkout"
                className={`d-flex align-items-left justify-content-left `}
                style={{alignItems: "center",paddingLeft: "7%"}}
                
                > 
                                           <FaAnglesUp />

                <span className="ml-2">Checkout</span>
                </NavLink>
            </li>
            <li>
            <NavLink to="/librarian/checkin"
                className={`d-flex align-items-left justify-content-left `}
                style={{alignItems: "center",paddingLeft: "7%"}}
                
                > 
                                           <FaAnglesDown />

                <span className="ml-2">CheckIn</span>
                </NavLink>
            </li>
            <li>
            <NavLink to="/librarian/transactions"
                className={`d-flex align-items-left justify-content-left `}
                style={{alignItems: "center",paddingLeft: "7%"}}
                
                > 
                                           <AiOutlineTransaction />

                <span className="ml-2">Transactions</span>
                </NavLink>
            </li>
            <li>
            <NavLink to="/librarian/patrons"
                className={`d-flex align-items-left justify-content-left `}
                style={{alignItems: "center",paddingLeft: "7%"}}
                
                > 
                                <FaUsers  />


                                         

                <span className="ml-2">Patrons</span>
                </NavLink>
            </li>
        </ul>
    </div>

    <Navbar  style={{background:"#5A5892 !important"}}>
      <Container>
        <Navbar.Brand >
        <MdMenu id="menu-toggle" />

        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
          <Dropdown
    menu={{
      items,
      selectable: true,
      defaultSelectedKeys: ['3'],
    }}
  >
    <Typography.Link>
      <Space>
      <FaRegUserCircle />
      </Space>
    </Typography.Link>
  </Dropdown>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <div id="page-content-wrapper">
       
        <div class="container-fluid">
           <Outlet/>
        </div>
    </div>


</div>
  );
};

export default PatronLayout;
