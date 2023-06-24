import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import Container from '@mui/material/Container';
import DataTable from '../components/DataTable';
import ProductService from "../services/product.service";
import AuthService from "../services/auth.service";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import { GridToolbarContainer, GridToolbarExport, gridClasses, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import CategorySelection from '../components/CategorySelection'
import BrandSelection from '../components/BrandSelection'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import Typography from '@mui/material/Typography';
import LinkMUI from '@mui/material/Link';
import Image from "@roflcoopter/material-ui-image";
import useAlert from '../components/Alerts/useAlert';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';

function ProductsPage() {
    const snackbar = useAlert();

    const [content, setContent] = useState();
    const [pageSize] = React.useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [newProductCategory, setNewProductCategory] = useState(1);
    const [newProductBrand, setNewProductBrand] = useState(1);
    const [newProductName, setNewProductName] = useState("");
    const [newProductDescription, setNewProductDescription] = useState("");
    const currentUser = AuthService.getCurrentUser();

    document.title = "Products - " + import.meta.env.VITE_TITLE;
    const handleClickOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const columns = [
        { field: "id", headerName: "ID", hide: true },
        {
            field: "Image", headerName: "",
            renderCell: (params) => {
                if (params.row.cover_image) {
                    return <Image src={import.meta.env.VITE_API_ENDPOINT + "v1/documents/storage/" + params.row.cover_image} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                } else {
                    return <InsertPhotoIcon fontSize="large" sx={{ margin: "auto" }} />
                }
            }
        },
        {
            field: "name", headerName: "Name", width: 300,
            renderCell: (params) => {
                return <div><Typography><LinkMUI underline="hover" component={Link} to={"/product/" + params.row.id}>{params.value}</LinkMUI></Typography><Typography>{params.row.description}</Typography></div>
            }
        },
        {
            field: "category", headerName: "Category",
            valueGetter: (params) => {
                let result = [];
                if (params.row.category) {
                    result.push(params.row.category.name)
                }
                return result
            },
            renderCell: (params) => {
                return <Link to={"/category/" + params.row.category.id}>{params.value}</Link>
            }
        }
    ];

    const handleAddProduct = (e) => {
        e.preventDefault();
        ProductService.addProduct(newProductName, newProductBrand, newProductCategory, newProductDescription).then(
            () => {
                setOpenModal(false);
                ProductService.getAllProducts().then(
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
                console.log(resMessage);
            }
        );
    }

    useEffect(() => {
        ProductService.getAllProducts().then(
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
                {currentUser && currentUser["role"] === "admin" &&
                    <Button variant="text" startIcon={<AddIcon />} onClick={handleClickOpenModal}>Add new</Button>
                }
            </GridToolbarContainer>
        );
    }


    return (
        <Container>
            <DataTable content={content} columns={columns} pageSize={pageSize} toolbar={CustomToolbar} />
            <Drawer open={openModal} onClose={handleCloseModal} anchor="right">
                <Container>
                    <form onSubmit={handleAddProduct}>
                        <Grid container spacing={3} direction="row" alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h5"><br />Add new product</Typography>

                            </Grid>
                            <Grid item xs={12}>
                                <TextField required autofocus id="name" label="Name" fullWidth value={newProductName} onChange={e => setNewProductName(e.target.value)} />
                            </Grid>
                            <Grid item xs={6}>
                                <CategorySelection selectedCategory={newProductCategory} setState={setNewProductCategory} />
                            </Grid>
                            <Grid item xs={6}>
                                <BrandSelection selectedBrand={newProductBrand} setState={setNewProductBrand} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="description" multiline minRows={3} label="Description" fullWidth value={newProductDescription} onChange={e => setNewProductDescription(e.target.value)} />
                            </Grid>
                            <Grid item>
                                <Button onClick={handleCloseModal} color="error">Cancel</Button>
                                <Button variant="contained" type="submit" color="primary" onClick={handleCloseModal}>Add</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Drawer>
        </Container>
    )
}

export default ProductsPage
