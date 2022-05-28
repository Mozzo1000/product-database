import React, { useState }  from 'react'
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
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import useAlert from './Alerts/useAlert';

function UserTableActionMenu(props) {
    const snackbar = useAlert()

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
                snackbar.showSuccess(response.data["message"])
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

    const handleChangeUserRole = (id, role) => {
        let newRole = "";
        if (role === "admin") {
            newRole = "user"
        } else if (role === "user") {
            newRole = "admin"
        }
        UserService.changeUserRole(id, newRole).then(
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
                    Change status to {props.user.status === "active" ? "inactive" : "active"}
                </ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleChangeUserRole(props.user.id, props.user.role)}>
                <ListItemIcon>
                    {props.user.role === "admin" ? <ArrowCircleDownIcon /> : <ArrowCircleUpIcon />}
                </ListItemIcon>
                <ListItemText>
                    {props.user.role === "admin" ? (
                        "Demote to user"
                    ): (
                        "Promote to admin"
                    )} 
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
        </>
    )
}

export default UserTableActionMenu