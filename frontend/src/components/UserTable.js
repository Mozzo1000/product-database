import React, { useState, useEffect }  from 'react'
import UserService from '../services/user.service'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

function UserTable() {
    const [users, setUsers] = useState();
    const [openStatusMessage, setOpenStatusMessage] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false);


    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
      setOpenDeleteConfirmation(false);
    };
    

    const handleDeleteConfirmationOpen = () => {
        setOpenDeleteConfirmation(true);
    };

    const handleCloseMessage = () => {
        setOpenStatusMessage(false);
    };

    const handleDeleteUser = (id) => {
        UserService.deleteUser(id).then(
            response => {
                setStatusMessage(response.data["message"]);
                setOpenStatusMessage(true);
                handleClose();
                UserService.getAllUsers().then(
                    response => {
                        setUsers(response.data);
                    },
                    error => {
                        const resMessage =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();
                        setStatusMessage(resMessage);
                        setOpenStatusMessage(true);
                    }
                )
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setStatusMessage(resMessage);
                setOpenStatusMessage(true);
            }
        )
    }

    useEffect(() => {
        UserService.getAllUsers().then(
            response => {
                setUsers(response.data);
                console.log("USER LOADED")
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setStatusMessage(resMessage);
                setOpenStatusMessage(true);
            }
        )
      }, []);

    return (
    <>
    <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {users ? (
                    users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell><Avatar src={"http://localhost:5000/v1/users/storage/" + user.image} alt="User" /></TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                {user.status == "active" ? (
                                    <Chip label="Active" color="success" />
                                ): (
                                    <Chip label="Inactive" color="error" />
                                )}
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={handleClick}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                                    <MenuItem onClick={handleDeleteConfirmationOpen}>
                                        <ListItemIcon>
                                            <DeleteIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            Delete
                                        </ListItemText>
                                    </MenuItem>
                                </Menu>
                                <Dialog open={openDeleteConfirmation} onClose={handleClose}>
                                    <DialogTitle>
                                        Are you sure?
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Removing user, <strong>{user.name}</strong> CANNOT be undone!
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>Cancel</Button>
                                        <Button onClick={() => handleDeleteUser(user.id)} color="error" autofocus >Yes</Button>
                                    </DialogActions>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <LinearProgress />
                )}
            </TableBody>
        </Table>
    </TableContainer>
    <Snackbar open={openStatusMessage} autoHideDuration={6000} onClose={handleCloseMessage} message={statusMessage} />
    </>
  )
}

export default UserTable