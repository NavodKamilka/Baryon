import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AddCircleOutline } from '@mui/icons-material';

export default function Invoices() {
  const [openDialog, setOpenDialog] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [itemCodes, setItemCodes] = useState(['']);
  const [qtys, setQtys] = useState(['']);

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  console.log("In",selectedInvoice)

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/system-user/getAllInvoice', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoices(response.data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, [token]);

  const handleDelete = (invoice_no) => {
    Swal.fire({
      title: 'Confirm Delete',
      text: 'Are you sure you want to delete this invoice?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteInvoice(invoice_no);
      }
    });
  };

  const deleteInvoice = async (invoice_no) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/system-user/invoice/delete/${invoice_no}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice.invoice_no !== invoice_no));

      Swal.fire('Deleted!', 'The invoice has been deleted.', 'success');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      Swal.fire('Error', 'Failed to delete the invoice.', 'error');
    }
  };

  const handleAddInvoice = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/system-user/addInvoice',
        {
          customer_name: customerName,
          item_codes: itemCodes,
          qtys: qtys,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setCustomerName('');
      setItemCodes([]);
      setQtys([]);
      setOpenDialog(false);
      window.location.reload();
    } catch (error) {
      console.error('Error adding invoice:', error);
    }
  };

  const handleUpdateInvoice = async () => {
    
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/system-user/updateInvoice/${selectedInvoice.invoice_no}`,
        {
          customer_name: customerName,
          item_codes: itemCodes,
          qtys: qtys,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setOpenDialog(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  const handleEdit = async  (invoice) => {
    //console.log("Customer codes",invoice)
    setSelectedInvoice(invoice);
    setCustomerName(invoice.customer_name);
    try {
      const response = await performAdditionalAction(invoice.invoice_no);
      // console.log("Customer codes", response.line_items);
      const extractedItemCodes = response.line_items.map((item) => item.item_code);
      const extractedQtys = response.line_items.map((item) => item.qty);

      setItemCodes(extractedItemCodes);
      setQtys(extractedQtys)
      
    } catch (error) {
      console.error("Error performing additional action:", error);
    }

    // setItemCodes(invoice.item_codes);
    // setQtys(invoice.qtys);
    setOpenDialog(true);
  };

  const performAdditionalAction = async (invoice_no) => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/system-user/getInvoiceById/${invoice_no}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data; // Return the response data
      } catch (error) {
          console.error('Error fetching invoices:', error);
          throw error; 
      }
  };


  const handleAddItem = () => {
    setItemCodes((prevItemCodes) => [...prevItemCodes, '']);
    setQtys((prevQtys) => [...prevQtys, '']);
  };

  const handleItemCodeChange = (index, value) => {
    setItemCodes((prevItemCodes) => {
      const updatedItemCodes = [...prevItemCodes];
      updatedItemCodes[index] = value;
      return updatedItemCodes;
    });
  };

  const handleQtyChange = (index, value) => {
    setQtys((prevQtys) => {
      const updatedQtys = [...prevQtys];
      updatedQtys[index] = value;
      return updatedQtys;
    });
  };

  return (
    <div>
      <Grid container alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h5" component="h1" style={{ fontSize: '25px', fontWeight: 'bold' }}>
            All Invoices
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={() => setOpenDialog(true)}>
              Add New Invoices
            </Button>
          </Box>
        </Grid>
      </Grid>
      <br />
      <br />
      <Grid container justifyContent="center">
        <Grid item xs={10} md={12}>
          <Table size="small" aria-label="invoices">
            <TableHead>
              <TableRow>
                <TableCell align="center">Invoice Number</TableCell>
                <TableCell align="center">Invoice Date</TableCell>
                <TableCell align="center">Customer Name</TableCell>
                <TableCell align="center">Total Price</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {invoices?.length > 0 ? (
            invoices.map((invoice) => (
                <TableRow key={invoice.invoice_no}>
                <TableCell align="center">{invoice.invoice_no}</TableCell>
                <TableCell align="center">{invoice.invoice_date}</TableCell>
                <TableCell align="center">{invoice.customer_name}</TableCell>
                <TableCell align="center">{invoice.total_price}</TableCell>
                <TableCell align="center">
                    <Button variant="contained" style={{ backgroundColor: 'green', color: 'white' }} onClick={() => handleEdit(invoice)}>
                    Edit
                    </Button>
                </TableCell>
                <TableCell align="center">
                    <Button variant="contained" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleDelete(invoice.invoice_no)}>
                    Delete
                    </Button>
                </TableCell>
                </TableRow>
            ))
            ) : (
            <TableRow>
                <TableCell colSpan={6} align="center">Loading......</TableCell>
            </TableRow>
            )}


            </TableBody>

          </Table>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle style={{ textAlign: 'center' }}>{selectedInvoice ? 'Edit Invoice' : 'Add New Invoice'}</DialogTitle>
        <DialogContent>
          <br />
          <TextField
            type="text"
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            fullWidth
            style={{ marginBottom: '25px' }}
          />


          {itemCodes.map((itemCode, index) => (
            <div key={index}>
              <TextField
                type="text"
                label="Item Code"
                value={itemCode}
                onChange={(e) => handleItemCodeChange(index, e.target.value)}
                fullWidth
                style={{ marginBottom: '25px' }}
              />
              <TextField
                type="text"
                label="Quantity"
                value={qtys[index]}
                onChange={(e) => handleQtyChange(index, e.target.value)}
                fullWidth
                style={{ marginBottom: '25px' }}
              />
            </div>
          ))}

          <IconButton color="inherit" aria-label="add" onClick={handleAddItem}>
            <AddCircleOutline /> Click here to add Item code and Quantity
          </IconButton>
        </DialogContent>
        <DialogActions>
          <Button style={{ color: 'red', marginRight: '10px' }} onClick={() => { setOpenDialog(false); window.location.reload(); }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: 'green', color: 'white' }}
            onClick={selectedInvoice ? handleUpdateInvoice : handleAddInvoice}
            // onClick={() => {
            //   console.log('Selected Invoice:', selectedInvoice);
            //   if (selectedInvoice) {
            //     handleUpdateInvoice();
            //   } else {
            //     handleAddInvoice();
            //   }
            // }}
          >
            {selectedInvoice ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
