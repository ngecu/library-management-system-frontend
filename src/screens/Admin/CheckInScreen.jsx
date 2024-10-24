import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select, Spin, Steps, Result } from 'antd';
import { useFetchUsersQuery } from '../../features/userApi';
import useScanDetection from "use-scan-detection";
import { Card, Col, Row } from 'react-bootstrap';
import { Html5QrcodeScanner } from "html5-qrcode";
import book from '../../assets/book.png'
import { useFetchTransactionsByUserQuery, useReturnBookMutation } from '../../features/transactionApi';
import { useFetchBookCopiesQuery } from '../../features/booksApi';
import Barcode from 'react-barcode';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

const CheckInScreen = () => {
  const [returnBook, { isLoading }] = useReturnBookMutation();
  const [form] = Form.useForm();
  const navigate = useNavigate()

  const { data: books, isLoading: booksLoading } = useFetchBookCopiesQuery();
  const { data: users, isLoading: usersLoading } = useFetchUsersQuery();

  const [availableCopies, setAvailableCopies] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [code, setCode] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [current, setCurrent] = useState(0);
  
  const { Step } = Steps;

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = [
    { key: 'Check Patron', title: 'Check Patron' },
    { key: 'Scan Bar Code', title: 'Scan Bar Code' },
    { key: 'Check Out', title: 'Check Out' }
  ];

  useScanDetection({
    onComplete: setCode
  });

  useEffect(() => {
    if (current === 1) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      html5QrcodeScanner.render(onScanSuccess, onScanFailure);

      return () => {
        html5QrcodeScanner.clear();
      };
    }
  }, [current]);

  // Handle book selection
  const handleBookSelect = (bookId) => {
    const selected = books.find(book => book.id === bookId);
    setSelectedBook(selected);

    if (selected) {
      setAvailableCopies(selected.copies.filter(copy => !copy.isAvailable));
    }
  };

  // Handle user selection
  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  // Inside the component
const today = new Date();
const twoWeeksFromToday = new Date(today);
twoWeeksFromToday.setDate(today.getDate() + 14);

// Format the dates
const formatDate = (date) => {
  return date.toISOString().split('T')[0]; // Formats date as YYYY-MM-DD
};

const { data: userTransactions, isLoading: transactionsLoading, error } = useFetchTransactionsByUserQuery(selectedUser, { skip: !selectedUser });
console.log("userTransactions ",userTransactions);

