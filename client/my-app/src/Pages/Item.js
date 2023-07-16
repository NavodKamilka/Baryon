import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import axios from 'axios';
import Swal from 'sweetalert2';

import { uploadImageToCloudinary , getImageUrlFromCloudinary  } from '../Components/cloudinary' // Assuming you have a utility function to handle Cloudinary uploads
import FormData from 'form-data';

export default function Item() {
    const [openDialog, setOpenDialog] = useState(false);
    const [items, setItems] = useState([]);

    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');

    const [selectedItem, setSelectedItem] = useState(null);


    const token = localStorage.getItem('token');


    useEffect(() => {

        const fetchItems = async () => {
          try {
            const response = await axios.get('http://127.0.0.1:8000/api/system-user/getAllItem', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setItems(response.data);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };
    
    
        fetchItems();
      }, [token]);

    const handleDelete = (item_code) => {
        Swal.fire({
          title: 'Confirm Delete',
          text: 'Are you sure you want to delete this item?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'red',
          confirmButtonText: 'Delete',
        }).then((result) => {
          if (result.isConfirmed) {
            deleteItem(item_code);
          }
        });
    };

    const deleteItem = async (item_code) => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/system-user/item/delete/${item_code}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          setItems((prevItems) => prevItems.filter((item) => item.item_code !== item_code));
    
          Swal.fire('Deleted!', 'The item has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting item:', error);
          Swal.fire('Error', 'Failed to delete the item.', 'error');
        }
    };

    const handleAddItem = async () => {

        const formData = new FormData();
        formData.append('file', image);
    
        const uploadedImage = await uploadImageToCloudinary(formData);
        const imageUrl = getImageUrlFromCloudinary(uploadedImage);

        try {
          const response = await axios.post(
            'http://127.0.0.1:8000/api/system-user/addItem',
            {
              description: description,
              price: price,
              image: imageUrl,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data);
          setDescription('');
          setPrice('');
          setImage('');
          setOpenDialog(false);
          window.location.reload();
        } catch (error) {
          console.error('Error adding user:', error);
        }
    };

    const handleUpdateItem = async () => {

        const formData = new FormData();
        formData.append('file', image);
    
        const uploadedImage = await uploadImageToCloudinary(formData);
        const imageUrl = getImageUrlFromCloudinary(uploadedImage);

        try {
          const response = await axios.put(
            `http://127.0.0.1:8000/api/system-user/updateItem/${selectedItem.item_code}`,
            {
                description: description,
                price: price,
                image: imageUrl,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log("Called")
          console.log(response.data);
          setOpenDialog(false);
          window.location.reload();
        } catch (error) {
          console.error(error);
        }
    };
    
    const handleEdit = (item) => {
        setSelectedItem(item);
        setDescription(item.description);
        setPrice(item.price);
        setImage(item.image);
        setOpenDialog(true);
    };



    return (
        <div>
            <Grid container alignItems="center">
                <Grid item xs={12} md={6}>
                <Typography variant="h5" component="h1" style={{ fontSize: '25px', fontWeight: 'bold' }}>
                    All Items
                </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="flex-end">
                    <Button variant="contained" onClick={() => setOpenDialog(true)}>
                    Add New Item
                    </Button>
                </Box>
                </Grid>
            </Grid>
            <br />
            <br />
            <Grid container justifyContent="center">
                <Grid item xs={10} md={12}>
                    <Table size="small" aria-label="users">
                    <TableHead>
                        <TableRow>
                        <TableCell align="center">Item Code</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Image</TableCell>
                        <TableCell align="center">Edit</TableCell>
                        <TableCell align="center">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                        <TableRow key={item.item_code}>
                            <TableCell align="center">{item.item_code}</TableCell>
                            <TableCell align="center">{item.description}</TableCell>
                            <TableCell align="center">{item.price}</TableCell>
                            <TableCell align="center"><img src={item.image} alt="Item" style={{ width: '50px', height: '50px', borderRadius: '50%',objectFit: 'cover' }} /></TableCell>
                            <TableCell align="center">
                            <Button variant="contained" style={{ backgroundColor: 'green', color: 'white' }} onClick={() => handleEdit(item)}>
                                Edit
                            </Button>
                            </TableCell>
                            <TableCell align="center">
                            <Button variant="contained" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleDelete(item.item_code)}>
                                Delete
                            </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </Grid>
            </Grid>


            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle style={{ textAlign: 'center' }}>{selectedItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                <DialogContent>
                    <br></br>
                <TextField
                    type="text"
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    style={{ marginBottom: '25px' }}
                />
                <TextField
                    type="number"
                    label="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    fullWidth
                    style={{ marginBottom: '25px' }}
                />
                {/* <TextField
                    type="text"
                    label="Image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    fullWidth
                    style={{ marginBottom: '25px' }}
                /> */}
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    style={{ marginBottom: '25px' }}
                />
                
                </DialogContent>
                <DialogActions>
                <Button style={{ color: 'red', marginRight: '10px' }}  onClick={() => { setOpenDialog(false); window.location.reload(); }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    style={{ backgroundColor: 'green', color: 'white' }}
                    onClick={selectedItem ? handleUpdateItem : handleAddItem}
                >
                    {selectedItem ? 'Update' : 'Add'}
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
