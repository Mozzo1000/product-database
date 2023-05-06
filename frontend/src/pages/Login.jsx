import React, { useState } from 'react'
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import './Login.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AuthService from "../services/auth.service";
import { useNavigate, Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import LinkMUI from '@mui/material/Link';
import useAlert from '../components/Alerts/useAlert';
import { useTranslation } from "react-i18next";

function LoginPage(props) {
    document.title = "Login - " + import.meta.env.VITE_TITLE;
    const snackbar = useAlert();
    const { t, i18n } = useTranslation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        AuthService.login(username, password).then(
            response => {
                navigate("/")
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

    return (
        <Container>
            <ParticleBackground />
            <Grid container spacing={0} justifyContent="center" direction="row">
                <Grid item>
                    <Grid container direction="column" justifyContent="center" spacing={2} className="login-form">
                        <Paper variant="elevation" elevation={2} className="login-background">
                            <Grid item>
                                <Typography component="h1" variant="h5">{t("login.sign_into_account")}</Typography><br />
                            </Grid>
                            <Grid item>
                                <form onSubmit={handleLogin}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item>
                                            <TextField type="email" label={t("input.email")} fullWidth required autoFocus name="username" variant="outlined" value={username} onChange={e => setUsername(e.target.value)} />
                                        </Grid>
                                        <Grid item>
                                            <TextField type="password" label={t("input.password")} fullWidth required name="password" variant="outlined" value={password} onChange={e => setPassword(e.target.value)} />
                                        </Grid>
                                        <Grid item>
                                            <Button variant="contained" color="primary" type="submit" fullWidth>{t("buttons.sign_in")}</Button>
                                        </Grid>
                                        <Grid item>
                                            <LinkMUI component={Link} to="/register">{t("login.register_account")}</LinkMUI>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}

export default LoginPage
