import { Form, Input, Spin } from 'antd';
import React, { useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import home from "../assets/home.jpeg";
import { notification } from 'antd';
import { useResetPasswordMutation } from '../features/userApi'; 

const openNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'topRight',
    duration: 3,
  });
};

const NewPasswordScreen = () => {
  const { id, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  // Initialize mutation hook
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const submitPasswordHandler = async (values) => {
    const { password, confirmpassword } = values;

    // Check if passwords match
    if (password !== confirmpassword) {
      openNotification('error', 'Password Mismatch', "Passwords do not match");
      return;
    }

    try {
      // Send the reset password request
      await resetPassword({ token, newPassword: password }).unwrap();
      openNotification('success', 'Password Reset', 'Your password has been reset successfully!');
    } catch (error) {
      openNotification('error', 'Reset Failed', error.data?.message || 'An error occurred while resetting the password');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin spinning={isLoading}>
      <div 
  style={{
    boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
    padding: '20px',
    width: '100%',
    maxWidth: '800px',
    background: "#294A70",
    borderRadius: "20px",
  }}      
      className='card'>
        <Row>
          <Col md={12} className='text-center'>
            <h1 style={{ color: "white" }}>Library Management System</h1>
          </Col>

          <Col md={6}>
            <div className="entry-content my-4">
              <Form
                initialValues={{ remember: true }}
                onFinish={submitPasswordHandler}
                layout="vertical"
                name="basic"
                labelCol={{ span: 32 }}
                wrapperCol={{ span: 32 }}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirmpassword"
                  rules={[{ required: true, message: 'Please confirm your password!' }]}
                >
                  <Input.Password value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 0, span: 32 }}>
                  <Button variant='primary' type="submit" className='w-100' htmlType="submit" style={{
                    border: "solid #535266",
                    background: "#FFB71D",
                    color: "#535266",
                    borderRadius: "40px",
                  }}>
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>

          <Col md={6} className="d-none d-md-flex" style={{ justifyContent: "center" }}>
              <img
                style={{ position: "relative", right: "4%", borderRadius: "40px" }}
                src={home}
                alt=""
                className='w-100'
              />
            </Col>
        </Row>
      </div>
      </Spin>
    </Container>
  );
};

export default NewPasswordScreen;
