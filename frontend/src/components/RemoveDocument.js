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
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import useAlert from './Alerts/useAlert';

function RemoveDocument(props) {
    const snackbar = useAlert();

    const [openModal, setOpenModal] = useState(false);
    const [anchorElDocMore, setAnchorElDocMore] = React.useState(null);
    const openDocMore = Boolean(anchorElDocMore);

    const handleClickOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleClickDocMore = (event) => {
        setAnchorElDocMore(event.currentTarget);
    };
    
    const handleCloseDocMore = () => {
        setAnchorElDocMore(null);
    };

    const handleRemoveAttribute = (e) => {
        e.preventDefault();
        DocumentService.removeDocument(props.props.id).then(
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
            <IconButton id={"morebtn-" + document.id} aria-controls={openDocMore ? 'more-menu' : undefined} aria-haspopup="true" aria-expanded={openDocMore ? 'true' : undefined} onClick={handleClickDocMore}><MoreVertIcon /></IconButton>
            <Menu id={"moremore-" + document.id} anchorEl={anchorElDocMore} open={openDocMore} onClose={handleCloseDocMore} MenuListProps={{'aria-labelledby': 'basic-button',}}>
                <MenuItem onClick={handleClickOpenModal}>
                    <ListItemIcon ><DeleteIcon /></ListItemIcon>
                    <ListItemText primary="Delete" />
                </MenuItem>
            </Menu>  

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
        </>
    )
}

export default RemoveDocument
