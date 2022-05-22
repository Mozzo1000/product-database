import React, { useState }  from 'react'
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

function HomePage() {
    document.title = "product-database";
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("You searched for : " + search)
    }

    return (
        <Container>
            <Grid container spacing={3} justifyContent="center" alignItems="center" direction="column">
                <Grid item>
                    <Typography variant="h4" sx={{fontWeight: 600}}>
                        Search for products
                    </Typography>

                </Grid>
                <Grid item>
                <form onSubmit={handleSearch}>

                    <Grid container spacing={2} justifyContent="center" alignItems="center" direction="row">
                            <Grid item>
                                <TextField label="Search" type="search" value={search} onChange={e => setSearch(e.target.value)}></TextField>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" type="submit">Search</Button>
                            </Grid>
                    </Grid>
                    </form>

                </Grid>
            </Grid>
        </Container>
    )
}

export default HomePage