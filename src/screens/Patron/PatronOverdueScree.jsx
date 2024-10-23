import React, { useEffect, useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FaEye, FaTrashAlt, FaPrint, FaSearch } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';
import { IoCloudDownloadSharp } from "react-icons/io5";
import { Drawer, Modal, Spin } from 'antd';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Ensure AutoTable is imported for PDF
import { useBorrowBookMutation, useReturnBookMutation, useRenewBookMutation, useFetchOverdueQuery } from '../../features/transactionApi';
import { notification } from 'antd';

const PatronOverdueScreen = () => {
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [renewBookId, setRenewBookId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: transactions = [], isLoading } = useFetchOverdueQuery();
  const [borrowBook] = useBorrowBookMutation();
  const [returnBook] = useReturnBookMutation();
  const [renewBook] = useRenewBookMutation();

  // Notification
  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
      duration: 3,
    });
  };

  
// Prepare the data for DataGrid
const transactionsWithFormattedData = transactions.map(transaction => ({
    id: transaction._id,  // Ensure each row has a unique id
    userName: transaction.user.name,
    bookTitle: transaction.bookCopy.book.title,
    borrowedAt: transaction.borrowedAt,
    dueDate: transaction.dueDate,
    fineAmount: transaction.fineAmount,
  }));
  
  // Set filtered transactions state
  const [filteredTransactions, setFilteredTransactions] = useState(transactionsWithFormattedData);
  
  // Update the effect hook to filter on the formatted transactions
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTransactions(transactionsWithFormattedData);
    } else {
      const filtered = transactionsWithFormattedData.filter(transaction =>
        transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  }, [searchQuery, transactions]);
  
  

  // Generate PDF
  const generatePDF = (transactions) => {
    const doc = new jsPDF();
    const tableRows = [];

    const columns = [
      { header: 'Transaction ID', field: 'transactionId' },
      { header: 'User ID', field: 'userId' },
      { header: 'Amount', field: 'amount' },
      { header: 'Date', field: 'date' },
      { header: 'Status', field: 'status' }
    ];

    transactions.forEach((transaction) => {
      const rowArray = [];
      columns.forEach((column) => {
        rowArray.push(transaction[column.field]);
      });
      tableRows.push(rowArray);
    });

    doc.autoTable(columns.map(col => col.header), tableRows, { theme: 'grid' });
    doc.save('Transactions_List.pdf');
  };

  // Generate CSV
  const generateCSV = (transactions) => {
    const SEPARATOR = ',';
    let csvContent = 'data:text/csv;charset=utf-8,';
    const headers = ['Transaction ID', 'User ID', 'Amount', 'Date', 'Status'];

    csvContent += headers.join(SEPARATOR) + '\r\n';

    transactions.forEach((transaction) => {
      const rowArray = [
        transaction.transactionId,
        transaction.userId,
        transaction.amount,
        transaction.date,
        transaction.status,
      ];
      csvContent += rowArray.join(SEPARATOR) + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Transactions_List.csv');
    document.body.appendChild(link);
    link.click();
  };

  // Handle drawer visibility for editing
  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowEditDrawer(true);
  };

  // Handle drawer visibility for viewing
  const handleView = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailDrawer(true);
  };

  // Handle deletion
  const confirmDelete = (transactionId) => {
    setrenewBookId(transactionId);
  };

  const handleDelete = async () => {
    if (renewBookId) {
      await renewBook(renewBookId);
      setrenewBookId(null);
      openNotification('success', 'Success', 'Transaction deleted successfully');
    }
  };

  const columns = [
    { field: 'userName', headerName: 'User Name', width: 200 },
    { field: 'bookTitle', headerName: 'Book', width: 200 },
    { field: 'borrowedAt', headerName: 'Borrow Date', width: 200, valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
    { field: 'dueDate', headerName: 'Return Date', width: 200, valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
    { field: 'fineAmount', headerName: 'Fine Amount', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button variant="info" size="small" onClick={() => handleView(params.row)} style={{ marginRight: 8 }}>
            <FaEye />
          </Button>
          <Button variant="danger" size="small" onClick={() => confirmDelete(params.row.transactionId)}>
            <FaTrashAlt />
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="container-fluid">
            <div className="container-fluid">
        {isLoading ? (
        <div className="text-center my-5">
          <Spin size="large" tip="Loading books..." />
        </div>
      ) : (
        <div className="bg-light">
        <div className="row py-2 px-2">
    <div className="col-8">
      <h2>My Overdue</h2>
      </div>
        <div className="col-4 d-flex align-items-center justify-content-end">
      <div className="search-bar">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search .."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="primary" onClick={() => setSearchQuery('')}>
            <FaSearch />
          </Button>
        </InputGroup>
      </div>
      </div>

      <div className="col-6">
      <div className="export-buttons">
        <Button className='metallic-button' onClick={() => generatePDF(transactions)} style={{ marginRight: 8 }}>
          <FaPrint /> Save PDF
        </Button>
        <Button className='metallic-button' onClick={() => generateCSV(transactions)}>
          <IoCloudDownloadSharp /> Save CSV
        </Button>
      </div>
        </div>

        </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={filteredTransactions} columns={columns} pageSize={10} />
      </div>
   

  

      {/* Drawer for transaction details */}
      <Drawer
        title="Transaction Details"
        visible={showDetailDrawer}
        onClose={() => setShowDetailDrawer(false)}
        width={400}
      >
        {selectedTransaction && (
          <div>
            <p><strong>Transaction ID:</strong> {selectedTransaction.transactionId}</p>
            <p><strong>User ID:</strong> {selectedTransaction.userId}</p>
            <p><strong>Amount:</strong> {selectedTransaction.amount}</p>
            <p><strong>Date:</strong> {selectedTransaction.date}</p>
            <p><strong>Status:</strong> {selectedTransaction.status}</p>
          </div>
        )}
      </Drawer>

      {/* Drawer for editing transaction */}
      <Drawer
        title="Edit Transaction"
        visible={showEditDrawer}
        onClose={() => setShowEditDrawer(false)}
        width={400}
      >
        <Form>
          <Form.Group controlId="transactionId">
            <Form.Label>Transaction ID</Form.Label>
            <Form.Control
              type="text"
              name="transactionId"
              value={selectedTransaction?.transactionId || ''}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={selectedTransaction?.amount || ''}
              onChange={(e) => setSelectedTransaction({ ...selectedTransaction, amount: e.target.value })}
            />
          </Form.Group>

          <Form.Group controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={selectedTransaction?.status || ''}
              onChange={(e) => setSelectedTransaction({ ...selectedTransaction, status: e.target.value })}
            >
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" onClick={async () => {
            await returnBook(selectedTransaction);
            openNotification('success', 'Success', 'Transaction updated successfully');
            setShowEditDrawer(false);
          }}>
            Update Transaction
          </Button>
        </Form>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        visible={!!renewBookId}
        onOk={handleDelete}
        onCancel={() => setrenewBookId(null)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this transaction?</p>
      </Modal>
      </div>)}
    </div>
    </div>
  );
};

export default PatronOverdueScreen;
