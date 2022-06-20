import React, { useState, useEffect }  from 'react'
import InventoryService from '../services/inventory.service'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import useAlert from './Alerts/useAlert';
import Image from 'material-ui-image'
import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import LinkMUI from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function InventoryTable() {
    const snackbar = useAlert();
    const [inventory, setInventory] = useState();

    useEffect(() => {
        InventoryService.getAll().then(
            response => {
                setInventory(response.data);
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
      }, []);

    return (
    <>
    {inventory ? (
        inventory.length > 0 ? (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Cost per product</TableCell>
                            <TableCell>Total cost</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inventory.map((inventory) => (
                            <TableRow key={inventory.id}>
                                <TableCell><Image src={"http://localhost:5000/v1/documents/storage/" + inventory.product.cover_image} style={{width: "100%", height: "100%", objectFit: "contain"}}/></TableCell>
                                <TableCell><LinkMUI underline="hover" component={Link} to={"/product/" + inventory.product.id}>{inventory.product.name}</LinkMUI></TableCell>
                                <TableCell>{inventory.year}</TableCell>
                                <TableCell>{inventory.quantity}</TableCell>
                                <TableCell>{inventory.cost}</TableCell>
                                <TableCell>{inventory.cost*inventory.quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        ) : (
            <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
                <Grid item>
                    <Image style={{backgroundColor: 'transparent'}} src="assets/undraw_no_data_re_kwbl.svg" />
                    <Typography variant="h5" fontWeight={700}>You have not added any products to your inventory yet</Typography>
                    <Typography variant="h6" sx={{opacity: 0.4}}>Start by going to a product and clicking the <AddCircleIcon/> icon</Typography>
                </Grid>
            </Grid>
        )
    ): (
        <LinearProgress />
    )}
    </>
  )
}

export default InventoryTable