import React, { useState, useEffect }  from 'react'
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import AttributeService from "../services/attribute.service";
import Snackbar from '@mui/material/Snackbar';

function EditProductAttribute(props) {
    const [openModal, setOpenModal] = useState(false);
    const [editAttributeName, setEditAttributeName] = useState(props.props.name);
    const [editAttributeValue, setEditAttributeValue] = useState(props.props.value);
    const [openStatusMessage, setOpenStatusMessage] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    console.log(props.props);
    const handleClickOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleCloseMessage = () => {
        setOpenStatusMessage(false);
    };

    const handleEditAttribute = (e) => {
        e.preventDefault();
        AttributeService.editAttribute(props.props.id, editAttributeName, editAttributeValue).then(
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
        <div>
            <Button size="small" onClick={handleClickOpenModal}><EditIcon /></Button>
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Edit attribute</DialogTitle>
                <FormControl>
                    <form onSubmit={handleEditAttribute}>
                        <DialogContent>
                            <TextField required autoFocus id="name" label="Name" margin="dense" fullWidth variant="standard" value={editAttributeName} onChange={e => setEditAttributeName(e.target.value)}/>
                            <TextField required id="value" label="Value" margin="dense" fullWidth variant="standard" value={editAttributeValue} onChange={e => setEditAttributeValue(e.target.value)}/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseModal}>Cancel</Button>
                            <Button type="submit" color="primary" onClick={handleCloseModal}>Edit</Button>
                        </DialogActions>
                    </form>
                </FormControl>
            </Dialog>
            <Snackbar open={openStatusMessage} autoHideDuration={6000} onClose={handleCloseMessage} message={statusMessage} />
        </div>
    )
}

export default EditProductAttribute
