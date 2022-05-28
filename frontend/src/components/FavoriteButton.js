import React, { useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteService from '../services/favorite.service'
import useAlert from './Alerts/useAlert';

function FavoriteButton(props) {
    const snackbar = useAlert();

    const [isFavorite, setIsFavorite] = useState(false);

    const handleClickFavorite = () => {
        if (isFavorite) {
            setIsFavorite(false);
            FavoriteService.remove(props.product_id).then(
                response => {
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
        } else {
            setIsFavorite(true);
            FavoriteService.add(props.product_id).then(
                response => {
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
    }

    useEffect(() => {
        FavoriteService.isFavorite(props.product_id).then(
            response => {
                setIsFavorite(response.data.favorite);
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
        <IconButton onClick={handleClickFavorite} size="large">
            {isFavorite ? (
                <Favorite color="error" fontSize="large" />
            ): (
                <FavoriteBorderIcon fontSize="large" />
            )}
        </IconButton>
    )
}

export default FavoriteButton