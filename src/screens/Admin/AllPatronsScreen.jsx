import React, { useEffect, useState } from 'react';
import { Form, Button, ButtonGroup, InputGroup, Row, Col } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrashAlt, FaPrint, FaSearch } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';
import { IoIosAddCircle } from "react-icons/io";
import { IoCloudDownloadSharp } from "react-icons/io5";
import { Modal, Spin } from 'antd';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import { notification } from 'antd';
import { useFetchPatronsQuery, useUpdateStatusMutation } from '../../features/userApi';

const AllPatrons = () => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
  });
  const [selectedPatron, setSelectedPatron] = useState(null);
  const [deletePatronId, setDeletePatronId] = useState(null);
  const [isAddingPatron, setIsAddingPatron] = useState(false);
  const [updateStatus] = useUpdateStatusMutation(); 
  const { data: patrons = [], isLoading } = useFetchPatronsQuery();
  
  // Mutations

  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
      duration: 3,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

 // Handle activation/deactivation
 const handleToggleStatus = async (patron) => {
  try {
    const updatedStatus = !patron.isActive;
    await updateStatus({ id: patron._id, isActive: updatedStatus });
    openNotification('success', 'Status Updated', `Patron ${updatedStatus ? 'Activated' : 'Deactivated'} successfully`);
  } catch (error) {
    openNotification('error', 'Update Failed', 'Failed to update patron status');
  }
};


  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Button
          variant={params.row.isActive ? 'danger' : 'success'}
          onClick={() => handleToggleStatus(params.row)}
        >
          {params.row.isActive ? 'Deactivate' : 'Activate'}
        </Button>
      ),
    },
  ];

  const generatePDF = (patrons) => {
    const doc = new jsPDF();
    const tableRows = [];

    const columns = [
      { header: 'Name', field: 'name' },
      { header: 'Email', field: 'email' },
      { header: 'Phone', field: 'phone' },
      { header: 'Address', field: 'address' },
      { header: 'Active', field: 'isActive' },
    ];

    patrons.forEach((patron) => {
      const rowArray = [];
      columns.forEach((column) => {
        if (column.field === 'isActive') {
          rowArray.push(patron.isActive ? 'Yes' : 'No');
        } else {
          rowArray.push(patron[column.field]);
        }
      });
      tableRows.push(rowArray);
    });

    doc.autoTable(
      columns.map((col) => col.header),
      tableRows,
      {
        theme: 'grid',
        styles: { overflow: 'linebreak' },
        margin: { top: 10, horizontal: 7 },
      }
    );

    const fileName = 'Patrons_List.pdf';
    doc.save(fileName);
  };

  const generateCSV = (patrons) => {
    const SEPARATOR = ',';
    let csvContent = 'data:text/csv;charset=utf-8,';
    const headers = ['Name', 'Email', 'Phone', 'Address', 'Active'];

    const row = headers.join(SEPARATOR);
    csvContent += row + '\r\n';

    patrons.forEach((patron) => {
      const rowArray = [
        patron.name,
        patron.email,
        patron.phone,
        patron.address,
        patron.isActive ? 'Yes' : 'No',
      ];
      const row = rowArray.join(SEPARATOR);
      csvContent += row + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const fileName = 'Patrons_List.csv';
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  };

  const handleClose = () => setShow(false);

  return (
    <div className="container-fluid">
      {isLoading ? (
        <div className="text-center my-5">
          <Spin size="large" tip="Loading patrons..." />
        </div>
      ) : (
        <div className="bg-light">
           <div className="row py-2 px-2">
           <div className="col-8">
          <h3>Patrons</h3>
          </div>
        <div className="col-4 d-flex align-items-center justify-content-end">
        <div className="search-bar">
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search..."
              // Implement search functionality here
            />
            <Button variant="outline-secondary" id="button-search">
              <FaSearch />
            </Button>
          </InputGroup>
          </div>
      </div>

      <div className="col-6">
      <div className="export-buttons">
          <ButtonGroup>
            <Button style={{ background: '#5A5892' }} onClick={() => setShow(true)}>
              <IoIosAddCircle /> Add New Patron
            </Button>
            <Button className='metallic-button' onClick={() => generatePDF(patrons)}>
              <FaPrint /> Print Preview
            </Button>
            <Button className='metallic-button' onClick={() => generateCSV(patrons)}>
              <IoCloudDownloadSharp /> Save CSV
            </Button>
          </ButtonGroup>
          </div>
        </div>

        </div>
        <div style={{ height: 400, width: '100%' }}>

          <DataGrid
            rows={patrons.map(patron => ({ ...patron, id: patron._id }))}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            disableSelectionOnClick
          />
          </div>
        </div>
      )}

      <Modal
        title={selectedPatron ? "Edit Patron" : "Add New Patron"}
        visible={show}
        onCancel={handleClose}
        footer={null}
      >
        <Form >
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="isActive">
            <Form.Check
              type="checkbox"
              label="Active"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {selectedPatron ? 'Update Patron' : 'Add Patron'}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Confirm Deletion"
        visible={!!deletePatronId}
        onCancel={() => setDeletePatronId(null)}
      >
        <p>Are you sure you want to delete this patron?</p>
      </Modal>
    </div>
  );
};

export default AllPatrons;
