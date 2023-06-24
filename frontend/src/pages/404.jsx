import React from 'react'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <Container sx={{textAlign: "center", paddingBottom: "100px"}}>
        <Grid container spacing={3} direction="column">
            <Grid item>
                <Typography variant="h2"><b>Sorry..</b></Typography>
            </Grid>
            <Grid item>
                <Typography>The page you requested was <b>not found.</b></Typography>
            </Grid>
            <Grid item>
                <Button component={Link} to="/" variant="contained">Go back home</Button>
            </Grid>
        </Grid>
    </Container>
  )
}

export default PageNotFound