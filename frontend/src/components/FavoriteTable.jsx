import React, { useState, useEffect } from 'react'
import FavoriteService from '../services/favorite.service'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import useAlert from './Alerts/useAlert';
import Image from 'material-ui-image'
import FavoriteButton from './FavoriteButton';
import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import LinkMUI from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import Container from '@mui/material/Container';
import ExportButton from './ExportButton';

function FavoriteTable() {
    const snackbar = useAlert();
    const [favorites, setFavorites] = useState();
    const [query, setQuery] = useState("");

    const loadFavorites = () => {
        FavoriteService.getAll().then(
            response => {
                setFavorites(response.data);
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

    useEffect(() => {
        loadFavorites();
    }, []);

    return (
        <Container>
            {favorites ? (
                favorites.length > 0 ? (
                    <Grid container spacing={3} direction="column">
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={3} justifyContent="space-between" alignItems="center">
                                <Grid item xs={9}>
                                    <TextField fullWidth value={query} onChange={(e) => { setQuery(e.target.value) }} label="Search" InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>, }} />
                                </Grid>
                                <Grid item xs={3}>
                                    <ExportButton filename={"favorites"} data={favorites} csv_fields={[{ label: "ID", value: "id" },
                                    { label: "Product name", value: "product.name" },
                                    { label: "Category", value: "product.category.name" }]} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {favorites.filter(favorite => {
                                            if (query === "") {
                                                return favorite;
                                            } else if (favorite.product.name.toLowerCase().includes(query.toLowerCase())) {
                                                return favorite;
                                            }
                                        }).map((favorite) => (
                                            <TableRow key={favorite.id}>
                                                <TableCell><Image src={import.meta.env.VITE_API_ENDPOINT + "v1/documents/storage/" + favorite.product.cover_image} style={{ width: "100%", height: "100%", objectFit: "contain" }} /></TableCell>
                                                <TableCell><LinkMUI underline="hover" component={Link} to={"/product/" + favorite.product.id}>{favorite.product.name}</LinkMUI></TableCell>
                                                <TableCell>{favorite.product.category.name}</TableCell>
                                                <TableCell><FavoriteButton product_id={favorite.product.id} onRemove={() => loadFavorites()} /></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
                        <Grid item>
                            <Image style={{ backgroundColor: 'transparent' }} src="assets/undraw_no_data_re_kwbl.svg" />
                            <Typography variant="h5" fontWeight={700}>You have not added any favorites yet</Typography>
                            <Typography variant="h6" sx={{ opacity: 0.4 }}>Start by going to a product and clicking the <FavoriteBorderIcon /> icon</Typography>
                        </Grid>
                    </Grid>
                )
            ) : (
                <LinearProgress />
            )}
        </Container>
    )
}

export default FavoriteTable