import React, { useState }  from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DocumentService from "../services/document.service";
import Snackbar from '@mui/material/Snackbar';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';

function RemoveDocument(props) {
    const [openModal, setOpenModal] = useState(false);
    const [openStatusMessage, setOpenStatusMessage] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const handleClickOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleCloseMessage = () => {
        setOpenStatusMessage(false);
    };

    const handleRemoveAttribute = (e) => {
        e.preventDefault();
        DocumentService.removeDocument(props.props.id).then(
            response => {
                setOpenModal(false);
                setStatusMessage(response.data.message + ". Please refresh the page");
                setOpenStatusMessage(true);
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
            <MenuItem onClick={handleClickOpenModal}>
                <ListItemIcon ><DeleteIcon /></ListItemIcon>
                <ListItemText primary="Delete" />
            </MenuItem>
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                            Removing document, <strong>{props.props.name}</strong> CANNOT be undone!
                    </DialogContentText>
                </DialogContent>
                <FormControl>
                    <form onSubmit={handleRemoveAttribute}>
                        <DialogActions>
                            <Button onClick={handleCloseModal}>Cancel</Button>
                            <Button type="submit" color="error" onClick={handleCloseModal}>Yes</Button>
                        </DialogActions>
                    </form>
                </FormControl>
            </Dialog>
            <Snackbar open={openStatusMessage} autoHideDuration={6000} onClose={handleCloseMessage} message={statusMessage} />
        </>
    )
}

export default RemoveDocument
