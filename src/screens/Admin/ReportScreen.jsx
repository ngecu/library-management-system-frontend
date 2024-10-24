import React, { useEffect, useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FaEye, FaTrashAlt, FaPrint, FaSearch } from 'react-icons/fa';
import { Drawer, Modal, Spin } from 'antd';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Ensure AutoTable is imported for PDF
import { useFetchTransactionsQuery, useBorrowBookMutation, useReturnBookMutation, useRenewBookMutation } from '../../features/transactionApi';
import { notification } from 'antd';
import { Column, Gauge, Line } from '@ant-design/plots';
import client from '../../assets/client.png'

const ReportScreen = () => {
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
      <h2>Reports Page</h2>
      </div>
       
        </div>

     
<div className="row">
  <div class="col-xl-6 col-md-12 mb-4 h-100">
          <div class="card h-100">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col mr-2">
                  <div class="text-xs text-white font-weight-bold text-uppercase mb-1">BOOKS/BORROW RATIO</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                  <div class="mt-2 mb-0 text-muted text-xs">
                  
                  </div>
                </div>
                <div class="col-auto">
                <DemoGauge />
                  
                </div>
              </div>
            </div>
          </div>
        </div>

       <div class="col-xl-6 col-md-12 mb-4 h-100">
         <div class="card h-100" style={{background:"white"}}>
           <div class="card-body">
             <div class="row align-items-center">
               <div class="col mr-2">
                 <div class="text-xs text-dark font-weight-bold text-uppercase mb-1">MOST BORROWED BOOKS</div>
                 <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                 <div class="mt-2 mb-0 text-muted text-xs">
                 
                 </div>
               </div>
               <div class="col-auto">
               <DemoColumn />
                
               </div>
             </div>
           </div>
         </div>
       </div>

       <div class="col-xl-6 col-md-12 mb-4 h-100">
         <div class="card h-100" style={{background:"white"}}>
           <div class="card-body">
             <div class="row align-items-center">
               <div class="col mr-2">
                 <div class="text-xs text-dark font-weight-bold text-uppercase mb-1">LOAN VISUALIZATION</div>
                 <div class="h5 mb-0 font-weight-bold text-gray-800"></div>
                 <div class="mt-2 mb-0 text-muted text-xs">
                 
                 </div>
               </div>
               <div class="col-auto">
               <DemoLine />
                
               </div>
             </div>
           </div>
         </div>
       </div>

       <div class="col-xl-6 col-md-12 mb-4 h-100">
         <div class="card h-100">
           <div class="card-body">
             <div class="row align-items-center">
               <div class="col mr-2">
                 <div class="text-xs text-white font-weight-bold text-uppercase mb-1">CLIENT PREFERENCE</div>
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

export default ReportScreen;





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
      textContent: (target, total) => `${target}\n ${(target / total) * 100}%`,
    },
  };
  return <Gauge {...config} />;
};



const DemoColumn = () => {
  // Updated data to represent book titles
  const data = [
    { type: 'The Alchemist', value: 0.16 },
    { type: 'The Great Gatsby', value: 0.125 },
    { type: '1984', value: 0.24 },
    { type: 'To Kill a Mockingbird', value: 0.19 },
    { type: 'Moby Dick', value: 0.22 },
    { type: 'War and Peace', value: 0.05 },
    { type: 'Pride and Prejudice', value: 0.01 },
    { type: 'The Catcher in the Rye', value: 0.015 },
  ];

  const config = {
    data,
    xField: 'type',
    yField: 'value',
    xAxis: {
      title: {
        text: 'Book Titles',
        style: {
          fill: '#FFFFFF', // Set X-axis title color to white
        },
      },
      label: {
        style: {
          fill: '#FFFFFF', // Set X-axis labels color to white
        },
      },
    },
    yAxis: {
      title: {
        text: 'Value',
        style: {
          fill: '#FFFFFF', // Set Y-axis title color to white
        },
      },
      label: {
        style: {
          fill: '#FFFFFF', // Set Y-axis labels color to white
        },
        formatter: (v) => `${(v * 100).toFixed(0)}%`, // Display percentage
      },
    },
    style: {
      fill: ({ type }) => {
        // Change colors based on the book type
        if (type === 'Pride and Prejudice' || type === 'The Catcher in the Rye') {
          return '#22CBCC';
        }
        return '#2989FF';
      },
    },
    label: {
      text: (originData) => {
        const val = parseFloat(originData.value);
        if (val < 0.05) {
          return (val * 100).toFixed(1) + '%'; // Show labels for values less than 5%
        }
        return '';
      },
      offset: 10,
    },
    tooltip: {
      showTitle: true,
      shared: true,
      showMarkers: false,
      itemTpl: `<li><span style="color:{color};">{name}: {value}</span></li>`, // Customize tooltip
    },
    legend: {
      position: 'top-right',
      itemName: {
        style: {
          fill: '#FFFFFF', // Set legend text color to white
        },
      },
    },
  };

  return (
    <div>
      <Column {...config} />
    </div>
  );
};


const DemoLine = () => {
  const data = [
    { year: '04th Jul 2024', value: 3 },
    { year: '14th Jul 2024', value: 4 },
    { year: '24th Jul 2024', value: 3.5 },
    { year: '04th Sep 2024', value: 5 },
    { year: '14th Sep 2024', value: 4.9 },
    { year: '24th Sep 2024', value: 6 },
    { year: '04th Oct 2024', value: 7 },
    { year: '14th Oct 2024', value: 9 },
    { year: '24th Oct 2024', value: 13 },
  ];
  const config = {
    data,
    xField: 'year',
    yField: 'value',
    point: {
      shapeField: 'square',
      sizeField: 4,
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
    },
  };
  return <Line {...config} />;
};