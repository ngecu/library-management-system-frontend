import React, { useState } from 'react';
import { useFetchSuggestionsQuery, useDeleteSuggestionMutation } from '../../features/suggestionApi'; // Adjust the path as needed
import { Table, Button, Popconfirm, notification, Alert } from 'antd';

const AdminSuggestionBox = () => {
  const { data: suggestions, isLoading, isError } = useFetchSuggestionsQuery();
  const [deleteSuggestion] = useDeleteSuggestionMutation();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Handle deletion of a suggestion
  const handleDelete = async (id) => {
    try {
      await deleteSuggestion(id).unwrap();
      notification.success({
        message: 'Suggestion Deleted',
        description: 'The suggestion has been deleted successfully.',
      });
    } catch (error) {
      notification.error({
        message: 'Deletion Failed',
        description: 'Failed to delete the suggestion. Please try again.',
      });
    }
  };

  // Columns for the data grid table
  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Suggestion',
      dataIndex: 'suggestion',
      key: 'suggestion',
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user) => user?.name || 'Anonymous',
    },
 
  ];

  // Handle row selection
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  if (isLoading) return <div>Loading suggestions...</div>;
  if (isError) return <Alert message="Error fetching suggestions." type="error" />;

  return (
    <div className="container-fluid">
      <h2>Admin Suggestion Box</h2>
      <Table
        rowKey="_id"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={suggestions}
        pagination={{ pageSize: 10 }} // Paginate if there are many suggestions
      />
    </div>
  );
};

export default AdminSuggestionBox;
