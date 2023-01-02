import React, { useState, useEffect }  from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import AttributeService from "../services/attribute.service";
import useAlert from './Alerts/useAlert';

function RemoveProductAttribute(props) {
    const snackbar = useAlert();

    const [openModal, setOpenModal] = useState(false);

    const handleClickOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleRemoveAttribute = (e) => {
        e.preventDefault();
        AttributeService.removeAttribute(props.props.id).then(
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
        <div>
            <Button size="small" onClick={handleClickOpenModal}><DeleteIcon /></Button>
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                            Removing attribute, <strong>{props.props.name}</strong> CANNOT be undone!
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
        </div>
    )
}

export default RemoveProductAttribute
