import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import axios from 'axios';
import Swal from 'sweetalert2';



export default function Admin() {

    const [openDialog, setOpenDialog] = useState(false);
    const [users, setUsers] = useState([]);

    const [f_name, setFName] = useState('');
    const [l_name, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('active');

    const [selectedUser, setSelectedUser] = useState(null);
    

    const token = localStorage.getItem('token');


    useEffect(() => {

        const fetchUsers = async () => {
          try {
            const response = await axios.get('http://127.0.0.1:8000/api/admin/getAll', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setUsers(response.data);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };
    
    
        fetchUsers();
      }, [token]);

    const handleDelete = (userId) => {
        Swal.fire({
          title: 'Confirm Delete',
          text: 'Are you sure you want to delete this user?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'red',
          confirmButtonText: 'Delete',
        }).then((result) => {
          if (result.isConfirmed) {
            deleteUser(userId);
          }
        });
    };

    const deleteUser = async (userId) => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/admin/delete/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    
          Swal.fire('Deleted!', 'The system user has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting system user:', error);
          Swal.fire('Error', 'Failed to delete the system user.', 'error');
        }
    };

    const handleAddUser = async () => {
        try {
          const response = await axios.post(
            'http://127.0.0.1:8000/api/admin/add',
            {
              f_name: f_name,
              l_name: l_name,
              email: email,
              password: password,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data);
          setFName('');
          setLName('');
          setEmail('');
          setPassword('');
          setOpenDialog(false);
          window.location.reload();
        } catch (error) {
          console.error('Error adding user:', error);
        }
    };

    const handleUpdateUser = async () => {
        // console.log("Called")
        try {
          const response = await axios.put(
            `http://127.0.0.1:8000/api/admin/updateSystemUser/${selectedUser.id}`,
            {
                f_name: f_name,
                l_name: l_name,
                email: email,
                status: status,
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
    
    const handleEdit = (user) => {
        setSelectedUser(user);
        setFName(user.f_name);
        setLName(user.l_name);
        setEmail(user.email);
        setStatus(user.status);
        setOpenDialog(true);
    };



  return (
    <div>
        <Grid container alignItems="center">
            <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h1" style={{ fontSize: '25px', fontWeight: 'bold' }}>
                All Users
            </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={() => setOpenDialog(true)}>
                Add New User
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
                    <TableCell align="center">User Id</TableCell>
                    <TableCell align="center">User Role</TableCell>
                    <TableCell align="center">First Name</TableCell>
                    <TableCell align="center">Last Name</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Edit</TableCell>
                    <TableCell align="center">Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell align="center">{user.id}</TableCell>
                        <TableCell align="center">{user.user_role}</TableCell>
                        <TableCell align="center">{user.f_name}</TableCell>
                        <TableCell align="center">{user.l_name}</TableCell>
                        <TableCell align="center">{user.email}</TableCell>
                        <TableCell align="center">{user.status}</TableCell>
                        <TableCell align="center">
                        <Button variant="contained" style={{ backgroundColor: 'green', color: 'white' }} onClick={() => handleEdit(user)}>
                            Edit
                        </Button>
                        </TableCell>
                        <TableCell align="center">
                        <Button variant="contained" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleDelete(user.id)}>
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
            <DialogTitle style={{ textAlign: 'center' }}>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogContent>
                <br></br>
            <TextField
                type="text"
                label="First Name"
                value={f_name}
                onChange={(e) => setFName(e.target.value)}
                fullWidth
                style={{ marginBottom: '25px' }}
            />
            <TextField
                type="text"
                label="Last Name"
                value={l_name}
                onChange={(e) => setLName(e.target.value)}
                fullWidth
                style={{ marginBottom: '25px' }}
            />
            <TextField
                type="text"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                style={{ marginBottom: '25px' }}
            />
            {selectedUser ? (
                <Box style={{ marginBottom: '25px' }}>
                <Typography>Status</Typography>
                <Select value={status} onChange={(e) => setStatus(e.target.value)} fullWidth>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
                </Box>
            ) : (
                <TextField
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    style={{ marginBottom: '25px' }}
                />
            )}
            </DialogContent>
            <DialogActions>
            <Button style={{ color: 'red', marginRight: '10px' }}  onClick={() => { setOpenDialog(false); window.location.reload(); }}>
                Cancel
            </Button>
            <Button
                variant="contained"
                style={{ backgroundColor: 'green', color: 'white' }}
                onClick={selectedUser ? handleUpdateUser : handleAddUser}
            >
                {selectedUser ? 'Update' : 'Add'}
            </Button>
            </DialogActions>
        </Dialog>
    </div>
  )
}
