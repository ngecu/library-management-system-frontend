import React from 'react';
import { useSubmitSuggestionMutation, useFetchSuggestionsQuery } from '../../features/suggestionApi'; // Adjust the path as needed
import { Form, Input, Button, Alert, notification, List, Tabs } from 'antd';
import userImg from '../../assets/user.png'
import { useCreateRequestMutation, useFetchRequestsQuery } from '../../features/requestApi';
const { TabPane } = Tabs;
const Suggestion = () => {
  // Fetch all suggestions
  const { data: suggestions, isLoading: isLoadingSuggestions, isError: isSuggestionsError } = useFetchSuggestionsQuery();
  const { data: requests, isLoading, isError } = useFetchRequestsQuery();
  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();

  // Handle suggestion submission
  const [submitSuggestion, { isLoading: isSubmitting, error: submitError }] = useSubmitSuggestionMutation();

  const handleFinishSuggestion = async (values) => {
    try {
      await submitSuggestion(values).unwrap();
      notification.success({
        message: 'Suggestion Submitted',
        description: 'Your suggestion has been submitted successfully.',
      });
    } catch (err) {
      notification.error({
        message: 'Submission Failed',
        description: 'Failed to submit your suggestion. Please try again.',
      });
    }
  };

  const handleFinishRequest = async (values) => {
    try {
      await createRequest(values).unwrap();
      notification.success({
        message: 'Request Submitted',
        description: 'Your book request has been submitted successfully.',
      });
      form.resetFields(); // Reset form fields after submission
    } catch (err) {
      notification.error({
        message: 'Request Submission Failed',
        description: 'Failed to submit your book request. Please try again.',
      });
    }
  };

  if (isLoadingSuggestions) return <div>Loading suggestions...</div>;
  if (isSuggestionsError) return <Alert message="Error fetching suggestions." type="error" />;
  const userDetails = JSON.parse(localStorage.getItem('login'))

  return (
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
        {userDetails._id}
        <br/>
         <b> Name </b>: {userDetails.name}
         <br/>
         <b> Role </b>: {userDetails.role}

         <br/>
          
       
        </div>
      
    </section>
</body>
          </div>
                </div>

        <div className="col-md-8">
        <Tabs defaultActiveKey="1">
            <TabPane tab="Submit Suggestion" key="1">
              <h2>Submit a Suggestion</h2>
              <Form layout="vertical" onFinish={handleFinishSuggestion}>
                <Form.Item
                  label="Suggestion"
                  name="suggestion"
                  rules={[{ required: true, message: 'Please input your suggestion!' }]}
                >
                  <Input.TextArea rows={4} placeholder="Enter your suggestion here..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={isSubmitting}>
                    Submit
                  </Button>
                </Form.Item>
                {submitError && <Alert message="Failed to submit suggestion." type="error" />}
              </Form>
            </TabPane>

            <TabPane tab="Request a Book" key="2">
              <h2>Request a Book</h2>
              <Form layout="vertical" onFinish={handleFinishRequest}>
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: 'Please input the book title!' }]}
                >
                  <Input placeholder="Enter the book title" />
                </Form.Item>
                <Form.Item
                  label="Author"
                  name="author"
                  rules={[{ required: false }]}
                >
                  <Input placeholder="Enter the author’s name (optional)" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit Request
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </div>

      
      </div>
    </div>
  );
};

export default Suggestion;
