import React from 'react';
import { useFetchUserQuery, useUpdateUserProfileMutation } from '../../features/userApi'; // Adjust the path as needed
import { Form, Input, Button, Alert } from 'antd';
import userImg from '../../assets/user.png'
const Profile = () => {
  const userDetails = JSON.parse(localStorage.getItem('login'))
  const { data: user, isLoading, isError } = useFetchUserQuery();
  const [updateUserProfile, { isLoading: isUpdating, error }] = useUpdateUserProfileMutation();

  const handleFinish = async (values) => {
    await updateUserProfile(values).unwrap();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <Alert message="Error fetching user data." type="error" />;

  return (
    <div className="container-fluid">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-4">
                <div className="profile-page">
          <body>
    <section class="profile-card">
        <div class="image">
            <img src={userImg} alt="user image"/>
        </div>
        <div class="text-data">
            <h2>{userDetails.name}</h2>
            <p>{userDetails.role} </p>
        </div>
      
    </section>
</body>
          </div>
                </div>
                <div className="col-md-8">
          <div className="profile-page">
            <h2>User Profile</h2>
            <Form
              layout="vertical"
              initialValues={{
                name: user.name,
                email: user.email,
                studentID: user.studentID || '',
                password: '', // Initialize password field
              }}
              onFinish={handleFinish}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: false, message: 'Please input your name!' }]}
              >
                <Input placeholder={user.name} disabled /> {/* Disabled field */}
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: false, message: 'Please input your email!' }]}
              >
                <Input placeholder={user.email} disabled /> {/* Disabled field */}
              </Form.Item>

              <Form.Item
                label="Student ID"
                name="studentID"
              >
                <Input placeholder="Enter your Student ID (optional)" disabled />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>

              <Form.Item>
                <Button style={{background:"#FFB71D",color:"#535266"}} htmlType="submit" loading={isUpdating}>
                  Update Profile
                </Button>
              </Form.Item>

              {error && <Alert message="Failed to update profile." type="error" />}
            </Form>
          </div>
        </div>
              </div>
         
    </div>
    </div>
  );
};

export default Profile;
