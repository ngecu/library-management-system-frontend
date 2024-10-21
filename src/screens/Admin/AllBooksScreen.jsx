import React, { useEffect, useState } from 'react';
import { Form, Button, ButtonGroup, InputGroup, Row, Col } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrashAlt, FaPrint, FaSearch } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';
import { IoIosAddCircle } from "react-icons/io";
import { IoCloudDownloadSharp } from "react-icons/io5";
import { Drawer, Modal, Spin } from 'antd';
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

const AllBooks = () => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    availableCopies: 1,
    totalCopies: 1,
    isAvailable: true,
    lccClassification: '',
    callNumber: '',
  });
  const [selectedBook, setSelectedBook] = useState(null); // Store selected book for editing and viewing
  const [deleteBookId, setDeleteBookId] = useState(null); // Store book ID for deletion
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [bookCopies, setBookCopies] = useState([]);
  const [showPrintBarcodes, setShowPrintBarcodes] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  
const { data: books = [], isLoading } = useFetchBooksQuery();
const { data: genres = [], isLoading: isLoadingGenres } = useFetchGenresQuery();
// Mutations
const [addBook, { isLoading: isAddingBook, isSuccess, isError }] = useAddBookMutation(); // renamed to isAddingBook
const [updateBook] = useUpdateBookMutation();
const [deleteBook] = useDeleteBookMutation();

const loginData = JSON.parse(localStorage.getItem('login'));

// Check if the user is an admin
const isAdmin = loginData?.isAdmin; // Optional chaining to prevent errors if loginData is null

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
  if (selectedBook) {
    // Update existing book
    await updateBook({ id: selectedBook._id, ...formData });
  } else {
    // Add new book
    const {data} = await addBook(formData);
    console.log("new copies ",data);
    
    setBookCopies(data.bookCopies); 
    openNotification('success', 'Success', 'Book added successfully!');
    setShowPrintBarcodes(true); // Show the print barcodes component
  }
  handleClose();
  setShowEditDrawer(false); // Close the edit drawer after submission
  setSelectedBook(null); // Clear selected book
};

const handleEdit = (book) => {
  setSelectedBook(book);
  setFormData({
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    genre: book.genre,
    availableCopies: book.availableCopies,
    totalCopies: book.totalCopies,
    isAvailable: book.isAvailable,
    lccClassification: book.lccClassification,
    callNumber: book.callNumber,
  });
  setShowEditDrawer(true); // Show edit drawer
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

  const columns = [
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'author', headerName: 'Author', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (   
            <>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => handleView(params.row)}
                style={{ marginRight: 8 }}
                disabled={!isAdmin}
              >
                <FaEye />
              </Button>
        
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => confirmDelete(params.row._id)}
                 disabled={!isAdmin}
              >
                <FaTrashAlt color="red" />
              </Button>
            </>
     
      ),
    },
  ];


  const generatePDF = (books) => {
    const doc = new jsPDF();
    const tableRows = []; // Array to store the table rows
  
    // Define the columns you want in the PDF table (customize as needed)
    const columns = [
      { header: 'Title', field: 'title' },
      { header: 'Author', field: 'author' },
      { header: 'Genre', field: 'genre' },
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
    const headers = ['Title', 'Author', 'Genre', 'Available']; // Headers for the CSV file
  
    const row = headers.join(SEPARATOR); // Join headers with separator
    csvContent += row + '\r\n'; // Add the row to the CSV content followed by a new line
  
    // Process each book and generate CSV rows
    books.forEach((book) => {
      const rowArray = [];
      
      rowArray.push(book.title); // Add book title
      rowArray.push(book.author); // Add book author
      rowArray.push(book.genre); // Add book genre
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
      <p><strong>Genre:</strong> {selectedBook?.genre?.name}</p>
      <p><strong>Available Copies:</strong> {selectedBook?.availableCopies}</p>
      <p><strong>Total Copies:</strong> {selectedBook?.totalCopies}</p>
      <p><strong>Available:</strong> {selectedBook?.isAvailable ? 'Yes' : 'No'}</p>
      <p><strong>LCC Classification:</strong> {selectedBook?.lccClassification}</p>
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
        <Form.Label>Genre</Form.Label>
        <Form.Control
          type="text"
          name="genre"
          value={formData.genre.name}
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

      <Form.Group controlId="callNumber">
        <Form.Label>Call Number</Form.Label>
        <Form.Control
          type="text"
          name="callNumber"
          value={formData.callNumber}
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
   const booksWithId = books.map(book => ({ ...book, id: book._id }));
 
   
   const [filteredBooks, setFilteredBooks] = useState(booksWithId);
 
   // Effect to filter books when searchQuery changes
   useEffect(() => {
     if (searchQuery.trim() === '') {
       setFilteredBooks(books); // Show all books if search query is empty
     } else {
       // Filter books based on the search query (case-insensitive)
       const filtered = books.filter(book => 
         book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         book.author.toLowerCase().includes(searchQuery.toLowerCase())
       );
       setFilteredBooks(filtered);
     }
   }, [searchQuery, books]);
 

  return (
    <div className="container-fluid">
      {!showPrintBarcodes &&
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
        <Button variant="outline-secondary" id="button-search">
          <FaSearch />
        </Button>
      </InputGroup>
    </Form.Group>
  </div>

  <div className="col-6">
            <ButtonGroup aria-label="Basic example">
            {isAdmin && (
        <Button style={{ background: '#5A5892' }} onClick={handleShow}>
          <IoIosAddCircle color="white" /> Add New
        </Button>
      )}
            <Button className='metallic-button' onClick={() => generatePDF(filteredBooks)}> <FaPrint /> Print Preview</Button>
      <Button className='metallic-button' onClick={() => generateCSV(filteredBooks)}>  <IoCloudDownloadSharp /> Save CSV</Button>

    </ButtonGroup>

            </div>

</div>

    {filteredBooks && 
        <DataGrid
          style={{ background: 'white' }}
          rows={filteredBooks}
          getRowId={(row) => row._id} 
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'blue',
              color: 'BLUE',
              fontWeight: 'bold',
            },
          }}
        />
      }
      </div>
      }


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
        <Form.Label>Genre</Form.Label>
        <Form.Control
          as="select"
          name="genre"
          value={formData.genre} // Ensure formData.genre is a string or the ID of the selected genre
          onChange={handleChange}
          required
        >
          <option value="">Select Genre</option>
          {!isLoadingGenres && genres.map((genre) => (
            <option key={genre._id} value={genre._id}>{genre.name}</option>
          ))}
        </Form.Control>
      </Form.Group>

          <Form.Group controlId="availableCopies">
            <Form.Label>Available Copies</Form.Label>
            <Form.Control
              type="number"
              name="availableCopies"
              value={formData.availableCopies}
              onChange={handleChange}
              required
            />
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

          <Form.Group controlId="isAvailable">
            <Form.Check
              type="checkbox"
              label="Available"
              name="isAvailable"
              checked={formData.isAvailable}
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

          <Form.Group controlId="callNumber">
            <Form.Label>Call Number</Form.Label>
            <Form.Control
              type="text"
              name="callNumber"
              value={formData.callNumber}
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
