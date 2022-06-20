import React, { useState }  from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InventoryService from "../services/inventory.service";
import useAlert from './Alerts/useAlert';

function AddToInventory(props) {
    const snackbar = useAlert();

    const [openModal, setOpenModal] = useState(false);
    const [year, setYear] = useState();
    const [quantity, setQuantity] = useState();
    const [cost, setCost] = useState();

    const handleClickOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleAddToInventory = (e) => {
        e.preventDefault();
        InventoryService.add(props.product_id, year, quantity, cost).then(
            response => {
                setOpenModal(false);
                snackbar.showSuccess(response.data.message);
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
            <IconButton size="large" onClick={handleClickOpenModal}><AddCircleIcon fontSize="large" /></IconButton>
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Add to inventory</DialogTitle>
                <FormControl>
                    <form onSubmit={handleAddToInventory}>
                        <DialogContent>
                            <TextField required autoFocus id="year" label="Year" margin="dense" fullWidth variant="standard" value={year} onChange={e => setYear(e.target.value)}/>
                            <TextField required id="quantity" label="Quantity" margin="dense" fullWidth variant="standard" value={quantity} onChange={e => setQuantity(e.target.value)}/>
                            <TextField id="cost" label="Cost per product" margin="dense" fullWidth variant="standard" value={cost} onChange={e => setCost(e.target.value)}/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseModal}>Cancel</Button>
                            <Button type="submit" color="primary" onClick={handleCloseModal}>Add</Button>
                        </DialogActions>
                    </form>
                </FormControl>
            </Dialog>
        </div>
    )
}

export default AddToInventory
