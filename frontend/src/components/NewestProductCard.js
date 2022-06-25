import React, { useState, useEffect }  from 'react'
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ProductService from "../services/product.service";
import useAlert from '../components/Alerts/useAlert';
import Image from 'material-ui-image'
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardContent';
import { CardActionArea, CardHeader, Skeleton } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import Grid from '@mui/material/Grid';

function NewestProductCard(props) {
    const snackbar = useAlert();
    const [content, setContent] = useState();

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

    return (
        <Card>
            <CardHeader avatar={<NewReleasesIcon fontSize="large"/>} title="Newly added" titleTypographyProps={{variant: "h5", fontWeight: "500"}}/>
            <ImageList sx={{gridAutoFlow: "column", 
                gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr)) !important", 
                gridAutoColumns: "minmax(160px, 1fr)"}}>
                {content ? (
                    content.length > 0 ? (
                        content.map((product) => (
                            <>
                            <CardActionArea component={Link} to={"/product/" + product.id}>
                                <ImageListItem>
                                    <Image src={"http://localhost:5000/v1/documents/storage/" + product.cover_image} style={{width: "100%", height: "100%", objectFit: "contain"}}/>
                                    <ImageListItemBar title={product.name} />
                                </ImageListItem>
                            </CardActionArea>
                            
                            </>
                        ))
                        
                    ): (
                        <Grid container direction="row" justifyContent="center" alignItems="center">
                            <Grid item>
                                <Typography variant="h5" sx={{fontWeight: 500}}>Could not find any products.</Typography>
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
                {content && content.length > 0 &&
                <ImageListItem>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ width: '200px', fontSize: '16px', margin: "auto"}} component={Link} to="/products">
                            See all products
                        </Button>
                </ImageListItem>  
                }              
            </ImageList>
        </Card>
    )
}

export default NewestProductCard