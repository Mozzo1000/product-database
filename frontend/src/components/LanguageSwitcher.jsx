import React, { useState }  from 'react'
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
    const {t, i18n} = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        handleClose();
    };
  
    return (
        <>
        <IconButton onClick={handleClick} sx={{marginRight: 2}}>
            <LanguageIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => changeLanguage("en")}>
                🇺🇸 English
            </MenuItem>
        </Menu>
        </>
    )
}

export default LanguageSwitcher