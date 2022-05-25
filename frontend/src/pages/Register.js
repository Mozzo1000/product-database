import React, { useState, useEffect }  from 'react'
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import './Login.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AuthService from "../services/auth.service";
import Snackbar from '@mui/material/Snackbar';
import { useNavigate, Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import LinkMUI from '@mui/material/Link';

function RegisterPage(props) {
    document.title = "Register - product-database";
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordConf, setPasswordConf] = useState();
    const [passwordError, setPasswordError] = useState();
    const [registerButtonDisabled, setRegisterButtonDisabled] = useState(true);
    const [openStatusMessage, setOpenStatusMessage] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    let navigate = useNavigate();

    const handleCloseMessage = () => {
        setOpenStatusMessage(false);
    };

    const handleRegistration = (e) => {
        e.preventDefault();
        AuthService.register(email, name, password).then(
            response => {
                setStatusMessage(response.data["message"]);
                setOpenStatusMessage(true);
                setName("");
                setEmail("");
                setPassword("");
                setPasswordConf("");
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

    useEffect(() => {
        if (passwordConf !== password) {
            setPasswordError("Passwords do not match");
            setRegisterButtonDisabled(true);
        }
        if (!password && !passwordConf) {
            setPasswordError("");
        }
    }, [password, passwordConf])

    useEffect(() => {
        if (passwordConf === password) {
            if (passwordConf && password && email && name) { 
                setRegisterButtonDisabled(false);
                setPasswordError("")
            }
        }
    }, [password, passwordConf, email, name, passwordError])

    return (
        <Container>
           <ParticleBackground />
            <Grid container spacing={0} justifyContent="center" direction="row">
                <Grid item>
                    <Grid container direction="column" justifyContent="center" spacing={2} className="login-form">
                        <Paper variant="elevation" elevation={2} className="login-background">
                            <Grid item>
                                <Typography component="h1" variant="h5">Register new account</Typography><br />
                            </Grid>
                            <Grid item>
                                <form onSubmit={handleRegistration}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item>
                                            <TextField type="email" label="Email" fullWidth required autoFocus name="email" variant="outlined" value={email} onChange={e => setEmail(e.target.value)} />
                                        </Grid>
                                        <Grid item>
                                            <TextField type="name" label="Name" fullWidth required name="name" variant="outlined" value={name} onChange={e => setName(e.target.value)} />
                                        </Grid>
                                        <Grid item>
                                            <TextField type="password" fullWidth required label="Password" value={password} onChange={e => setPassword(e.target.value)} />
                                        </Grid>
                                        <Grid item>
                                            <TextField type="password" fullWidth required label="Confirm password" value={passwordConf} helperText={passwordError} onChange={e => setPasswordConf(e.target.value)} error={password !== passwordConf} />
                                        </Grid>
                                        <Grid item>
                                            <Button variant="contained" color="primary" type="submit" disabled={registerButtonDisabled} fullWidth>Register account</Button>
                                        </Grid>
                                        <Grid item>
                                            <LinkMUI component={Link} to="/login">Go to login</LinkMUI>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            <Snackbar open={openStatusMessage} autoHideDuration={6000} onClose={handleCloseMessage} message={statusMessage} />
        </Container>
    )
}

export default RegisterPage
