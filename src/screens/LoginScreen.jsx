import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Container } from 'react-bootstrap';
import { useLoginMutation } from '../features/userApi'; // Adjust the import path as necessary
import { Checkbox, Form, Input, Spin } from 'antd';
import home from "../assets/home.jpeg"
import { notification } from 'antd';

const openNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'topRight', // Positioning the notification at the top right
    duration: 3, // Duration to display the notification
  });
};


const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [login, { isLoading, error }] = useLoginMutation(); // Using the login mutation

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const submitLoginHandler = async () => {
    try {
      const result = await login({ email, password }).unwrap(); // Unwrap the result to get the response
      localStorage.setItem('login', JSON.stringify(result));


    // Show success notification
    openNotification('success', 'Login Successful', 'Welcome');


      if (result.role == "librarian") {
        navigate("/librarian");
      }
      else{
        navigate("/patron");
      }
      // Redirect to the desired page after successful login, e.g., dashboard
    } catch (err) {
      console.error("Login failed:", err);
      openNotification('error', 'Login Failed', err.data.message || 'Login failed, please try again.');
    }
  };

  return (
    <>
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',height:"100vh" }}>
      <Spin spinning={isLoading}>
        <div style={{ boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px', padding: '20px', width: '800px',background:"#294A70",borderRadius:"20px" }}>
          <Row>
            <Col md={12} className='text-center'>
              <h1 style={{color:"white"}}>Library Management System</h1>
             
            </Col>
            <Col md={6}>
              
              <Form
                initialValues={{ remember: true }}
                onFinish={submitLoginHandler}
                layout="vertical"
                name="basic"
                labelCol={{ span: 32 }}
                wrapperCol={{ span: 32 }}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                style={{height: "100%",justifyContent: "center",display: "flex",flexDirection: "column"}}
              >
               <Form.Item
        label="Email address"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-cy="email"
        />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-cy="password"
        />
      </Form.Item>

                <Row>
                
                  <Col md={12}>
                    <Form.Item
                      wrapperCol={{ offset: 0, span: 32 }}
                      style={{ marginBottom: 0 }}
                    >
                      <Button style={{border:"solid #535266",background:"#FFB71D",color:"#535266",borderRadius:"40px"}} className='w-100' type="submit" htmlType="submit" data-cy="login-btn">
                        Login
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col md={12} className='mt-2' style={{color:"white",textAlign:"center"}}>
                  <NavLink to="lost-password" style={{color:"white",textDecoration:"none"}}>
                      Lost Your Password?
                  </NavLink>
                  </Col>
                </Row>
              </Form>

            </Col>

            <Col md={6} style={{display: "flex",justifyContent: "center"}}>
              <img style={{position: "relative", right: "4%",borderRadius:"40px"}} src={home} alt="" className='w-100' />
            </Col>
          
          </Row>
        </div>
        </Spin>
      </Container>
    </>
  );
};

export default LoginScreen;
