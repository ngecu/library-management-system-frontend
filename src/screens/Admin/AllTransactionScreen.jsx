import React, { useEffect, useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FaEye, FaTrashAlt, FaPrint, FaSearch } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';
import { IoCloudDownloadSharp } from "react-icons/io5";
import { Drawer, Modal, Spin } from 'antd';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Ensure AutoTable is imported for PDF
import { useFetchTransactionsQuery, useBorrowBookMutation, useReturnBookMutation, useRenewBookMutation } from '../../features/transactionApi';
import { notification } from 'antd';

const AllTransactions = () => {
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [renewBookId, setRenewBookId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: transactions = [], isLoading } = useFetchTransactionsQuery();
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
function formatReadableDate(isoDate) {
  const date = new Date(isoDate);

  const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const suffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
      }
  };

  return `${day}${suffix(day)} ${month} ${year}`;
}

// Mapping transactions with formatted dates
const transactionsWithFormattedData = transactions.map(transaction => ({
  id: transaction._id,  // Unique id for each row
  userName: transaction.user.name,
  bookTitle: transaction.bookCopy.book.title,
  borrowedAt: formatReadableDate(transaction.borrowedAt),  // Format borrowedAt
  dueDate: formatReadableDate(transaction.dueDate),        // Format dueDate
  returnDate: transaction.returnedAt 
    ? formatReadableDate(transaction.returnedAt) // Format returnDate if it exists
    : 'Not yet', 
  fineAmount: transaction.fineAmount ? `$${transaction.fineAmount.toFixed(2)}` : 'No fine', // Format fine amount
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
    }, [searchQuery, transactionsWithFormattedData]);
  
  

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const tableRows = [];
  
    const columns = [
      { header: 'User Name', field: 'userName' },
      { header: 'Book Title', field: 'bookTitle' },
      { header: 'Borrow Date', field: 'borrowedAt' },
      { header: 'Due Date', field: 'dueDate' },
      { header: 'Return Date', field: 'returnDate' },
      { header: 'Fine Amount', field: 'fineAmount' }
    ];
  
    filteredTransactions.forEach((transaction) => {
      const rowArray = columns.map((column) => transaction[column.field] || ''); // Add a default value if undefined
      tableRows.push(rowArray);
    });
  
    // Check the structure of tableRows
    console.log(tableRows);
  
    doc.autoTable({
      head: [columns.map(col => col.header)], // Use `head` instead of mapping headers separately
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 10 }, // Optional: Adjust font size
      margin: { top: 20 } // Optional: Adjust margins if needed
    });
  
    doc.save('Transactions_List.pdf');
  };
  

  const generateCSV = () => {
    const SEPARATOR = ',';
    let csvContent = 'data:text/csv;charset=utf-8,';
    const headers = ['User Name', 'Book Title', 'Borrow Date', 'Due Date', 'Return Date', 'Fine Amount'];
  
    csvContent += headers.join(SEPARATOR) + '\r\n';
  
    filteredTransactions.forEach((transaction) => {
      const rowArray = [
        transaction.userName,
        transaction.bookTitle,
        transaction.borrowedAt,
        transaction.dueDate,
        transaction.returnDate,
        transaction.fineAmount,
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
    { field: 'id', headerName: 'id', width: 200 },
    { field: 'userName', headerName: 'User Name', width: 200 },
    { field: 'bookTitle', headerName: 'Book', width: 200 },
    { field: 'borrowedAt', headerName: 'Borrow Date', width: 200 },
    { field: 'dueDate', headerName: 'Due Date', width: 200 },
    { field: 'returnDate', headerName: 'Return Date', width: 200 },
    { field: 'fineAmount', headerName: 'Fine Amount', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button variant="info" size="small" onClick={() => console.log("update clicked")} style={{ marginRight: 8 }}>
            Check Fine
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
      <h2>All Loan History</h2>
      </div>
        <div className="col-4 d-flex align-items-center justify-content-end">
      <div className="search-bar">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search by Patron or Book"
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

export default AllTransactions;
