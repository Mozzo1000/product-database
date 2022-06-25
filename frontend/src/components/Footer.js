import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";

const heart = <span style={{color: '#e25555'}}>&hearts;</span>;

function Footer() {
  const {t, i18n} = useTranslation();

  return (
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px'}}>
        <Typography><span style={{opacity: 0.4}}>{t("footer.made_with")}</span> {heart} <span style={{opacity: 0.4}}>{t("footer.by")} <a href="https://andreasbackstrom.se" target="_blank" rel="noreferrer">Andreas Backström</a></span></Typography>
    </Box>
  )
}

export default Footer