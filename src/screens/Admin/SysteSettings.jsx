import React from 'react';
import { useGetSystemSettingsQuery, useUpdateSystemSettingsMutation } from '../../features/systemSettingsApi'; // Adjust the path as needed
import { Form, Input, Button, Alert, notification, Switch } from 'antd';
import { Col, Row } from 'react-bootstrap';
import { useExportDatabaseQuery } from '../../features/exportApi';

const SystemSettings = () => {
  const { data: settings, isLoading, isError } = useGetSystemSettingsQuery();
  const [updateSystemSettings, { isLoading: isUpdating, error }] = useUpdateSystemSettingsMutation();

  const { data, refetch } = useExportDatabaseQuery();

  const handleExport = async () => {
    try {
      const response = await refetch();
      const blob = await response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'database_export.zip'); // Specify the filename
      document.body.appendChild(link);
      link.click();
      link.remove();
      notification.success({
        message: 'Export Successful',
        description: 'The database has been exported successfully.',
      });
    } catch (error) {
      notification.error({
        message: 'Export Failed',
        description: 'Failed to export the database. Please try again.',
      });
    }
  };

  const handleFinish = async (values) => {
    try {
      await updateSystemSettings(values).unwrap();
      notification.success({
        message: 'Settings Updated',
        description: 'System settings have been updated successfully.',
      });
    } catch (err) {
      notification.error({
        message: 'Update Failed',
        description: 'Failed to update system settings. Please try again.',
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <Alert message="Error fetching system settings." type="error" />;

  return (
    <div className="container-fluid">
      <div className="settings-page">
       
        <Form
          layout="vertical"
          initialValues={{
            notificationSettings: {
              emailNotifications: settings?.notificationSettings?.emailNotifications,
              smsNotifications: settings?.notificationSettings?.smsNotifications,
              pushNotifications: settings?.notificationSettings?.pushNotifications,
            },
            userSettings: {
              timezone: settings?.userSettings?.timezone,
              dateFormat: settings?.userSettings?.dateFormat,
              timeFormat: settings?.userSettings?.timeFormat,
            },
            securitySettings: {
              passwordMinLength: settings?.securitySettings?.passwordMinLength,
              maxLoginAttempts: settings?.securitySettings?.maxLoginAttempts,
              accountLockDuration: settings?.securitySettings?.accountLockDuration,
            },
            borrowingLimits: {
              maxBooksPerPatron: settings?.borrowingLimits?.maxBooksPerPatron,
              borrowingDurationDays: settings?.borrowingLimits?.borrowingDurationDays,
              renewalLimit: settings?.borrowingLimits?.renewalLimit,
            },
            appName: settings?.appName,
            appVersion: settings?.appVersion,
            maintenanceMode: settings?.maintenanceMode || false,
            defaultLanguage: settings?.defaultLanguage,
            theme: settings?.theme,
          }}
          onFinish={handleFinish}
        >
            <Row>
                <Col md={6}>
                <h3>System Settings</h3>
                <Form.Item
            label="Application Name"
            name="appName"
            rules={[{ required: true, message: 'Please input the application name!' }]}
          >
            <Input placeholder="Enter application name" disabled />
          </Form.Item>

          <Form.Item
            label="Application Version"
            name="appVersion"
            rules={[{ required: true, message: 'Please input the application version!' }]}
          >
            <Input placeholder="Enter application version" disabled />
          </Form.Item>

          <Form.Item
            label="Maintenance Mode"
            name="maintenanceMode"
            valuePropName="checked"
          >
            <Switch /> Enable Maintenance Mode
          </Form.Item>
                </Col>
         
                <Col md={6}>
                
          <h3>User Settings</h3>
          <Form.Item label="Timezone" name={['userSettings', 'timezone']} rules={[{ required: true, message: 'Please select timezone!' }]}>
            <Input placeholder="Enter timezone" disabled />
          </Form.Item>
          <Form.Item label="Date Format" name={['userSettings', 'dateFormat']} rules={[{ required: true, message: 'Please enter date format!' }]}>
            <Input placeholder="Enter date format" disabled />
          </Form.Item>
          <Form.Item label="Time Format" name={['userSettings', 'timeFormat']} rules={[{ required: true, message: 'Please enter time format!' }]}>
            <Input placeholder="Enter time format" disabled />
          </Form.Item>
                </Col>
                <Col md={6}>
                
          <h3>Security Settings</h3>
          <Form.Item label="Minimum Password Length" name={['securitySettings', 'passwordMinLength']} rules={[{ required: true, message: 'Please enter minimum password length!' }]}>
            <Input type="number" placeholder="Enter minimum password length" />
          </Form.Item>
          <Form.Item label="Max Login Attempts" name={['securitySettings', 'maxLoginAttempts']} rules={[{ required: true, message: 'Please enter max login attempts!' }]}>
            <Input type="number" placeholder="Enter max login attempts" />
          </Form.Item>
          <Form.Item label="Account Lock Duration (min)" name={['securitySettings', 'accountLockDuration']} rules={[{ required: true, message: 'Please enter account lock duration!' }]}>
            <Input type="number" placeholder="Enter account lock duration" />
          </Form.Item>
                </Col>

                <Col md={6}>
                <h3>Borrowing Limits</h3>
          <Form.Item label="Max Books Per Patron" name={['borrowingLimits', 'maxBooksPerPatron']} rules={[{ required: true, message: 'Please enter max books per patron!' }]}>
            <Input type="number" placeholder="Enter max books per patron" />
          </Form.Item>
          <Form.Item label="Borrowing Duration (days)" name={['borrowingLimits', 'borrowingDurationDays']} rules={[{ required: true, message: 'Please enter borrowing duration!' }]}>
            <Input type="number" placeholder="Enter borrowing duration in days" />
          </Form.Item>
          <Form.Item label="Renewal Limit" name={['borrowingLimits', 'renewalLimit']} rules={[{ required: true, message: 'Please enter renewal limit!' }]}>
            <Input type="number" placeholder="Enter renewal limit" />
          </Form.Item>
                </Col>
            </Row>
     




      

          <Form.Item>
            <Button style={{ background: "#FFB71D", color: "#535266" }} htmlType="submit" loading={isUpdating}>
              Update Settings
            </Button>
          </Form.Item>

          <Button onClick={handleExport} loading={isLoading}>
      Manual Local Backup
    </Button>

          {error && <Alert message="Failed to update settings." type="error" />}
        </Form>
      </div>
    </div>
  );
};

export default SystemSettings;
