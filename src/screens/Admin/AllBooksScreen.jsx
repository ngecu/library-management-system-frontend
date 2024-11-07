import React, { useEffect, useState } from 'react';
import { Form, Button, ButtonGroup, InputGroup, Row, Col } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrashAlt, FaPrint, FaSearch } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';
import { IoIosAddCircle } from "react-icons/io";
import { IoCloudDownloadSharp } from "react-icons/io5";
import { Drawer, Input, Modal, Popconfirm, Space, Spin, Table, Tabs, Tag } from 'antd';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Ensure you import jsPDF's AutoTable plugin
import { 
  useFetchBooksQuery, 
  useAddBookMutation, 
  useUpdateBookMutation, 
  useDeleteBookMutation 
} from '../../features/booksApi';
import { useFetchGenresQuery } from '../../features/genreApi';
import { notification } from 'antd';
import Barcode from 'react-barcode';
import { useBookBookMutation, useFetchTransactionsByUserQuery } from '../../features/transactionApi';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAddLLCMutation, useDeleteLLCMutation, useFetchLLCsQuery } from '../../features/llcApi';

const AllBooks = () => {
  const [show, setShow] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    llc: '',
    availableCopies: 1,
    totalCopies: 1,
    isAvailable: true,
  });
  const [selectedBook, setSelectedBook] = useState(null); // Store selected book for editing and viewing
  const [deleteBookId, setDeleteBookId] = useState(null); // Store book ID for deletion
  const [deleteCategoryId, setDeleteCategoryId] = useState(null); // Store book ID for deletion
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [bookCopies, setBookCopies] = useState([]);
  const [showPrintBarcodes, setShowPrintBarcodes] = useState(false);
  const [showBarcodes, setBarcodes] = useState(false);
  const [categoryData, setCategoryData] = useState({
    name: ''
  });
  const [showAddCategoryDrawer, setShowAddCategoryDrawer] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const userDetails = JSON.parse(localStorage.getItem('login'))

  
  
const { data: books = [], isLoading } = useFetchBooksQuery();
const { data: categories = [] } = useFetchLLCsQuery();
const { data: transactions = [], isLoadingMyTransactions } = useFetchTransactionsByUserQuery(userDetails._id);

const { data: genres = [], isLoading: isLoadingGenres } = useFetchGenresQuery();
// Mutations
const [addBook, { isLoading: isAddingBook, isSuccess, isError }] = useAddBookMutation(); 
const [addLLC, { isLoading: isAddingLLC }] = useAddLLCMutation(); // renamed to isAddingBook

// renamed to isAddingBook
const [updateBook] = useUpdateBookMutation();
const [deleteBook] = useDeleteBookMutation();
const [deleteLLC] = useDeleteLLCMutation();

const loginData = JSON.parse(localStorage.getItem('login'));

// Check if the user is an admin
const isAdmin = loginData?.isAdmin; // Optional chaining to prevent errors if loginData is null
const isPatron = loginData.role == "patron"
const openNotification = (type, message, description) => {
  notification[type]({
    message: message,
    description: description,
    duration: 3, // Notification will auto-close after 3 seconds
  });
};

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData({
    ...formData,
    [name]: type === 'checkbox' ? checked : value,
  });
};



const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Show loading notification
  openNotification('info', 'Loading...', 'Please wait while we process your request.');

  try {
    if (selectedBook) {
      // Update existing book
      await updateBook({ id: selectedBook._id, ...formData });
      openNotification('success', 'Success', 'Book updated successfully!');
    } else {
      // Add new book
      const { data } = await addBook(formData);
      console.log("new copies ", data);
      
      setBookCopies(data.bookCopies); 
      openNotification('success', 'Success', 'Book added successfully!');
      setShowPrintBarcodes(true); // Show the print barcodes component
    }
  } catch (error) {
    console.error('Error:', error);
    openNotification('error', 'Error', error.response?.data?.message || 'Something went wrong!');
  } finally {
    handleClose();
    setShowEditDrawer(false); // Close the edit drawer after submission
    setSelectedBook(null); // Clear selected book
  }
};


