import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { ListItemText, Tooltip } from '@mui/material';
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthService from '../services/auth.service';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import InventoryIcon from '@mui/icons-material/Inventory';

function Navbar() {
    let navigate = useNavigate();
    let location = useLocation();

    const currentUser = AuthService.getCurrentUser()

    const pages = [
        {name: 'Home', link: '/', icon: <HomeIcon sx={{color: 'white'}} />},
        {name: 'Products', link: "/products", icon: <InventoryIcon sx={{color: 'white'}} />},
    ];

    const pagesBottom = [
        {name: 'Settings', link: "/settings", icon: <SettingsIcon sx={{color: 'white'}} />},
    ];

    const settings = [
        {name: 'Sign out', action: "logout", icon: <LogoutIcon />},
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
        if(e === "logout") {
            AuthService.logout();
            navigate("/login");
        }
        handleCloseUserMenu();
    };

    return (
        <>
        <Box sx={{display: 'flex'}}>
            <AppBar position="fixed" sx={{width: { md: `calc(100% - ${240}px)` }, zIndex: 2, backgroundColor: 'white', color: 'black'}}>
                <Container maxWidth="x1">
                    <Toolbar disableGutters>
                        <Typography variant="h6" noWrap component="div" sx={{mr: 2, display: {xs: 'none', md: 'flex'}}}>
                            {pages.find(el => location.pathname === el.link)?.name}
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
                            CHANGE ME TO WHERE I AM ON MOBILE
                        </Typography>
                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}></Box>
                        {currentUser &&
                            <Box sx={{flexGrow: 0}}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                        <Avatar src={"http://localhost:5000/v1/users/storage/" + currentUser["image"]} alt="User" />
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
                                    <MenuItem component={Link} to="/settings">
                                        <Avatar src={"http://localhost:5000/v1/users/storage/" + currentUser["image"]}/> {currentUser["name"]}
                                    </MenuItem>
                                    <Divider />
                                    {settings.map((setting) => (
                                        <MenuItem key={setting.name} onClick={() => handleSettingsItemClick(setting.action)}>
                                            <ListItemIcon>{setting.icon}</ListItemIcon>
                                            <ListItemText primary={setting.name}/>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        }
                    </Toolbar>
                    
                </Container>
            </AppBar>
            <Drawer variant="permanent" sx={{zIndex: 1, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', color: 'white', backgroundColor: '#1d4dbc' }, mr: 2, display: {xs: 'none', md: 'flex'}}}>
                <Toolbar>
                    <Typography align="center" sx={{flexGrow: 1, textTransform: 'uppercase', letterSpacing: '0.05rem', fontWeight: '600'}}>
                            product-database
                    </Typography>
                </Toolbar>
                <Divider sx={{background: 'rgba(255, 255, 255, 0.15);'}} />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {pages.map((page) => (
                            <ListItem button key={page.name} component={Link} to={page.link} selected={location.pathname === page.link}>
                                <ListItemIcon>
                                    {page.icon}
                                </ListItemIcon>
                                <ListItemText primary={page.name}/>
                            </ListItem>
                        ))}
                    </List>
                    
                </Box>
                {currentUser && currentUser["role"] === "admin" &&   
                    <List sx={{marginTop: 'auto'}}>
                        {pagesBottom.map((page) => (
                            <ListItem button key={page.name} component={Link} to={page.link} selected={location.pathname === page.link}>
                                <ListItemIcon>
                                    {page.icon}
                                </ListItemIcon>
                                <ListItemText primary={page.name}/>
                            </ListItem>
                        ))}
                    </List>
                }
            </Drawer>
        </Box>
        </>
    )
}

export default Navbar
