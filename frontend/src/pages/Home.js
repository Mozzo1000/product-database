import React, { useState }  from 'react'
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import ProductService from "../services/product.service";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Link } from "react-router-dom";

function HomePage() {
    document.title = "product-database";
    const [search, setSearch] = useState("");
    const [searchedList, setSearchedList] = useState([]);

    const [openStatusMessage, setOpenStatusMessage] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    
    const handleCloseMessage = () => {
        setOpenStatusMessage(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        ProductService.search(search).then(
            response => {
                if (response.data.length <= 0) {
                    setStatusMessage("No search results found");
                    setOpenStatusMessage(true);
                    setSearchedList();
                } else {
                    setSearchedList(response.data);
                }
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
                setSearchedList();
            }
        )
    }

    return (
        <Container>
            <Grid container spacing={3} justifyContent="center" alignItems="center" direction="column">
                <Grid item xs={12}>
                    <Typography variant="h4" sx={{fontWeight: 600}}>
                        Search for products
                    </Typography>

                </Grid>
                <Grid item xs={12}>
                <form onSubmit={handleSearch}>
                    <Grid container spacing={2} justifyContent="center" alignItems="center" direction="row">
                            <Grid item xs={8}>
                                <TextField label="Search" type="search" value={search} onChange={e => setSearch(e.target.value)}></TextField>
                            </Grid>
                            <Grid item xs={4}>
                                <Button variant="contained" type="submit">Search</Button>
                            </Grid>
                    </Grid>
                    </form>
                </Grid>
                <Grid container spacing={3} direction="column" sx={{paddingTop: 4}}>
                    {searchedList?.map((product, index) => (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <CardMedia 
                                        component="img"
                                        height="140"
                                        image={"http://localhost:5000/v1/documents/storage/" + product.cover_image}
                                        sx={{objectFit: "contain"}}
                                    />
                                    <Typography color="textSecondary" gutterBottom >
                                        {product.category.name}
                                    </Typography>
                                    <Typography variant="h5" component={Link} to={"product/" + product.id}>
                                        {product.name}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {product.brand.name}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        {String(product.description).substring(0, 240)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Snackbar open={openStatusMessage} autoHideDuration={6000} onClose={handleCloseMessage} message={statusMessage} />
        </Container>
    )
}

export default HomePage