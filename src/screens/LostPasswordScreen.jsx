import { Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRequestPasswordResetMutation, useResetPasswordMutation } from '../features/userApi';  // Make sure to import the correct API hook

import { Button, Col, Container, Row } from 'react-bootstrap';
import home from "../assets/home.jpeg";

const LostPasswordScreen = () => {
  const key = 'updatable';
  const [email, setEmail] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [requestPasswordReset, { isLoading }] = useRequestPasswordResetMutation();  // Mutation hook for API call

  const submitPasswordHandler = async (values) => {
    try {
      const { Email } = values;

      const response = await requestPasswordReset({ email: Email }).unwrap(); // Making the API call

      message.success({
        content: 'Password reset email has been sent!',
        key,
        duration: 2,
      });
    } catch (error) {
      message.error(
        error.data?.message || 'Failed to reset password.'
      );
    }
  };

  useEffect(() => {
    let timer;
    if (buttonDisabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            setButtonDisabled(false);
            clearInterval(timer);
            return 10;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [buttonDisabled]);

  return (
    <Container
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "100vh" }}
    >
      <div
        style={{
          boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
          padding: '20px',
          width: '800px',
          background: "#294A70",
          borderRadius: "20px"
        }}
        className='card'
      >
        <Row>
          <Col md={12} className="text-center">
            <h1 style={{ color: "white" }}>Library Management System</h1>
          </Col>

          <Col md={6}>
            <p className="text-light">
              Lost your password? Please enter your username or email address. You will receive a
              link to create a new password via email.
            </p>
            <div className="entry-content my-4">
              <div className="woocommerce">
                <div className="woocommerce-notices-wrapper"></div>

                {buttonDisabled && (
                  <p style={{ textAlign: 'center', color: 'gray' }}>
                    Button disabled for {countdown} seconds
                  </p>
                )}

                <Form
                  initialValues={{ remember: true }}
                  onFinish={submitPasswordHandler}
                  layout="vertical"
                  name="basic"
                  labelCol={{
                    span: 32,
                  }}
                  wrapperCol={{
                    span: 24,
                  }}
                  autoComplete="off"
                >
                  <Form.Item
                    wrapperCol={{
                      offset: 0,
                      span: 32,
                    }}
                    label="Email address"
                    name="Email"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your email!',
                        type: 'email',
                      },
                    ]}
                  >
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Form.Item>

                  <Form.Item
                    wrapperCol={{
                      offset: 0,
                      span: 32,
                    }}
                  >
                    <Button
                      variant="primary"
                      className="w-100"
                      type="primary"
                      htmlType="submit"
                      disabled={buttonDisabled || isLoading}
                      style={{
                        border: "solid #535266",
                        background: "#FFB71D",
                        color: "#535266",
                        borderRadius: "40px",
                      }}
                    >
                      {isLoading ? 'Sending...' : 'Reset Password'}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </Col>

          <Col md={6} style={{ display: "flex", justifyContent: "center" }}>
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

export default LostPasswordScreen;
