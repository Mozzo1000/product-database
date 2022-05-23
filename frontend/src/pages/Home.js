import React, { useState, useEffect }  from 'react'
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import ProductService from "../services/product.service";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Link } from "react-router-dom";
import Image from 'material-ui-image'
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import StatsService from '../services/stats.service';
import CircularProgress from '@mui/material/CircularProgress';

function HomePage() {
    document.title = "product-database";
    const [search, setSearch] = useState("");
    const [searchedList, setSearchedList] = useState([]);
    const [statsProducts, setStatsProducts] = useState();
    const [statsBrands, setStatsBrands] = useState();

    const [openStatusMessage, setOpenStatusMessage] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    
    const handleCloseMessage = () => {
        setOpenStatusMessage(false);
    };

    useEffect(() => {
        StatsService.get().then(
            response => {
                setStatsProducts(response.data["products"])
                setStatsBrands(response.data["brands"])
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
      });

    const handleSearch = (e) => {
        e.preventDefault();
        if (search) {
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
        } else {
            setSearchedList();
        }
    }

    return (
        <Container>
            <Box sx={{width: '100%', display: 'flex', minHeight: '500px', alignItems: 'center', justifyContent: 'center'}}>
                <Grid container spacing={6} sx={{display: 'flex', alignItems: 'center', maxWidth: '1300px', padding: '50px'}}>
                    <Grid item xs={12} md={7}>
                    <Typography variant="h3" fontWeight={700} sx={{paddingBottom: '15px'}}>
                        Easy searching
                    </Typography>
                    <Typography variant="h6" sx={{opacity: '0.4', paddingBottom: '30px'}}>
                        Find everything you might need about computers, monitors, devices and gadgets in just one search. 100% free and open.
                    </Typography>
                    <Grid container direction="row" spacing={3}>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ width: '200px', fontSize: '16px'}} component={Link} to="/products">
                                See all products
                            </Button>
                        </Grid>
                    </Grid>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Image style={{backgroundColor: 'transparent', width: '100%'}} src="assets/undraw_searching_re_3ra9.svg"/>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{flexGrow: 1, paddingBottom: '50px'}}>
                <Grid container sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                    <Grid item xs={12} md={3.5} sx={{backgroundColor: '#f2f0f1', textAlign: 'center', padding: '30px', width: '200px', borderRadius: '10px', margin: '10px !important'}}>
                        {statsProducts ? (
                            <>
                            <Typography variant="h3" fontWeight={700}>{statsProducts}</Typography>
                            </>
                        ) : (
                            <CircularProgress />
                        )}
                        <Typography variant="h6" sx={{opacity: '0.4'}}>products</Typography>
                    </Grid>
                    <Grid item xs={12} md={3.5} sx={{backgroundColor: '#f2f0f1', textAlign: 'center', padding: '30px', width: '200px', borderRadius: '10px', margin: '10px !important'}}>
                        {statsBrands ? (
                            <>
                            <Typography variant="h3" fontWeight={700}>{statsBrands}</Typography>
                            </>
                        ) : (
                            <CircularProgress />
                        )}
                        <Typography variant="h6" sx={{opacity: '0.4'}}>brands</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{flexGrow: 1, minHeight: '500px'}}>
                <Grid container spacing={3} direction="column">            
                    <Grid container spacing={3} justifyContent="center"  direction="column" alignItems="center">
                        <Grid item xs={12}>
                            <Typography variant="h4" sx={{fontWeight: 600}}>
                                Search for product
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <form onSubmit={handleSearch}>
                                <Grid container spacing={2} justifyContent="center" alignItems="center" direction="row">
                                    <Grid item xs={12}>
                                        <TextField label="Search" type="search" value={search} onChange={e => setSearch(e.target.value)} InputProps={{endAdornment: <InputAdornment position="end"><IconButton type="submit" edge="end"><SearchIcon/></IconButton></InputAdornment>,}}/>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
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
            </Box>
            <Snackbar open={openStatusMessage} autoHideDuration={6000} onClose={handleCloseMessage} message={statusMessage} />
        </Container>
    )
}

export default HomePage