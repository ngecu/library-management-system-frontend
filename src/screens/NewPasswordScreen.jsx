import { Form,Input } from 'antd';
import React, { useState, useEffect } from 'react'
import {  Button, Container,Row,Col } from 'react-bootstrap';
import { useDispatch,useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import home from "../assets/home.jpeg";

const NewPasswordScreen = () => {
  const { id } = useParams();
  const { token } = useParams();

  const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)
    
    const dispatch = useDispatch()


  const submitPasswordHandler = (values) => {
    console.log("submitted ",values);
    const { password,confirmpassword } = values;

    if (password !== confirmpassword) {
      setMessage('Passwords do not match')
    }
    else{

    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div style={{ boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px', padding: '20px',borderRadius: "20px", width: '800px',  background: "#294A70" }} className='card'>

    <Row>
        <Col md={12} className='text-center'>
        <h1 style={{ color: "white" }}>Library Management System</h1>
         
        </Col>

        <Col md={6}>

    <div className="entry-content my-4">
      <div className="woocommerce">
        <div className="woocommerce-notices-wrapper"></div>    

        <Form
            initialValues={{ remember: true }}
            onFinish={submitPasswordHandler}
            layout="vertical"
            name="basic"
            labelCol={{
              span: 32,
            }}
            wrapperCol={{
              span: 32,
            }}
          
            onFinishFailed={onFinishFailed}
            autoComplete="off"
  >
    <Form.Item
      label="Password"
      name="password"
      rules={[
        {
          required: true,
          message: 'Please input your password!',
        },
      ]}
    >
      <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
      />
    </Form.Item>


    <Form.Item
      label="Confirm Password"
      name="confirmpassword"
      rules={[
        {
          required: true,
          message: 'Please input your password!',
        },
      ]}
    >
      <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </Form.Item>
 
    <Form.Item
      wrapperCol={{
        offset: 0,
        span: 32,
      }}
    >
      <Button variant='primary' type="submit" className='w-100' htmlType="submit"    style={{
                        border: "solid #535266",
                        background: "#FFB71D",
                        color: "#535266",
                        borderRadius: "40px",
                      }}>
        Reset Password
      </Button>
    </Form.Item>
  </Form>
      </div>
    </div>
    </Col>

    <Col md={6}>
    <img
              style={{ position: "relative", right: "4%", borderRadius: "40px" }}
              src={home}
              alt=""
              className="w-100"
            />
          </Col>
    </Row>
    </div>
    </Container>
  );
};

export default NewPasswordScreen;
