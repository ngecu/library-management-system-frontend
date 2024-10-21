// src/components/LibraryDashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Row, Col, Card, Button, Container, Image } from 'react-bootstrap';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import './LibraryDashboard.css'; // Custom CSS for additional styling

const LibraryDashboard = () => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDate = () => {
      const date = new Date();
      setCurrentDate(date.toLocaleString()); // Includes date and time
    };

    const intervalId = setInterval(updateDate, 1000);
    updateDate();

    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const items = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: 'User Name',
      children: [
        {
          key: 'sub1',
          label: 'Profile',
        },
        {
          key: 'sub2',
          label: 'Settings',
        },
      ],
    },
    {
      key: '2',
      icon: <AppstoreOutlined />,
      label: 'Home',
      link: '/dashboard',
    },
    {
      key: '3',
      icon: <MailOutlined />,
      label: 'Books',
      link: '/books',
    },
    {
      key: '4',
      icon: <MailOutlined />,
      label: 'Members',
      link: '/members',
    },
    {
      key: '5',
      icon: <MailOutlined />,
      label: 'Loans',
      link: '/loans',
    },
  ];

  const onClick = (e) => {
    console.log('click ', e);
  };

  return (
    <>
      <Row>
        {/* Sidebar */}
        <Col xs={2} className="sidebar">
          <Menu
            onClick={onClick}
            style={{
              width: "100%",
            }}
            defaultSelectedKeys={['1']}
            mode="inline"
            items={items.map(item => ({
              ...item,
              label: item.link ? <Link to={item.link}>{item.label}</Link> : item.label,
            }))}
          />
        </Col>

        {/* Main Section */}
        <Col xs={10} className="main-section">
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">Library Dashboard</Navbar.Brand>
            <Nav className="ml-auto">
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar>

          <h2>Welcome to the Library!</h2>
          <p>Current Date and Time: {currentDate}</p>
          {/* You can add more content here, such as cards or other components */}
          <Card>
            <Card.Body>
              <Card.Title>Upcoming Events</Card.Title>
              <Card.Text>
                Here you can list the upcoming events in the library.
              </Card.Text>
              <Button variant="primary">View Events</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default LibraryDashboard;
