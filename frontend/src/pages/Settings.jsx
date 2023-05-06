import React, { useState, useEffect } from 'react'
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
import UserService from '../services/user.service'
import { styled } from '@mui/material/styles';
import AuthService from '../services/auth.service'
import CategoriesPage from './Categories';
import BrandsPage from './Brands';
import UserTable from '../components/UserTable';
import useAlert from '../components/Alerts/useAlert';
import FavoriteTable from '../components/FavoriteTable';
import InventoryTable from '../components/InventoryTable';
import { useTranslation } from "react-i18next";

function SettingsPage() {
    const snackbar = useAlert();
    const { t, i18n } = useTranslation();

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [newPassword, setNewPassword] = useState();
    const [newPasswordConf, setNewPasswordConf] = useState();
    const [passwordError, setPasswordError] = useState();
    const [profileImage, setProfileImage] = useState();
    const [tab, setTab] = useState(0);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [savePasswordButtonDisabled, setSavePasswordButtonDisabled] = useState(true);
    const currentUser = AuthService.getCurrentUser();

    document.title = "Settings - " + import.meta.env.VITE_TITLE

    const handleTabChange = (event, newTab) => {
        setTab(newTab);
    };

    const handleSavePasswordSettings = () => {
        UserService.editMe({ 'password': newPassword }).then(
            response => {
                snackbar.showSuccess(response.data.message);
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
                snackbar.showError(resMessage);
            }
        )
    }

    const handleSaveSettings = () => {
        UserService.editMe({ name, email }).then(
            response => {
                snackbar.showSuccess(response.data.message);
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
                snackbar.showError(resMessage);
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
                snackbar.showError(resMessage);
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
                    snackbar.showSuccess(response.data.message);
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
                            snackbar.showError(resMessage);
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
                    snackbar.showError(resMessage);
                }
            )
        }
    };
    return (
        <Container>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleTabChange} aria-label="tabs">
                    <Tab label={t("menu.account")} {...a11yProps(0)} />
                    <Tab label={t("menu.favorites")} {...a11yProps(1)} />
                    <Tab label={t("menu.inventory")} {...a11yProps(2)} />
                    {currentUser["role"] === "admin" && <Tab label={t("menu.category")} {...a11yProps(3)} />}
                    {currentUser["role"] === "admin" && <Tab label={t("menu.brand")} {...a11yProps(4)} />}
                    {currentUser["role"] === "admin" && <Tab label={t("menu.users")} {...a11yProps(5)} />}
                </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
                <Grid container spacing={3} justifyContent="flex-start" alignItems="center">
                    <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
                        <Card>
                            <CardContent>
                                {/*eslint-disable no-sequences*/}
                                <TextField fullWidth label={t("input.name")} value={name} onChange={e => (setName(e.target.value), setSaveButtonDisabled(!e.target.value))} sx={{ m: 1 }} />
                                <TextField fullWidth label={t("input.email")} value={email} onChange={e => (setEmail(e.target.value), setSaveButtonDisabled(!e.target.value))} sx={{ m: 1 }} />
                                <Button fullWidth variant="contained" disabled={saveButtonDisabled} onClick={handleSaveSettings}>{t("buttons.save_changes")}</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={3} direction="column" alignItems="center">
                                    <Grid item>
                                        <Avatar src={import.meta.env.VITE_API_ENDPOINT + "v1/users/storage/" + profileImage} sx={{ width: 100, height: 100 }} />
                                    </Grid>
                                    <Grid item>
                                        <label htmlFor="contained-button-file">
                                            <Input id="contained-button-file" multiple type="file" onChange={handleImageUpload} />
                                            <Button variant="contained" component="span">
                                                {t("buttons.change_picture")}
                                            </Button>
                                        </label>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} order={{ xs: 3 }}>
                        <Card>
                            <CardHeader title={<Typography variant="h5">Change password</Typography>} />
                            <CardContent>
                                <Grid container spacing={3} direction="column">
                                    <Grid item>
                                        <TextField type="password" fullWidth required label={t("input.new_password")} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                    </Grid>
                                    <Grid item>
                                        <TextField type="password" fullWidth required label={t("input.confirm_new_password")} value={newPasswordConf} helperText={passwordError} onChange={e => setNewPasswordConf(e.target.value)} error={newPassword !== newPasswordConf} />
                                    </Grid>
                                    <Grid item>
                                        <Button fullWidth variant="contained" onClick={handleSavePasswordSettings} disabled={savePasswordButtonDisabled}>{t("buttons.save_new_password")}</Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <FavoriteTable />
            </TabPanel>
            <TabPanel value={tab} index={2}>
                <InventoryTable />
            </TabPanel>
            <TabPanel value={tab} index={3}>
                <CategoriesPage />
            </TabPanel>
            <TabPanel value={tab} index={4}>
                <BrandsPage />
            </TabPanel>
            <TabPanel value={tab} index={5}>
                <UserTable />
            </TabPanel>
        </Container>
    )
}

export default SettingsPage
