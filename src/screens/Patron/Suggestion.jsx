import React from 'react';
import { useSubmitSuggestionMutation, useFetchSuggestionsQuery } from '../../features/suggestionApi'; // Adjust the path as needed
import { Form, Input, Button, Alert, notification, List } from 'antd';
import userImg from '../../assets/user.png'
const Suggestion = () => {
  // Fetch all suggestions
  const { data: suggestions, isLoading: isLoadingSuggestions, isError: isSuggestionsError } = useFetchSuggestionsQuery();

  // Handle suggestion submission
  const [submitSuggestion, { isLoading: isSubmitting, error: submitError }] = useSubmitSuggestionMutation();

  const handleFinish = async (values) => {
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
          <h2>Submit a Suggestion</h2>
          <Form
            layout="vertical"
            onFinish={handleFinish}
          >
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
        </div>

      
      </div>
    </div>
  );
};

export default Suggestion;
