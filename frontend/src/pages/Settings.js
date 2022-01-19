import React, { useState, useEffect }  from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TabPanel from '../components/TabPanel';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import a11yProps from '../components/TabPanel';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function SettingsPage() {
    const [tab, setTab] = useState(0);

    document.title = "Settings - product-database"

    const handleTabChange = (event, newTab) => {
        setTab(newTab);
    };

    useEffect(() => {
        
      }, []);

      return (
        <Container>
            <Tabs value={tab} onChange={handleTabChange} aria-label="tabs">
                <Tab label="Account" {...a11yProps(0)} />
                <Tab label="Category" {...a11yProps(1)} />
                <Tab label="Brand" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={tab} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} order={{xs: 2, md: 1}}>
                        <TextField label="Name" />
                    </Grid>
                    <Grid item xs={12} md={6} order={{xs: 1, md: 2}}>
                        <Avatar sx={{ width: 100, height: 100 }} />
                        <Button variant="contained">Change picture</Button>
                    </Grid>
                    <Grid item xs={12} md={6} order={{xs: 3}}>
                        <Card>
                            <CardHeader title={<Typography variant="h5">Change password</Typography>}/>
                            <CardContent>
                                <Grid container spacing={3} direction="column">
                                    <Grid item>
                                        <TextField fullWidth required label="Current password"/>
                                    </Grid>
                                    <Grid item>
                                        <TextField fullWidth required label="New password"/>
                                    </Grid>
                                    <Grid item>
                                        <TextField fullWidth required label="Confirm new password"/>
                                    </Grid>
                                    <Grid item>
                                        <Button fullWidth variant="contained">Save new password</Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={tab} index={1}>

            </TabPanel>
            <TabPanel value={tab} index={2}>

            </TabPanel>
        </Container>
    )
}

export default SettingsPage
