import React from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Image from "@roflcoopter/material-ui-image";

function AboutPage() {
    return (
        <Container>
            <Grid container spacing={0} direction="column">
                <Grid container spacing={0} direction="row" alignItems="center">
                    <Grid item xs={6}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>About {import.meta.env.VITE_TITLE}</Typography>
                        <Typography>
                            {import.meta.env.VITE_TITLE} started in 2022 from the need to have access to technical information about all kinds of devices, gadgets and other things such as computers, cellphones and monitors in one central place.
                            Manufacturers have a habit of removing product pages off there website as soon as they release a newer generation, this site aims to correct that.
                        </Typography>
                        <br />
                        <Typography>
                            We save 100s of data points for every possible electronical device released, backing it up and centralizing the retrival for the end user, stopping the need to open up several different websites in order to to get what you need.
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Image style={{ backgroundColor: 'transparent' }} src="assets/undraw_all_the_data_re_hh4w.svg" />
                    </Grid>
                    <Grid item xs={6}>
                        <Image style={{ backgroundColor: 'transparent' }} src="assets/undraw_data_points_re_vkpq.svg" />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Data collection</Typography>
                        <Typography>
                            We collect data from many different sources, mainly directly from manufacturers. All pages that show data also provides information from where it came from.
                            Data is being collected automatically and manually and all is being reviewed by real human beings before being added to the database.
                            The data is fully open for anybody to view, download and use from this site or through it's API.
                        </Typography>
                        <br />
                        <Typography>
                            {import.meta.env.VITE_TITLE} is an aggregator for data and a promotor of the open sharing of knowledge. We are in no way claiming ownership of anything hosted or provided on this site unless otherwise specified.
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Open source</Typography>
                        <Typography>
                            Everything we do is fully transparent and open sourced. You can find the source code for this website and internal tools used on <a href="https://github.com/Mozzo1000/product-database" target="_blank" rel="noreferrer">Github</a>.
                        </Typography>
                        <br />
                        <Typography variant="h6">Technical information</Typography>
                        <Typography>
                            <ul>Frontend: <a href="https://reactjs.org/" target="_blank" rel="noreferrer">React</a>, <a href="https://mui.com/" target="_blank" rel="noreferrer">MUI</a></ul>
                            <ul>Backend: <a href="https://python.org/" target="_blank" rel="noreferrer">Python</a>, <a href="https://github.com/pallets/flask/" target="_blank" rel="noreferrer">Flask</a></ul>
                            <ul>Database: <a href="https://postgresql.org/" target="_blank" rel="noreferrer">PostgreSQL</a></ul>
                        </Typography>
                        <br />
                        <Typography>Non-product images are from <a href="https://undraw.co/" target="_blank" rel="noreferrer">unDraw</a> </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Image style={{ backgroundColor: 'transparent' }} src="assets/undraw_open_source_-1-qxw.svg" />
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}

export default AboutPage