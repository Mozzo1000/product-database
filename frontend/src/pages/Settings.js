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
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import UserService from '../services/user.service'
import { styled } from '@mui/material/styles';
import AuthService from '../services/auth.service'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LinearProgress from '@mui/material/LinearProgress';

function SettingsPage() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [newPassword, setNewPassword] = useState();
    const [newPasswordConf, setNewPasswordConf] = useState();
    const [passwordError, setPasswordError] = useState();
    const [profileImage, setProfileImage] = useState();
    const [tab, setTab] = useState(0);
    const [openStatusMessage, setOpenStatusMessage] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [savePasswordButtonDisabled, setSavePasswordButtonDisabled] = useState(true);
    const [users, setUsers] = useState();
    const currentUser = AuthService.getCurrentUser();

    document.title = "Settings - product-database"

    const handleTabChange = (event, newTab) => {
        setTab(newTab);
    };

    const handleCloseMessage = () => {
        setOpenStatusMessage(false);
    };

    useEffect(() => {
        if (tab === 3) {
            UserService.getAllUsers().then(
                response => {
                    setUsers(response.data);
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
                }
            )
        }
      }, [tab]);

    const handleSavePasswordSettings = () => {
        UserService.editMe({'password': newPassword}).then(
            response => {
                setStatusMessage(response.data.message);
                setOpenStatusMessage(true);
                setSaveButtonDisabled(true);
                setNewPassword("");
                setNewPasswordConf("");
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
            }
        )
    }

    const handleSaveSettings = () => {
        UserService.editMe({name, email}).then(
            response => {
                setStatusMessage(response.data.message);
                setOpenStatusMessage(true);
                setSaveButtonDisabled(true);
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                console.log(resMessage);
                setStatusMessage(resMessage);
                setOpenStatusMessage(true);
            }
        )
    };

    useEffect(() => {
        if (newPasswordConf !== newPassword) {
            setPasswordError("Passwords do not match");
            setSavePasswordButtonDisabled(true);
        }
        if (!newPassword && !newPasswordConf) {
            setPasswordError("");
        }
    }, [newPassword, newPasswordConf])

    useEffect(() => {
        if (newPasswordConf === newPassword) {
            if (newPasswordConf || newPassword) { 
                setSavePasswordButtonDisabled(false);
                setPasswordError("")
            }
        }
    }, [newPassword, newPasswordConf, passwordError])

    useEffect(() => {
        UserService.getMe().then(
            response => {
                setName(response.data.name);
                setEmail(response.data.email);
                setProfileImage(response.data.image);
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
            }
        )
      }, []);

    const Input = styled('input')({
        display: 'none',
    });

    const handleImageUpload = (e) => {
        const fileData = e.target.files[0];
        console.log(fileData);
        if (fileData) {
            const data = new FormData();
            data.append('image', fileData);
            UserService.editMe(data).then(
                response => {
                    console.log(response.data);
                    setStatusMessage(response.data.message);
                    setOpenStatusMessage(true);
                    UserService.getMe().then(
                        response => {
                            setName(response.data.name);
                            setEmail(response.data.email);
                            setProfileImage(response.data.image);
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
                        }
                    )
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
                }
            )
        }
    };
      return (
        <Container>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleTabChange} aria-label="tabs">
                    <Tab label="Account" {...a11yProps(0)} />
                    <Tab label="Category" {...a11yProps(1)} />
                    <Tab label="Brand" {...a11yProps(2)} />
                    {currentUser["role"] === "admin" &&
                        <Tab label="Users" {...a11yProps(3)} />
                    }
                </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
                <Grid container spacing={3} justifyContent="flex-start" alignItems="center">
                    <Grid item xs={12} md={6} order={{xs: 2, md: 1}}>
                        <Card>
                            <CardContent>
                                {/*eslint-disable no-sequences*/}
                                <TextField fullWidth label="Name" value={name} onChange={e => (setName(e.target.value), setSaveButtonDisabled(!e.target.value))} sx={{m:1}}/>
                                <TextField fullWidth label="Email" value={email} onChange={e => (setEmail(e.target.value), setSaveButtonDisabled(!e.target.value))} sx={{m:1}}/>
                                <Button fullWidth variant="contained" disabled={saveButtonDisabled} onClick={handleSaveSettings}>Save changes</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} order={{xs: 1, md: 2}}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={3} direction="column" alignItems="center">
                                    <Grid item>
                                        <Avatar src={"http://localhost:5000/v1/users/storage/" + profileImage} sx={{ width: 100, height: 100 }} />
                                    </Grid>
                                    <Grid item>
                                        <label htmlFor="contained-button-file">
                                        <Input id="contained-button-file" multiple type="file" onChange={handleImageUpload}/>
                                        <Button variant="contained" component="span">
                                            Change picture
                                        </Button>
                                    </label>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} order={{xs: 3}}>
                        <Card>
                            <CardHeader title={<Typography variant="h5">Change password</Typography>}/>
                            <CardContent>
                                <Grid container spacing={3} direction="column">
                                    <Grid item>
                                        <TextField type="password" fullWidth required label="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                    </Grid>
                                    <Grid item>
                                        <TextField type="password" fullWidth required label="Confirm new password" value={newPasswordConf} helperText={passwordError} onChange={e => setNewPasswordConf(e.target.value)} error={newPassword !== newPasswordConf} />
                                    </Grid>
                                    <Grid item>
                                        <Button fullWidth variant="contained" onClick={handleSavePasswordSettings} disabled={savePasswordButtonDisabled}>Save new password</Button>
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
            <TabPanel value={tab} index={3}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users ? (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell><MoreVertIcon /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <LinearProgress />
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>

            <Snackbar open={openStatusMessage} autoHideDuration={6000} onClose={handleCloseMessage} message={statusMessage} />
        </Container>
    )
}

export default SettingsPage
