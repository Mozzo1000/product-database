import React, { useState, useEffect }  from 'react'
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

function FavoriteTable() {
    const snackbar = useAlert();
    const [favorites, setFavorites] = useState();

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
    <>
    {favorites ? (
        favorites.length > 0 ? (
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
                        {favorites.map((favorite) => (
                            <TableRow key={favorite.id}>
                                <TableCell><Image src={"http://localhost:5000/v1/documents/storage/" + favorite.product.cover_image} style={{width: "100%", height: "100%", objectFit: "contain"}}/></TableCell>
                                <TableCell><LinkMUI underline="hover" component={Link} to={"/product/" + favorite.product.id}>{favorite.product.name}</LinkMUI></TableCell>
                                <TableCell>{favorite.product.category.name}</TableCell>                            
                                <TableCell><FavoriteButton product_id={favorite.product.id} onRemove={() => loadFavorites()}/></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        ) : (
            <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
                <Grid item>
                    <Image style={{backgroundColor: 'transparent'}} src="assets/undraw_no_data_re_kwbl.svg" />
                    <Typography variant="h5" fontWeight={700}>You have not added any favorites yet</Typography>
                    <Typography variant="h6" sx={{opacity: 0.4}}>Start by going to a product and clicking the <FavoriteBorderIcon/> icon</Typography>
                </Grid>
            </Grid>
        )
    ): (
        <LinearProgress />
    )}
    </>
  )
}

export default FavoriteTable