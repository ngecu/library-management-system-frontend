import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { GiBookshelf } from "react-icons/gi";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import { FaAnglesUp } from "react-icons/fa6";
import { MdAutorenew } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import { BsEmojiAngryFill } from "react-icons/bs";
import { AiOutlineTransaction } from "react-icons/ai";
import { 
  useFetchBooksQuery, 
  useAddBookMutation, 
  useUpdateBookMutation, 
  useDeleteBookMutation 
} from '../../features/booksApi';
import { useFetchPatronsQuery, useRegisterMutation } from '../../features/userApi';
import { Gauge } from '@ant-design/plots';
import client from '../../assets/client.png'
import { Modal, Form, Input, Select, Checkbox, notification, Spin } from 'antd';



const IndexAdminScreen = () => {

  const location = useLocation();
  const { pathname } = location;
  const { data: books = [], isLoading: isBooksLoading } = useFetchBooksQuery();
  const { data: patrons = [], isLoading: isPatronsLoading } = useFetchPatronsQuery();
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [isPatron, setIsPatron] = useState(false);
  const [register, { isLoading:isRegistering, isError, isSuccess }] = useRegisterMutation();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form Values:', values);

      // Call the register mutation with the form values
      const response = await register(values).unwrap();

      // Handle success
      console.log('User registered successfully:', response);
      // You can perform further actions here, such as redirecting or showing a success message
      handleCancel(); // Call to close the modal or form
    } catch (errorInfo) {
      console.log('Validation Failed:', errorInfo);

      // Handle mutation error
      if (isError) {
        console.error('Registration failed:', errorInfo);
        // You might want to show an error message to the user
      }
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };


  const userDetails = JSON.parse(localStorage.getItem('login'))

  
const openNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'topRight', // Positioning the notification at the top right
    duration: 3, // Duration to display the notification
  });
};

  const handleAddUserModal = () => {
    if (userDetails.isAdmin) {
      showModal();
    } else {
      openNotification(
        'error', 
        'Permission Denied', 
        "You don't have the necessary permissions to add a user."
      );
    }
  };

  return (
    <div class="container-fluid">

    <div class="row pt-3">
 
        <div class="col-xl-3 col-md-6 mb-4">
          <NavLink to="/librarian/allbooks" className="custom-navlink" style={{textDecoration:"none"}}>
          <div class="card h-100">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Books</div>
                  <div class="h5 mb-0 mr-3 text-white font-weight-bold text-gray-800">{isBooksLoading ? <Spin /> : books.length}</div>
                  <div class="mt-2 mb-0 text-muted text-xs">
                   
                  </div>
                </div>
                <div class="col-auto">
                <GiBookshelf size={64} color="white" />
                </div>
              </div>
            </div>
          </div>
          </NavLink>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
                    <NavLink to="/librarian/checkin" className="custom-navlink" style={{textDecoration:"none"}}>
                        <div class="card h-100">
                          <div class="card-body">
                            <div class="row no-gutters align-items-center">
                              <div class="col mr-2">
                                <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Check In</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                                <div class="mt-2 mb-0 text-muted text-xs">
                              
                                </div>
                              </div>
                              <div class="col-auto">
                              <MdOutlineKeyboardDoubleArrowDown size={64} color="white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </NavLink>
                    </div>

                    <div class="col-xl-3 col-md-6 mb-4">
                    <NavLink to="/librarian/checkout" className="custom-navlink" style={{textDecoration:"none"}}>
                      <div class="card h-100">
                        <div class="card-body">
                          <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                              <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Check Out</div>
                              <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                              <div class="mt-2 mb-0 text-muted text-xs">
                             
                              </div>
                            </div>
                            <div class="col-auto">
                            <FaAnglesUp size={64} color="white" />
                            </div>
                          </div>
                        </div>
                      </div>
                      </NavLink>
                    </div>

                    <div class="col-xl-3 col-md-6 mb-4">
                    <NavLink to="/librarian/patrons" className="custom-navlink" style={{textDecoration:"none"}}>

          <div class="card h-100">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col mr-2">
                  <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Patrons</div>
                  <div class="h5 text-white mb-0 font-weight-bold text-gray-800">{isPatronsLoading ? <Spin/> : patrons.length}</div>
                  <div class="mt-2 mb-0 text-muted text-xs">
                  
                  </div>
                </div>
                <div class="col-auto">
                <FaUsers size={64} color="white"  />
                </div>
              </div>
            </div>
          </div>
          </NavLink>
        </div>

                   

      <div className="col-xl-6 col-md-6 mb-4">
      <div className="row h-100">
       

       <div class="col-xl-6 col-md-6 mb-4 h-100">
         <div class="card h-100">
           <div class="card-body">
             <div class="row align-items-center">
               <div class="col mr-2">
                 <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                 <div class="mt-2 mb-0 text-muted text-xs">
                 
                 </div>
               </div>
               <div class="col-auto">
              <img src={client} style={{width:"100%"}} alt="" />
                
               </div>
             </div>
           </div>
         </div>
       </div>
       <div class="col-xl-6 col-md-6 mb-4 h-100">
         <div class="card h-100">
           <div class="card-body">
             <div class="row align-items-center">
               <div class="col mr-2">
                 <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                 <div class="mt-2 mb-0 text-muted text-xs">
                 
                 </div>
               </div>
               <div class="col-auto">
              <img src={client} style={{width:"100%"}} alt="" />
                
               </div>
             </div>
           </div>
         </div>
       </div>
       </div>
      </div>
      <div className="col-xl-6 col-md-6 mb-4">
        <div className="row">
       

   

        <div class="col-xl-6 col-md-6 mb-4">
        <NavLink to="/librarian/overdue" className="custom-navlink" style={{textDecoration:"none"}}>
          <div class="card h-100">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col mr-2">
                  <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Overdue</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                  <div class="mt-2 mb-0 text-muted text-xs">
                  
                  </div>
                </div>
                <div class="col-auto">
          
                <BsEmojiAngryFill size={64} color="red" />
                </div>
              </div>
            </div>
          </div>
          </NavLink>
        </div>

        <div class="col-xl-6 col-md-6 mb-4">
        <NavLink to="/librarian/transactions" className="custom-navlink" style={{textDecoration:"none"}}>
          <div class="card h-100">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col mr-2">
                  <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Loan History</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                  <div class="mt-2 mb-0 text-muted text-xs">
                  
                  </div>
                </div>
                <div class="col-auto">
                <AiOutlineTransaction size={64} color="white" />
                
                </div>
              </div>
            </div>
          </div>
          </NavLink>
        </div>

        <div class="col-xl-6 col-md-6 mb-4">
        <NavLink to="/librarian/reports" className="custom-navlink" style={{textDecoration:"none"}}>
          <div class="card h-100">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col mr-2">
                  <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Reports</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                  <div class="mt-2 mb-0 text-muted text-xs">
                  
                  </div>
                </div>
                <div class="col-auto">
                <HiDocumentReport size={64} color="white" />
                </div>
              </div>
            </div>
          </div>
          </NavLink>
        </div>

    

        <div class="col-xl-6 col-md-6 mb-4" style={{cursor:"pointer"}} onClick={handleAddUserModal}>
          <div class="card h-100">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col mr-2">
                  <div class="text-xs text-white font-weight-bold text-uppercase mb-1">Add User</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                  <div class="mt-2 mb-0 text-muted text-xs">
                  
                  </div>
                </div>
                <div class="col-auto">
                <FaUserPlus size={64} color="white" />
                </div>
              </div>
            </div>
          </div>
       
        </div>
        </div>
      </div>

        

    </div>

    

    <Modal
  title="Add User"
  visible={visible}
  onOk={handleOk}
  onCancel={handleCancel}
  okText="Submit"
  cancelText="Cancel"
  style={{background:"blue !important"}}
>
  <Form form={form} layout="vertical" className="custom-form-label"   style={{background:"blue !important"}}
  >
    <Form.Item
      label="Name"
      name="name"
      rules={[{ required: true, message: 'Please input the user name!' }]}
    >
      <Input placeholder="Enter name" />
    </Form.Item>

    <Form.Item
      label="Email"
      name="email"
      rules={[{ required: true, message: 'Please input the user email!' }]}
    >
      <Input placeholder="Enter email" />
    </Form.Item>

    <Form.Item
      label="Role"
      name="role"
      rules={[{ required: true, message: 'Please select the role!' }]}
    >
      <Select placeholder="Select a role"  onChange={(value) => setIsPatron(value === 'patron')}>
        <Select.Option value="patron">Patron</Select.Option>
        <Select.Option value="librarian">Librarian</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input the password!' }]}
    >
      <Input.Password placeholder="Enter password" />
    </Form.Item>

    {!isPatron && (
          <Form.Item name="isAdmin" valuePropName="checked">
            <Checkbox>Is Admin</Checkbox>
          </Form.Item>
        )}

    <Form.Item name="isActive" valuePropName="checked">
      <Checkbox>Is Active</Checkbox>
    </Form.Item>


  </Form>
</Modal>


 
    </div>
  );
};

export default IndexAdminScreen;





const DemoGauge = () => {
  const config = {

    autoFit: true,
    data: {
      target: 159,
      total: 400,
      name: 'score',
      thresholds: [100, 200, 400],
    },
    legend: false,
    scale: {
      color: {
        range: ['#F4664A', '#FAAD14', 'green'],
      },
    },
    style: {
      textContent: (target, total) => `得分：${target}\n占比：${(target / total) * 100}%`,
    },
  };
  return <Gauge {...config} />;
};