const handleEdit = (book) => {
  setSelectedBook(book);
  setFormData({
    title: book.title,
    subtitle: book.subtitle,
    author: book.author,
    isbn: book.isbn,
    llc: book.llc,
    availableCopies: book.availableCopies,
    totalCopies: book.totalCopies,
    isAvailable: book.isAvailable,
    lccClassification: book.lccClassification,
    callNumber: book.callNumber,
  });
  setShowEditDrawer(true); // Show edit drawer
};


  // Handlers for drawer visibility
  const handleAddCategoryShow = () => setShowAddCategoryDrawer(true);
  const handleAddCategoryClose = () => {
    setShowAddCategoryDrawer(false);
    setCategoryData({ name: '' });
  };

  const handleCategoryChange = (e) => {
    setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const {data} = await addLLC(categoryData)
    console.log("category data is ",data);

  };

const handleView = (book) => {
  setSelectedBook(book);
  setShowDetailDrawer(true); // Show detail drawer
};

const handleDelete = async () => {
  if (deleteBookId) {
    await deleteBook(deleteBookId);
    setDeleteBookId(null); // Clear the delete book ID
  }
};

const confirmDelete = (bookId) => {
  setDeleteBookId(bookId); // Set the book ID for confirmation
};


  const generatePDF = (books) => {
    const doc = new jsPDF();
    const tableRows = []; // Array to store the table rows
  
    // Define the columns you want in the PDF table (customize as needed)
    const columns = [
      { header: 'Title', field: 'title' },
      { header: 'Author', field: 'author' },
      { header: 'LLC Classification', field: 'llc' },
      { header: 'Available', field: 'isAvailable' },
    ];
  
    // Process each book row and map it to the desired column structure
    books.forEach((book) => {
      const rowArray = [];
  
      // Push row data into rowArray for each defined column
      columns.forEach((column) => {
        if (column.field === 'isAvailable') {
          // Special case to display "Yes" or "No" for availability
          rowArray.push(book.isAvailable ? 'Yes' : 'No');
        } else {
          rowArray.push(book[column.field]);
        }
      });
  
      tableRows.push(rowArray); // Push processed row data into tableRows
    });
  
    // Initialize AutoTable for PDF generation
    doc.autoTable(
      columns.map((col) => col.header), // Extract headers from the columns
      tableRows, // Use the processed table rows
      {
        theme: 'grid', // Choose theme: 'striped', 'grid', or 'plain'
        styles: {
          overflow: 'linebreak', // visible, hidden, ellipsize or linebreak
        },
        columnStyles: { text: { columnWidth: 'auto' } },
        margin: { top: 10, horizontal: 7 },
      }
    );
  
    // Save the PDF document with a custom filename or default filename
    const fileName = 'Books_List.pdf';
    doc.save(fileName);
  };

  const generateCSV = (books) => {
    const SEPARATOR = ','; // Separator for CSV
  
    let csvContent = 'data:text/csv;charset=utf-8,'; // CSV content starts as an empty string with UTF-8 encoding
    const headers = ['Title', 'Author', 'LLC', 'Available']; // Headers for the CSV file
  
    const row = headers.join(SEPARATOR); // Join headers with separator
    csvContent += row + '\r\n'; // Add the row to the CSV content followed by a new line
  
    // Process each book and generate CSV rows
    books.forEach((book) => {
      const rowArray = [];
      
      rowArray.push(book.title); // Add book title
      rowArray.push(book.author); // Add book author
      rowArray.push(book.llc); // Add book genre
      rowArray.push(book.isAvailable ? 'Yes' : 'No'); // Add availability (Yes/No)
  
      const row = rowArray.join(SEPARATOR); // Join row elements with separator
      csvContent += row + '\r\n'; // Add the row to the CSV content followed by a new line
    });
  
    // Encode the CSV content
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
  
    // Set download filename, can customize as needed
    const fileName = 'Books_List.csv';
    link.setAttribute('download', fileName);
  
    document.body.appendChild(link); // Required for Firefox
    link.click(); // Trigger download
  };
  

  // Drawer for book details
  const detailDrawerContent = (
    <div style={{ padding: 20 }}>
      <h3>{selectedBook?.title}</h3>
      <p><strong>Author:</strong> {selectedBook?.author}</p>
      <p><strong>ISBN:</strong> {selectedBook?.isbn}</p>
      <p><strong>Total Copies:</strong> {selectedBook?.totalCopies}</p>
      <p><strong>Available:</strong> {selectedBook?.isAvailable ? 'Yes' : 'No'}</p>
      <p><strong>Call Number:</strong> {selectedBook?.callNumber}</p>
    </div>
  );

  // Drawer for editing book
  const editDrawerContent = (
    <Form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <Form.Group controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="author">
        <Form.Label>Author</Form.Label>
        <Form.Control
          type="text"
          name="author"
          value={formData.author}
          
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="isbn">
        <Form.Label>ISBN</Form.Label>
        <Form.Control
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="genre">
        <Form.Label>LLC</Form.Label>
        <Form.Control
          type="text"
          name="llc"
          value={formData.llc.name}
          onChange={handleChange}
        />
      </Form.Group>



      <Form.Group controlId="lccClassification">
        <Form.Label>LCC Classification</Form.Label>
        <Form.Control
          type="text"
          name="lccClassification"
          value={formData.lccClassification}
          onChange={handleChange}
          required
        />
      </Form.Group>



      <Button style={{border:"solid #FFB71D",background:"#FFB71D",color:"#535266",borderRadius:"40px"}} className='w-100' type="submit" htmlType="submit" data-cy="login-btn">      
        Submit
      </Button>
    </Form>
  );


   // State to keep track of search input
   const [searchQuery, setSearchQuery] = useState('');
   // State to store filtered books


   const booksWithId = books.map(book => ({
    ...book,
    key: book._id, // Ant Design Table requires `key` instead of `id`
    llc: book.llc ? book.llc.name : '', // Extract the name from the llc object
    remainingCopies: book.remainingCopies || 0,
    availability: book.remainingCopies > 0,
    waitingCount: book.waitingList?.length || 0,
    inQueue: isPatron && book.waitingList?.includes(loginData.userId),
  }));
  
  const hasBorrowedBook = (bookId) => {
    return transactions.some(transaction => 
      transaction.bookId === bookId && !transaction.returned
    );
  };
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: 200,
    },
    {
      title: 'LLC Classification',
      dataIndex: 'llc',
      key: 'llc',
      width: 200,
    },
    {
      title: 'Remaining Copies',
      dataIndex: 'remainingCopies',
      key: 'remainingCopies',
      align: 'center',
      width: 150,
    },
    {
      title: 'Availability',
      dataIndex: 'availability',
      key: 'availability',
      align: 'center',
      width: 150,
      render: (availability) => (
        <Tag color={availability ? 'green' : 'red'}>
          {availability ? 'Available' : 'Unavailable'}
        </Tag>
      ),
    },
    {
      title: 'People Waiting',
      dataIndex: 'waitingCount',
      key: 'waitingCount',
      align: 'center',
      width: 150,
    },
  // Conditionally add "In Waiting Queue" column if isPatron is true
  ...(isPatron ? [{
    title: 'In Waiting Queue',
    dataIndex: 'inQueue',
    key: 'inQueue',
    align: 'center',
    width: 180,
    render: (inQueue) => (
      <Tag color={inQueue ? 'orange' : 'grey'}>
        {inQueue ? 'In Queue' : 'Not in Queue'}
      </Tag>
    ),
  }] : []),
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <>
          {!isPatron && (
            <>
           
                <EyeOutlined
                    onClick={() => handleView(record)}
                    disabled={!isAdmin}
                    style={{ marginRight: 8 }}
                />
               

           
                <DeleteOutlined disabled={!isAdmin}  onClick={() => confirmDelete(record._id)} style={{ color: 'red', cursor: 'pointer' }} />
               
            </>
          )}
          {isPatron && !record.availability && !record.inQueue && (
            <Button
              type="primary"
              onClick={() => handleRequestBook(record._id)}
              style={{ marginLeft: 8 }}
            >
              Book this book
            </Button>
          )}
        </>
      ),
    },
  ];
  

  const Categorycolumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this category?.This will delete all books in this category"
            onConfirm={() => handleDeleteCategory(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];


// State to store filtered books
const [filteredBooks, setFilteredBooks] = useState(booksWithId);

   // Effect to filter books when searchQuery changes
   useEffect(() => {
     if (searchQuery.trim() === '') {
       setFilteredBooks(booksWithId); // Show all books if search query is empty
     } else {
       // Filter books based on the search query (case-insensitive)
       const filtered = books.filter(book => 
         book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         book.author.toLowerCase().includes(searchQuery.toLowerCase())
       );
       setFilteredBooks(filtered);
     }
   }, [searchQuery, books]);
 
   const [bookBook] = useBookBookMutation();

   const handleDeleteCategory = async (c_Id) => {
    if(c_Id){
      await deleteLLC(c_Id)
    setDeleteCategoryId(null); // Clear the delete category ID

    }
    
  };

  const handleRequestBook = async (bookId) => {
    try {
      await bookBook({ bookId,userId:loginData._id }); // Call the bookBook mutation with the book ID
      openNotification('success', 'Request Successful', 'You have successfully requested the book.');
    } catch (error) {
      console.error('Error requesting book:', error);
      openNotification('error', 'Request Failed', error.response?.data?.message || 'Could not request book.');
    }
  };

  return (
    <div className="container-fluid">
        {isLoading ? (
        <div className="text-center my-5">
          <Spin size="large" tip="Loading books..." />
        </div>
      ) : (
            <div className="bg-light">
      <div className="row py-2 px-2">
  <div className="col-8">
    <h3>Books</h3>
  </div>
  <div className="col-4 d-flex align-items-center justify-content-end">
    <Form.Group className="mb-3 w-100" controlId="exampleForm.ControlInput1">
      <InputGroup>
        <Form.Control 
        type="text" 
        placeholder="Search..."     
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} />
        <Button variant="primary" id="button-search">
          <FaSearch />
        </Button>
      </InputGroup>
    </Form.Group>
  </div>

  <div className="col-6">
            <ButtonGroup aria-label="Basic example">
            {isAdmin && (
        <Button style={{ background: '#294A70' }} onClick={handleShow}>
          <IoIosAddCircle color="white" /> Add New
        </Button>
      )}
         <Button 
  className='metallic-button' 
  onClick={() => generatePDF(filteredBooks)} 
  disabled={filteredBooks.length === 0} // Disable if filteredBooks is empty
>
  <FaPrint /> Save PDF
</Button>

{isAdmin && (
  <Button 
    className='metallic-button' 
    onClick={() => setBarcodes(!showBarcodes)} 
    disabled={filteredBooks.length === 0} // Disable if filteredBooks is empty
  >
    <IoCloudDownloadSharp /> {!showBarcodes ? <> Bar Codes </> : <> Books </>}
  </Button>

  
)}
  {isAdmin && (
        <Button style={{ background: '#294A70', color: 'white' }} onClick={handleAddCategoryShow}>
          <IoIosAddCircle color="white" />LLC Category
        </Button>
      )}

    </ButtonGroup>

            </div>

</div>

 
{filteredBooks && 

<>
{showBarcodes ? 


<Tabs
  defaultActiveKey="1"
  tabPosition="left"
  style={{
    maxHeight: 400,
  }}
  items={filteredBooks.map((book, index) => ({
    label: book.title,      // Use book title as the tab label
    key: String(book.id),    // Use unique book ID as the key
    children: (
      <div style={{
        maxHeight: 400,
      }}>
        <h3>{book.title}</h3>
        <p>{book.description}</p> {/* Add other book details as needed */}
        
        {/* Map each book copy */}
        <div >
         
         <Row style={{
        maxHeight: 339,
        overflow:"scroll"
      }}>
            {book.bookCopies.map((copy, idx) => (
              <Col key={idx}>
                <div>
                  <Barcode value={copy._id} displayValue={false} /> {/* Barcode without value display */}
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    ),
  }))}
/>



//   <Row>
//   {filteredBooks.map((book) => (
//     <Col key={book.id}> {/* Add a unique key for each item */}
//       {book.title} {/* Replace with appropriate book details */}
//     </Col>
//   ))}
// </Row>

:
<Table
columns={columns}
dataSource={filteredBooks}
pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10'] }}
rowKey="key"
style={{ background: 'white' }}
/>
}
  </>
}
      </div>
      )}
      


      {/* Ant Design Modal for Adding a New Book */}
      <Spin spinning={isAddingBook}>
      <Modal
        title="Add New Book"
        visible={show}
        onCancel={handleClose}
        footer={null}
      >
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="subtitle">
            <Form.Label>Sub Title</Form.Label>
            <Form.Control
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="author">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="isbn">
            <Form.Label>ISBN</Form.Label>
            <Form.Control
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="genre">
        <Form.Label>LLC</Form.Label>
        <Form.Control
          as="select"
          name="llc"
          value={formData.llc} // Ensure formData.genre is a string or the ID of the selected genre
          onChange={handleChange}
          required
        >
          <option value="">Select LCC Classification</option>
          {!isLoadingGenres && genres.map((genre) => (
            <option key={genre._id} value={genre._id}>{genre.name}</option>
          ))}
        </Form.Control>
      </Form.Group>

    

          <Form.Group controlId="totalCopies">
            <Form.Label>Total Copies</Form.Label>
            <Form.Control
              type="number"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleChange}
              required
            />
          </Form.Group>


          <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
            Submit
          </Button>
        </Form>
      </Modal>
      </Spin>



      {/* Drawer for adding category */}
      <Drawer
        title="Add LLC Category"
        visible={showAddCategoryDrawer}
        onClose={handleAddCategoryClose}
        width={400} // Adjust drawer width as needed
      >
        <Spin spinning={isAddingLLC}>
          <Form layout="vertical" onSubmit={handleCategorySubmit}>
          <Form.Group controlId="title">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={categoryData.name}
              onChange={handleCategoryChange}
              required
            />
          </Form.Group>
            <Button type="primary" htmlType="submit" style={{ marginTop: '10px' }}>
              Submit
            </Button>
          </Form>
        </Spin>


      <Table
        columns={Categorycolumns}
        dataSource={categories}
        pagination={false} // Turn off pagination if not needed
        style={{ marginTop: '20px' }}
      />

      </Drawer>

      <Modal
        title="Confirm Delete"
        visible={!!deleteBookId}
        onOk={handleDelete}
        onCancel={() => setDeleteBookId(null)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this book?</p>
      </Modal>

      {/* Drawer for book details */}
      <Drawer
        title="Book Details"
        placement="right"
        onClose={() => setShowDetailDrawer(false)}
        visible={showDetailDrawer}
      >
        {detailDrawerContent}
      </Drawer>

      {/* Drawer for editing book */}
      <Drawer
        title={selectedBook ? "Edit Book" : "Add Book"}
        placement="right"
        onClose={() => {
          setShowEditDrawer(false);
          setSelectedBook(null); // Clear selected book
        }}
        visible={showEditDrawer}
      >
        {editDrawerContent}
      </Drawer>

      {showPrintBarcodes && (
        <div>
          <BarcodePrint bookCopies={bookCopies} />
          <Button onClick={() => setShowPrintBarcodes(false)}>Close</Button>
        </div>
      )}

    </div>
  );
};



const BarcodePrint = ({ bookCopies }) => {
  console.log("bookCopies ",bookCopies);
  
  const handlePrint = () => {
    const printContent = document.querySelector('.book-barcodes').innerHTML;
    console.log("printContent ",printContent);
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent;

    window.print();

    document.body.innerHTML = originalContents;
  };

  return (
    <>
    <div className='book-barcodes' >
      <h3>Generated Barcodes</h3>
      <Row>
       
        {bookCopies.map((copy) => (
          <Col md={6}>
          <div key={copy._id}>
            <Barcode 
            displayValue={false}
            width={1}
            height={50}
            value={copy._id} />
          </div>
          </Col>
        ))}
      </Row>
      
    </div>
    <Button onClick={handlePrint}>Print Barcodes</Button>
    </>
  );
};


export default AllBooks;