// Effect to handle userTransactions changes
useEffect(() => {
  if (userTransactions) {
    console.log("User Transactions Updated: ", userTransactions);
    setErrorMessage(null); // Clear any previous error messages
  }
}, [userTransactions]);
  
 // Handle API errors
 useEffect(() => {
  if (error) {
    if (error.status === 404) {
      setErrorMessage("User transactions not found.");
    } else {
      setErrorMessage("An error occurred while fetching transactions.");
    }
  }
}, [error]); // This effect runs whenever the error changes

  const onScanSuccess = (decodedText) => {
    console.log(decodedText);
    setCode(decodedText);
  
    // Find the selected book copy based on the scanned code
    const selectedCopy = books.find(
      (copy) => copy._id === decodedText && !copy.isAvailable
    );
  
    if (selectedCopy) {
      setSelectedBook(selectedCopy);
  
      // Find the transaction for this user and book copy where the book is not yet returned
      const transaction = userTransactions.find(
        (t) =>
          t.bookCopy._id === selectedCopy._id &&
          !t.isReturned
      );
  
      if (transaction) {
        setSelectedTransaction(transaction);
      } else {
        message.error("No active transaction found for this book and user.");
      }
    } else {
      message.error("Invalid or unavailable book copy.");
    }
  };
  
  

  const onScanFailure = (error) => {
    console.warn(`Code scan error = ${error}`);
  };

  const hasNextButton = () => {
    if (current === 0) {
      if (!selectedUser || !userTransactions || error) return false;
  
      const hasActiveTransaction = userTransactions.some(transaction => !transaction.returned);
      
      return hasActiveTransaction;
    }
     else if (current === 1) {
      if (!code || !books.some(copy => copy._id === code && !copy.isAvailable)) return false;
    }

    return true;
  };

  const onFinish = async () => {
    if (!selectedTransaction) {
      message.error("No transaction selected.");
      return;
    }
  
    try {
      const result = await returnBook(selectedTransaction._id).unwrap();
      message.success(result.message);
      form.resetFields();
      setAvailableCopies([]);
      setSelectedBook(null);
      setSelectedTransaction(null);
      navigate("/librarian/transactions");
    } catch (error) {
      message.error(error.message || "Failed to return the book");
    }
  };
  

  const stepContents = [
    <div>
      <Select
        style={{ width: "100%" }}
        showSearch
        placeholder="Select a user"
        loading={usersLoading}
        onChange={handleUserSelect}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={users
          ?.filter(user => user.role === 'patron') // Filter for users with role "patron"
          .map(user => ({
            key: user._id,
            label: user.name,
            value: user._id
          }))
        }
      />
{selectedUser && (
  <div style={{ marginTop: '16px' }}>
    {transactionsLoading ? (
      <Spin />
    ) : (
      <>
        {error ? (
          <Result
            status={error.status === 404 ? "404" : "500"}
            title={error.status === 404 ? "404" : "500"}
            subTitle={error.status === 404 ? "User has no loan history." : "An error occurred while fetching transactions."}
          />
        ) : userTransactions ? (
          userTransactions.every(transaction => transaction.isReturned) ? (
            <Result
              status="404"
              title="404"
              subTitle="All books have been returned. No outstanding transactions."
            />
          ) : (
            <Row>
              <Col md={6} style={{ boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px', borderRadius: "20px" }}>
                <section className="box">
                  <div className="content">
                    <div className="left">
                      <div className="reader_img"></div>
                    </div>
                    <div className="right">
                      <div className="product_description">
                        <h4>BORROWER DETAILS</h4>
                        <p><span className="highlight">Name-</span>
                          {users && users.find(user => user._id === selectedUser)?.name}
                        </p>
                        <p><span className="highlight">Email - </span>
                          {users && users.find(user => user._id === selectedUser)?.email}
                        </p>
                        <p><span className="highlight">Student ID -</span>
                          {users && users.find(user => user._id === selectedUser)?.studentID}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </Col>
              <Col md={6} style={{ boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px', borderRadius: "20px" }}>
                <h3>Transaction History</h3>
                {userTransactions.length ? (
                  <ul>
                    {userTransactions.map(transaction => (
                      <li key={transaction._id}>
                        <strong>Book:</strong> {transaction.bookTitle} | <strong>Date:</strong> {new Date(transaction.borrowedAt).toLocaleDateString()} | <strong>Fine Amount:</strong> {transaction.fineAmount}
                        {!transaction.isReturned ? <span style={{ color: 'red' }}> (Not Returned)</span> : <span style={{ color: 'green' }}> (Returned)</span> }
                        {transaction.fineAmount > 0 && (
                          <Button type="danger" onClick={() => handleMpesaPayment(transaction.fineAmount)}>
                            Pay with Mpesa
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No transaction history for this user.</p>
                )}
              </Col>
            </Row>
          )
        ) : (
          <Result
            status="500"
            title="500"
            subTitle="This user doesn't have a book"
          />
        )}
      </>
    )}
  </div>
)}


    </div>,

    <div>
      <div id="reader" width="600px"></div>
      {code && !books.some(copy => copy._id === code && !copy.isAvailable) && (
        <p style={{ color: 'red' }}>Invalid barcode. Please try again.</p>
      )}
    </div>,

    <div>
      <Row>
        <Col md={6} style={{ boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',borderRadius:"20px" }}>

        <section class="box">
  <div class="content">

    <div class="left">
      <div class="reader_img"></div>
    
    </div>

    <div class="right">
      <div class="product_description">
        <h4>BORROWER DETAILS</h4>
        <p><span class="highlight">Name-</span>
        {users &&  users.find(user => user._id === selectedUser)?.name}
        </p>
        <p><span class="highlight">Email - </span>
        {users &&  users.find(user => user._id === selectedUser)?.email}

        </p>
        <p><span class="highlight">Student ID -</span>
        {users &&  users.find(user => user._id === selectedUser)?.studentID}

        </p>
 
      </div>
    </div>

  </div>
</section>

        </Col>
        <Col md={6} style={{ boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',borderRadius:"20px" }}>
         {selectedBook &&
<section class="box">
  <div class="content">

    <div class="left">
      <div class="product_img"></div>
    
    </div>

    <div class="right">
      <div class="product_description">
        <h4>BOOK DETAILS</h4>
        <p><span class="highlight">Title-</span>
        {selectedBook.book.title}
        </p>
        <p><span class="highlight">Author - </span>
           {selectedBook.book.author}
        </p>
        <p><span class="highlight">ISBN -</span>
         {selectedBook.book.isbn} 
        </p>
        <p><span class="highlight">Borrowed On -</span> 
  {formatDate(today)}
</p>
<p><span class="highlight">Due Date -</span> 
  {formatDate(twoWeeksFromToday)}
</p>
      </div>
    </div>

  </div>
</section>
}
        </Col>
      </Row>
    </div>
  ];

  return (
    <>
      <Steps current={current}>
        {items.map((item, index) => (
          <Step
            key={item.key}
            title={item.title}
            style={{
              color: current === index ? '#294A70' : '#8c8c8c',
            }}
            icon={
              <div style={{
                backgroundColor: current === index ? '#294A70' : '#8c8c8c',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white'
              }}>
                {index + 1}
              </div>
            }
          />
        ))}
      </Steps>

      <div>{stepContents[current]}</div>
      <div style={{ marginTop: 24 }}>
      {current < stepContents.length - 1 && (
          <Button type="primary" onClick={next} disabled={!hasNextButton()}>
            Next
          </Button>
        )}

        {current === stepContents.length - 1 && selectedBook && selectedUser && (
          <Button
            type="primary"
            onClick={() => onFinish({ bookCopyId: selectedBook._id, userId: selectedUser })}
          >
            Check In
          </Button>
        )}


        {current > 0 && (
          <Button
            style={{ margin: '0 8px' }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
      </div>
    </>
  );
};

export default CheckInScreen;
