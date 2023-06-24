import React, { useState }  from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DocumentService from "../services/document.service";
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import ViewListIcon from '@mui/icons-material/ViewList';
import useAlert from './Alerts/useAlert';
import { TextField } from '@mui/material';

function ChangeDocumentOrder(props) {
    const snackbar = useAlert();

    const [openModal, setOpenModal] = useState(false);
    const [order, setOrder] = useState();

    const handleClickOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleEditDocument = (e) => {
        e.preventDefault();
        DocumentService.editDocumentOrder(props.document.id, order).then(
            response => {
                setOpenModal(false);
                // TODO: Update the state with new data automatically instead of prompting the user to refresh the page.
                snackbar.showSuccess(response.data.message + ". Please refresh the page");
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                snackbar.showError(resMessage);
            }
        )
    }

    return (
        <>
            <MenuItem onClick={handleClickOpenModal}>
                <ListItemIcon ><ViewListIcon /></ListItemIcon>
                <ListItemText primary="Change order" />
            </MenuItem>

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Change order</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                            The higher the order value, the higher up the document will be show in the list.
                            This also affects the cover image(s).<br/><br/>
                    </DialogContentText>
                    <TextField label="Order" defaultValue={props.document.order} onChange={(e) => setOrder(e.target.value)}/>
                </DialogContent>
                <FormControl>
                    <form onSubmit={handleEditDocument}>
                        <DialogActions>
                            <Button onClick={handleCloseModal}>Cancel</Button>
                            <Button type="submit" onClick={handleCloseModal}>Save</Button>
                        </DialogActions>
                    </form>
                </FormControl>
            </Dialog>
        </>
    )
}

export default ChangeDocumentOrder
