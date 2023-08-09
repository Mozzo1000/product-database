import React, { useState, useEffect } from 'react'
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ProductService from "../services/product.service";
import useAlert from './Alerts/useAlert';
import Image from "@roflcoopter/material-ui-image";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardContent';
import { CardActionArea, CardHeader, Skeleton } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import Grid from '@mui/material/Grid';
import { useTranslation } from "react-i18next";
import { useHorizontalScroll } from './HorizontalScrollRef';
import Hidden from '@mui/material/Hidden'

function NewestProductCard(props) {
    const snackbar = useAlert();
    const { t, i18n } = useTranslation();
    const [content, setContent] = useState();
    const scrollRef = useHorizontalScroll();

    useEffect(() => {
        const filter = "?limit=" + props.limit;
        ProductService.getAllProducts(filter).then(
            response => {
                setContent(response.data);
                console.log(response.data);
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
    
    const allProductTitle = (
        <Grid container spacing={3} direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
                <Typography variant="h5" fontWeight="500">{t("card.recently_added")}</Typography>
            </Grid>
            <Hidden smDown>
                {content && content.length > 0 &&
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ width: '200px', fontSize: '16px', margin: "auto" }} component={Link} to="/products">
                            {t("buttons.all_products")}
                        </Button>
                    </Grid>
                }
            </Hidden>
        </Grid>
    )

    return (
        <Card>
            <CardHeader avatar={<NewReleasesIcon fontSize="large" />} title={allProductTitle} />
            <ImageList ref={scrollRef} sx={{
                gridAutoFlow: "column",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr)) !important",
                gridAutoColumns: "minmax(160px, 1fr)"
            }}>
                {content ? (
                    content.length > 0 ? (
                        content.map((product) => (
                            <>
                                <CardActionArea  component={Link} to={"/product/" + product.id} sx={{maxWidth: "200px"}}>
                                    <ImageListItem sx={{maxWidth: "200px"}}>
                                        <Image src={import.meta.env.VITE_API_ENDPOINT + "v1/documents/storage/" + product.cover_image} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                        <ImageListItemBar title={product.name} />
                                    </ImageListItem>
                                </CardActionArea>
                            </>
                        ))

                    ) : (
                        <Grid container direction="row" justifyContent="center" alignItems="center">
                            <Grid item>
                                <Typography variant="h5" sx={{ fontWeight: 500 }}>Could not find any products.</Typography>
                            </Grid>
                        </Grid>
                    )
                ) : (
                    [1, 2, 3, 4, 5, 6, 7].map(() =>
                        <ImageListItem>
                            <Skeleton variant="rectangular" width={160} height={160} />
                        </ImageListItem>
                    )
                )}
            </ImageList>
            <Hidden smUp>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ fontSize: '16px', margin: "auto" }} component={Link} to="/products">
                    {t("buttons.all_products")}
                </Button>
            </Hidden>
        </Card>
    )
}

export default NewestProductCard