import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Tooltip } from '@mui/material';
import { Link } from "react-router-dom";
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';

function Navbar() {
    let navigate = useNavigate();
    const currentUser = AuthService.getCurrentUser()

    const pages = [
        {name: 'Home', link: "/"},
        {name: 'Products', link: "/products"},
        {name: 'category', link: "/category"},
        {name: 'Brand', link: "/brand"},
    ];
    const settings = [
        {name: 'Sign out', action: "logout"},
    ];

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
  
    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };
  
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

    const handleSettingsItemClick = (e) => {
        console.log(e);
        if(e == "logout") {
            AuthService.logout();
            navigate("/login");
        }
    };

    return (
        <AppBar position="static">
            { currentUser &&
            <Container maxWidth="x1">
                <Toolbar disableGutters>
                    <Typography variant="h6" noWrap component="div" sx={{mr: 2, display: {xs: 'none', md: 'flex'}}}>
                        product-database
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                            <MenuIcon />
                        </IconButton>
                        <Menu 
                            id="menu-appbar" 
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom', 
                                horizontal: 'left',
                            }} 
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)} 
                            onClose={handleCloseNavMenu}
                            sx={{display: {xs: 'block', md: 'none'}}}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.name} component={Link} to={page.link}>
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        product-database
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Button key={page.name} component={Link} to={page.link} sx={{my: 2, color: 'white', display: 'block'}}>
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar alt="User" />
                            </IconButton>
                        </Tooltip>
                        <Menu 
                            sx={{mt: '45px'}} 
                            id="menu-appbar" 
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem>
                                <Avatar /> {currentUser["name"]}
                            </MenuItem>
                            <Divider />
                            {settings.map((setting) => (
                                <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                                    <Button onClick={() => handleSettingsItemClick(setting.action)} textAlign="center">{setting.name}</Button>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                </Toolbar>
            </Container>
            }
        </AppBar>
    )
}

export default Navbar
