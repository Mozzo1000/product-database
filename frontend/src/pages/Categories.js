import React, { useState, useEffect }  from 'react'
import { Link } from "react-router-dom";
import Container from '@mui/material/Container';
import DataTable from '../components/DataTable';
import CategoryService from "../services/category.service";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import { GridToolbarContainer, GridToolbarExport, gridClasses, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector} from '@mui/x-data-grid';

function CategoriesPage() {
    const [content, setContent] = useState();
    const [pageSize] = React.useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState();

    const columns = [
        {field: "id", headerName: "ID"},
        {field: "name", headerName: "Name",
            renderCell: (params) => {
                return <Link to={"/category/" + params.row.id}>{params.value}</Link>
            }
        },
    ];

    const handleClickOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        CategoryService.addCategory(newCategoryName).then(
            () => {
                setOpenModal(false);
                CategoryService.getAllCategories().then(
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
                        console.log(resMessage);
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
        CategoryService.getAllCategories().then(
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
                console.log(resMessage);
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
                <DialogTitle>Add new category</DialogTitle>
                <FormControl>
                    <form onSubmit={handleAddCategory}>
                        <DialogContent>
                            <DialogContentText>
                                Fill out the information below
                            </DialogContentText>
                            <TextField required autofocus id="name" label="Name" margin="dense" fullWidth variant="standard" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)}/>
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

export default CategoriesPage
