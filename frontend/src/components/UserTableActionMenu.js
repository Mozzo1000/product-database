import React, { useState, useEffect }  from 'react'
import UserService from '../services/user.service'
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
import TrafficIcon from '@mui/icons-material/Traffic';
import Snackbar from '@mui/material/Snackbar';

function UserTableActionMenu(props) {

    const [openStatusMessage, setOpenStatusMessage] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false);

    const handleCloseMessage = () => {
        setOpenStatusMessage(false);
    };

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

    const handleDeleteUser = (id) => {
        UserService.deleteUser(id).then(
            response => {
                setStatusMessage(response.data["message"]);
                setOpenStatusMessage(true);
                handleClose();
                // callback to get all users
                props.callback();
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
    
    const handleChangeUserStatus = (id, status) => {
        let newStatus = "";
        if (status === "active") {
            newStatus = "inactive"
        } else if (status === "inactive") {
            newStatus = "active"
        }
        UserService.changeUserStatus(id, newStatus).then(
            response => {
                setStatusMessage(response.data["message"]);
                setOpenStatusMessage(true);
                handleClose();
                props.callback();
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

    return (
        <>
        <IconButton onClick={handleClick}>
            <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => handleChangeUserStatus(props.user.id, props.user.status)}>
                <ListItemIcon>
                    <TrafficIcon />
                </ListItemIcon>
                <ListItemText>
                    Change status to {props.user.status == "active" ? "inactive" : "active"}
                </ListItemText>
            </MenuItem>
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
                    Removing user, <strong>{props.user.name}</strong> CANNOT be undone!
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={() => handleDeleteUser(props.user.id)} color="error" autofocus >Yes</Button>
            </DialogActions>
        </Dialog>
        <Snackbar open={openStatusMessage} autoHideDuration={6000} onClose={handleCloseMessage} message={statusMessage} />
        </>
    )
}

export default UserTableActionMenu