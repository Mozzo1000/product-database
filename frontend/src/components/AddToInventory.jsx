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
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from "react-i18next";

function AddToInventory(props) {
    const snackbar = useAlert();
    const {t, i18n} = useTranslation();

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
            <Tooltip title={t("buttons.tooltip.add_inventory")}>
                <IconButton size="large" onClick={handleClickOpenModal}><AddCircleIcon fontSize="large" /></IconButton>
            </Tooltip>
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{t("dialog.add_to_inventory")}</DialogTitle>
                <FormControl>
                    <form onSubmit={handleAddToInventory}>
                        <DialogContent>
                            <TextField required autoFocus id="year" label={t("input.year")} margin="dense" fullWidth variant="standard" value={year} onChange={e => setYear(e.target.value)}/>
                            <TextField required id="quantity" label={t("input.quantity")} margin="dense" fullWidth variant="standard" value={quantity} onChange={e => setQuantity(e.target.value)}/>
                            <TextField id="cost" label={t("input.cost_per")} margin="dense" fullWidth variant="standard" value={cost} onChange={e => setCost(e.target.value)}/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseModal}>{t("buttons.cancel")}</Button>
                            <Button type="submit" color="primary" onClick={handleCloseModal}>{t("buttons.add")}</Button>
                        </DialogActions>
                    </form>
                </FormControl>
            </Dialog>
        </div>
    )
}

export default AddToInventory
