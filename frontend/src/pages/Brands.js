import React, { useState, useEffect }  from 'react'
import { Link } from "react-router-dom";
import Container from '@mui/material/Container';
import DataTable from '../components/DataTable';
import BrandService from "../services/brand.service";
import { GridToolbarContainer, GridToolbarExport, gridClasses, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import useAlert from '../components/Alerts/useAlert';

function Brandspage() {
    const snackbar = useAlert();

    const [content, setContent] = useState();
    const [pageSize] = React.useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [newBrandName, setNewBrandName] = useState();

    const columns = [
        {field: "id", headerName: "ID"},
        {field: "name", headerName: "Name",
            renderCell: (params) => {
                return <Link to={"/brand/" + params.row.id}>{params.value}</Link>
            }
        },

    ];

    const handleClickOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleAddBrand = (e) => {
        e.preventDefault();
        BrandService.addBrand(newBrandName).then(
            () => {
                setOpenModal(false);
                BrandService.getAllBrands().then(
                    response => {
                        setContent(response.data);
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
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                snackbar.showError(resMessage);
            }
        );
    }

    useEffect(() => {
        BrandService.getAllBrands().then(
            response => {
                setContent(response.data);
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

    function CustomToolbar() {
        return (
          <GridToolbarContainer className={gridClasses.toolbarContainer}>
            <GridToolbarExport />
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <Button variant="text" startIcon={<AddIcon />} onClick={handleClickOpenModal}>Add new</Button>
          </GridToolbarContainer>
        );
    }

    return (
        <Container>
            <DataTable content={content} columns={columns} pageSize={pageSize} toolbar={CustomToolbar}/>
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Add new brand</DialogTitle>
                <FormControl>
                    <form onSubmit={handleAddBrand}>
                        <DialogContent>
                            <DialogContentText>
                                Fill out the information below
                            </DialogContentText>
                            <TextField required autofocus id="name" label="Name" margin="dense" fullWidth variant="standard" value={newBrandName} onChange={e => setNewBrandName(e.target.value)}/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseModal}>Cancel</Button>
                            <Button type="submit" color="primary" onClick={handleCloseModal}>Add</Button>
                        </DialogActions>
                    </form>
                </FormControl>
            </Dialog>
        </Container>
    )
}

export default Brandspage
